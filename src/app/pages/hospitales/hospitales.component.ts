import { Component, OnInit } from '@angular/core';
import { HospitalService } from 'src/app/services/service.index';
import { Hospital } from 'src/app/models/hospital.model';
import Swal from 'sweetalert2';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

//declare var Swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];

  constructor(
    public _hospitalService: HospitalService,
    public _modelUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modelUploadService.notificacion
      .subscribe(() => this.cargarHospitales() );
  }

  cargarHospitales(){
    this._hospitalService.cargarHospitales()
      .subscribe( hospitales => this.hospitales = hospitales );
  }

  buscarHospital( termino: string) {

    if ( termino.length <= 0 ){
      this.cargarHospitales();
      return;
    }
    this._hospitalService.bucarHospital(termino)
      .subscribe( hospitales => this.hospitales = hospitales )
  }

  guardarHospital( hospital: Hospital ){
    this._hospitalService.actualizarHospital( hospital )
      .subscribe();
  }

  borrarHospital( hospital: Hospital ){
    this._hospitalService.borrarHospital( hospital._id )
      .subscribe(() => this.cargarHospitales() );
  }

  crearHospital() {
    
  
    Swal.fire({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del hospital',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Guardar',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading()
    }).then(( valor ) => {
      if ( !valor.value || valor.value.length === 0 ) {
        return;
      }

      this._hospitalService.crearHospital( valor.value )
        .subscribe( () => this.cargarHospitales() );
    })

  }

  actualizarImagen( hospital: Hospital ) {
    this._modelUploadService.mostrarModal( 'hospitales', hospital._id );
  }

}
