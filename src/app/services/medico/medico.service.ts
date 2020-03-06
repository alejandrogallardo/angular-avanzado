import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { Medico } from 'src/app/models/medico.model';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarMedicos(){
    
    let url = URL_SERVICIOS + '/medico';
    
    return this.http.get(url)
          .pipe(map((resp: any) => {
            this.totalMedicos = resp.total
            return resp.medicos
          }))
  }

  //------------------------
  // Buscar Medico
  //------------------------
  cargarMedico( id: string ){
    let url = `${URL_SERVICIOS}/medico/${id}`;
    return this.http.get(url)
      .pipe(map(( resp: any ) => resp.medico ));
  }



 //------------------------
 // Buscar Medico
 //------------------------
  bucarMedicos( termino: string ){

    let url = `${URL_SERVICIOS}/busqueda/coleccion/medicos/${termino}`;

    return this.http.get(url)
      .pipe(map(( resp: any ) => resp.medicos ));

  }

  //------------------------
  // Borrar Medico
  //------------------------
  borrarMedico( id: string ){
    let url = `${URL_SERVICIOS}/medico/${id}`;
    url += '?token=' + this._usuarioService.token;
    return this.http.delete(url)
    .pipe(map( (resp: any) => {

      Swal.fire({
        title: 'Medico Borrado', 
        text: 'Eliminado Correctamente', 
        icon: 'success'})

        return resp;
    }))
  }

  guardarMedico( medico: Medico ){

    let url = URL_SERVICIOS + '/medico';

    if ( medico._id ) {
      // Actualizar
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;
      
      return this.http.put( url, medico )
        .pipe(map( (resp: any) => {
  
          Swal.fire({
            title: 'Medico Actualizado', 
            text: medico.nombre, 
            icon: 'success'})
          return resp;
      }))

    } else {
      // Crear
      url += '?token=' + this._usuarioService.token;
  
      return this.http.post( url, medico )
      .pipe(map( (resp: any) => {
  
        Swal.fire({
          title: 'Medico Creado', 
          text: medico.nombre, 
          icon: 'success'})
  
          return resp;
          //return resp.medico;
      }))
    }
  }


}
