import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/service.index';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  nombreU: string;
  usuario: Usuario;
  
  constructor( public _usuarioService: UsuarioService,
    public router: Router ) { }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
    this.nombreU = this._usuarioService.usuario.nombre;
    console.log('Imagn en header ', this.usuario.img);
    console.log('Usuario en header ', this.usuario);
  }

  buscar( termino: String ){
    this.router.navigate(['/busqueda', termino]);
  }

}
