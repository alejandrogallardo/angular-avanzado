import { NgModule } from '@angular/core';
import { ImagenPipe } from './imagen.pipe';


@NgModule({
  declarations: [
    ImagenPipe
  ],
  imports: [
  ],
  exports: [ // para usar fuera del modulo
    ImagenPipe 
  ]
})
export class PipesModule { }
