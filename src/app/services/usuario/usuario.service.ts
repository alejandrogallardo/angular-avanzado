import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from 'src/app/models/usuario.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import Swal from 'sweetalert2'

import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];

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
      this.menu = JSON.parse(localStorage.getItem('menu'));
    }else {
      this.token = '';
      this.usuario = null;
      this.menu = []; // en caso no existe se destruye
    }
  }

  //------------------------
  // Pendiente funcion guardarStorage
  //------------------------
  guardarStorage( id: string, token: string, usuario: Usuario, menu: any ){
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));
  
    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }
  
  logout(){
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');
    
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
        this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu );

        // guardar recuerdame en localstogare, luego se crea funcion
        // localStorage.setItem('id', resp.id);
        // localStorage.setItem('token', resp.token);
        // localStorage.setItem('usuario', JSON.stringify(resp.id));
        return true;
      }),
      catchError(err => {
        console.log(err.status);
        // add sweetalert
        console.log(err.message);
        return throwError(err.message)
      })
      );
  
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

        if( usuario._id === this.usuario._id ){
          let usuarioDB: Usuario = resp.usuario;
          this.guardarStorage( usuarioDB._id, this.token, usuarioDB, this.menu);
        }

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
          this.guardarStorage( id, this.token, this.usuario, this.menu);

      })
      .catch(error => {
        console.log(error);
      })
  }

  //------------------------
  // Cargar Usuarios
  //------------------------
  cargarUsuarios( desde: number = 0 ){

    let url = `${URL_SERVICIOS}/usuario?desde=${desde}`;

    return this.http.get(url);

  }

  //------------------------
  // Buscar Usuarios
  //------------------------
  bucarUsuarios( termino: string ){

    let url = `${URL_SERVICIOS}/busqueda/coleccion/usuarios/${termino}`;

    return this.http.get(url)
      .pipe(map(( resp: any ) => resp.usuarios ));

  }

  //------------------------
  // Borrar Usuarios
  //------------------------
  borrarUsuario( id: string ){
    let url = `${URL_SERVICIOS}/usuario/${id}`;
    url += '?token=' + this.token;
    return this.http.delete(url);
  }

}
