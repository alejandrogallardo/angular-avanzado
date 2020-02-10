import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from 'src/app/models/usuario.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import Swal from 'sweetalert2'

import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor( public http: HttpClient,
              public router: Router,
              public _subirArchivoService: SubirArchivoService ) { 
    // Importar el HttpClientModule en service.module
    console.log('Servicio de usuario listo');
    this.cargarStorage();
  }

  estaLogeado(){
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage(){
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    }else {
      this.token = '';
      this.usuario = null;
    }
  }

  //------------------------
  // Pendiente funcion guardarStorage
  //------------------------
  guardarStorage( id: string, token: string, usuario: Usuario ){
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  
    this.usuario = usuario;
    this.token = token;
  }
  
  logout(){
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    
    this.router.navigate(['/login']);

  }

  //------------------------
  // Pendiente Login con google
  //------------------------

  login( usuario: Usuario, recordar: boolean = false ){

    if ( recordar ) {
      localStorage.setItem('email', usuario.email );
    } else {
      localStorage.removeItem('email');
    }

    let url = `${URL_SERVICIOS}/login`;
    return this.http.post( url, usuario )
      .pipe(map( ( resp: any ) => {
        this.guardarStorage( resp.id, resp.token, resp.usuario );

        // guardar recuerdame en localstogare, luego se crea funcion
        // localStorage.setItem('id', resp.id);
        // localStorage.setItem('token', resp.token);
        // localStorage.setItem('usuario', JSON.stringify(resp.id));
        return true;
      }));
  }

  crearUsuario( usuario: Usuario ){
  
    let url = URL_SERVICIOS + '/usuario';

    return this.http.post( url, usuario )
      .pipe(map( (resp: any) => {

        Swal.fire({
          title: 'Usuario Creado', 
          text: usuario.email, 
          icon: 'success'})
        return resp.usuario
      }))
  
  }

  //------------------------
  // Actualizar Usuario
  //------------------------
  
  actualizarUsuario( usuario: Usuario ){

    // let url = URL_SERVICIOS + /usuario/ + usuario._id;
    // url += '?token=' + this.token;
    // return this.http.put( url, usuario );

    let url = URL_SERVICIOS + /usuario/ + usuario._id;
    url += '?token=' + this.token;
    return this.http.put( url, usuario )
      .pipe(map((resp: any) => {
        let usuarioDB: Usuario = resp.usuario;
        
        this.guardarStorage( usuarioDB._id, this.token, usuarioDB);

        Swal.fire({
          title: 'Usuario Actualizado', 
          text: usuario.email, 
          icon: 'success'})

        return true;
      }))


  }

  //------------------------
  // Subir Archivo
  //------------------------
  cambiarImagen( archivo: File, id: string ){
    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
      .then( (resp: any) => {
        
        this.usuario.img = resp.usuario.img;
        Swal.fire({
          title: 'Imagen Actualizada', 
          text: this.usuario.nombre, 
          icon: 'success'});
          this.guardarStorage( id, this.token, this.usuario);

      })
      .catch(error => {
        console.log(error);
      })
  }

}
