import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styles: []
})
export class ProgressComponent implements OnInit {

  progreso1: number = 30;
  progreso2: number = 20;

  constructor() { }

  ngOnInit() {
  }

  /**
   * Esto es una forma de hacerlo
   * la otra esta en el html
   */
  // actualizar( event: number ){
  //   console.log( 'Evento: ', event );
  //   this.progreso1 = event;
  // }

}
