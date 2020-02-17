import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';
import Swal from 'sweetalert2'
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargango: boolean = true;

  constructor(
    public _usuarioService: UsuarioService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this._modalUploadService.notificacion
      .subscribe( resp => this.cargarUsuarios() );
  }

  cargarUsuarios(){
    this.cargango = true;
    this._usuarioService.cargarUsuarios(this.desde)
      .subscribe( (resp: any) => {
        console.log(resp);
        this.totalRegistros = resp.total;
        this.usuarios = resp.usuarios;
        this.cargango = false;
      });
  }

  cambiarDesde( valor: number ){
    let desde = this.desde + valor;
    console.log(desde);

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();

  }

  buscarUsuario( termino: string ){

    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return
    }

    this.cargango = true;

    this._usuarioService.bucarUsuarios( termino )
      .subscribe( ( usuarios: Usuario[] ) => {
        // console.log(usuarios);
        this.usuarios = usuarios;
        this.cargango = false;
      })
  }

  borrarUsuario( usuario: Usuario ) {
    
    console.log(usuario);

    if ( usuario._id === this._usuarioService.usuario._id ) {
      Swal.fire({
        title: 'Error al borrar usuario', 
        text: 'No se puede borrar a si mismo', 
        icon: 'error'
      })
      return;
    }

    Swal.fire({
      title: '¿Esta seguro?',
      text: "Esta a punto de borrar a: " + usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(( borrar ) => {
      if ( borrar.value ) {

        this._usuarioService.borrarUsuario( usuario._id )
          .subscribe( resp => {
            console.log(resp);
            this.cargarUsuarios();
            
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )

          })

      }
    })
  }

  guardarUsuario( usuario: Usuario ){
    this._usuarioService.actualizarUsuario( usuario )
      .subscribe();
  }

  mostrarModal( id: string ){
    this._modalUploadService.mostrarModal('usuarios', id);
  }

}
