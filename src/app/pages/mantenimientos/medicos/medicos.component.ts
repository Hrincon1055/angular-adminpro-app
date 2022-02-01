import { Component, OnDestroy, OnInit } from '@angular/core';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [],
})
export class MedicosComponent implements OnInit, OnDestroy {
  public medicos: Medico[] = [];
  public cargando: boolean = true;
  public clearImgSubs!: Subscription;
  constructor(
    private _medicoService: MedicoService,
    private _modalImagenService: ModalImagenService,
    private _busquedasService: BusquedasService
  ) {}
  ngOnDestroy(): void {
    this.clearImgSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.cargatMedicos();
    this.clearImgSubs = this._modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe((img) => this.cargatMedicos());
  }
  public cargatMedicos(): void {
    this.cargando = true;
    this._medicoService.cargarMedicos().subscribe((response: Medico[]) => {
      this.cargando = false;
      this.medicos = response;
    });
  }
  public abrirModal(medico: Medico): void {
    this._modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }
  public buscar(termino: string): void {
    if (termino.length === 0) {
      return this.cargatMedicos();
    }
    this._busquedasService
      .buscar('medicos', termino)
      .subscribe((response: Medico[]) => {
        this.medicos = response;
      });
  }
  public borrarMedico(medico: Medico) {
    Swal.fire({
      title: 'Borrar usuario?',
      text: `Esta a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'si, borrar',
    }).then((result) => {
      if (result.isConfirmed) {
        this._medicoService.eliminarMedico(medico._id).subscribe(() => {
          this.cargatMedicos();
          Swal.fire(
            'Médico borrado',
            `${medico.nombre} fue eliminado correctamente`,
            'success'
          );
        });
      }
    });
  }
}
