import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [],
})
export class MedicoComponent implements OnInit {
  public medicoForm!: FormGroup;
  public hospitales!: Hospital[];
  public hospitalSeleccionado!: Hospital | undefined;
  public medicoSeleccionado!: Medico;
  constructor(
    private _fb: FormBuilder,
    private _hospitalService: HospitalService,
    private _medicoService: MedicoService,
    private _router: Router,
    private _activatedRouted: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._activatedRouted.params.subscribe(({ id }) => {
      this.cargarMedico(id);
    });
    // this._medicoService.cargarMedicoPorId()
    this.cargarHospitales();
    this.medicoForm = this._fb.group({
      nombre: ['', [Validators.required]],
      hospital: ['', [Validators.required]],
    });
    this.medicoForm.get('hospital')?.valueChanges.subscribe((hospitalId) => {
      this.hospitalSeleccionado = this.hospitales.find(
        (h) => h._id === hospitalId
      );
    });
  }
  public cargarMedico(id: string) {
    if (id === 'nuevo') {
      return;
    }
    this._medicoService
      .cargarMedicoPorId(id)
      .pipe(delay(100))
      .subscribe(
        (medico) => {
          const {
            nombre,
            hospital: { _id },
          } = medico;
          this.medicoSeleccionado = medico;
          this.medicoForm.setValue({ nombre, hospital: _id });
        },
        (err) => {
          return this._router.navigateByUrl(`/dashboard/medicos`);
        }
      );
  }
  public cargarHospitales(): void {
    this._hospitalService
      .cargarHospitales()
      .subscribe((hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      });
  }
  public guardarMedico(): void {
    const { nombre } = this.medicoForm.value;
    if (this.medicoSeleccionado) {
      // actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id,
      };
      this._medicoService.actualizarMedico(data).subscribe((response) => {
        Swal.fire(
          'Actualizado',
          `${nombre} Actualizado correctamente.`,
          'success'
        );
      });
    } else {
      // Crear medico

      this._medicoService
        .crearMedico(this.medicoForm.value)
        .subscribe((response) => {
          Swal.fire('Creado', `${nombre} creado correctamente.`, 'success');
          this._router.navigateByUrl(
            `/dashboard/medico/${response.medico._id}`
          );
        });
    }
  }
}
