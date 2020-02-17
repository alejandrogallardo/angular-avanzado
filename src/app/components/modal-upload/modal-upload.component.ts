import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SubirArchivoService } from 'src/app/services/service.index';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string | ArrayBuffer;

  constructor(
    public _subirArchivoService: SubirArchivoService,
    public _modalUploasService: ModalUploadService
  ) {
    console.log('Modal listo');
   }

  ngOnInit() {
  }

  seleccionImagen( archivo: File ) {
    // console.log(event);
    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0 ) {
      
      Swal.fire({
        title: 'Solo Imagenes', 
        text: 'El archivo debe ser una imagen', 
        icon: 'error'});
        this.imagenSubir = null;
        return;
    }

    this.imagenSubir = archivo;

    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL( archivo );
    reader.onloadend = () => this.imagenTemp = reader.result;

  }

  subirImagen(){
    this._subirArchivoService.subirArchivo( this.imagenSubir, this._modalUploasService.tipo, this._modalUploasService.id )
      .then( resp => {
        
        this._modalUploasService.notificacion.emit(resp);
        this.cerrarModal();
      })
      .catch( err => {
        console.log('Error en la carga...');
        console.error(err);
      })
  }

  cerrarModal(){
    this.imagenSubir = null;
    this.imagenTemp = null;
    this._modalUploasService.ocultarModal();
  }

}
