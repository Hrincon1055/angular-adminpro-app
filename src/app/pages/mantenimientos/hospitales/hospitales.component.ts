import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Hospital } from '../../../models/hospital.model';
import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [],
})
export class HospitalesComponent implements OnInit, OnDestroy {
  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public clearImgSubs!: Subscription;
  constructor(
    private _hospitalService: HospitalService,
    private _modalImagenService: ModalImagenService,
    private _busquedasService: BusquedasService
  ) {}
  ngOnDestroy(): void {
    this.clearImgSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarHospitales();
    this.clearImgSubs = this._modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe((img) => this.cargarHospitales());
  }
  public buscar(termino: string): any {
    if (termino.length === 0) {
      return this.cargarHospitales();
    }
    this._busquedasService
      .buscar('hospitales', termino)
      .subscribe((response: Hospital[]) => {
        this.hospitales = response;
      });
  }
  public cargarHospitales(): void {
    this.cargando = true;
    this._hospitalService
      .cargarHospitales()
      .subscribe((hospitales: Hospital[]) => {
        this.cargando = false;
        this.hospitales = hospitales;
      });
  }
  public guardarCambios(hospital: Hospital) {
    this._hospitalService
      .actualizarHospital(hospital.nombre, hospital._id)
      .subscribe((response) => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      });
  }
  public eliminarHospital(hospital: Hospital) {
    this._hospitalService
      .eliminarHospital(hospital._id)
      .subscribe((response) => {
        this.cargarHospitales();
        Swal.fire('Borrado', hospital.nombre, 'success');
      });
  }
  public async abrirSweeAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear Hospital',
      input: 'text',
      inputLabel: 'Ingresa el nombre del hospital',
      inputPlaceholder: 'Nombre',
      showCancelButton: true,
    });
    if (value?.trim().length) {
      this._hospitalService.crearHospital(value).subscribe((response: any) => {
        this.hospitales.unshift(response.hospital);
      });
    }
  }
  public abrirModal(hospital: Hospital) {
    this._modalImagenService.abrirModal(
      'hospitales',
      hospital._id,
      hospital.img
    );
  }
}
