import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
  
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  recuerdame: boolean = false;
  email: string;

  constructor( public router: Router,
               public _usuarioService: UsuarioService ) { }

  ngOnInit() {
    // El ngOnInit se dispara cada vez que se entra a la pagina
    init_plugins();
    this.email = localStorage.getItem('email') || '';
    // para que recuerdame se quede marcado
    if ( this.email.length > 1 ){
      this.recuerdame = true;
    }
  }

  ingresar( forma: NgForm ){
    
    if ( forma.invalid ){
      return;
    }

    let usuario = new Usuario( null, forma.value.email, forma.value.password );

    this._usuarioService.login( usuario, forma.value.recuerdame )
      .subscribe( resp => this.router.navigate(['/dashboard']));
    // console.log( forma.value );
    // console.log( forma.valid );
    //this.router.navigate(['/dashboard']);
  }


}
