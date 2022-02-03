import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusquedasService } from '../../services/busquedas.service';
import { Usuario } from '../../models/usuario.model';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [],
})
export class BusquedaComponent implements OnInit {
  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _busquedasService: BusquedasService
  ) {}

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(({ termino }) => {
      this.busquedaGlobal(termino);
    });
  }
  public busquedaGlobal(termino: string) {
    this._busquedasService
      .busquedaGlobal(termino)
      .subscribe((response: any) => {
        this.usuarios = response.usuarios;
        this.medicos = response.medicos;
        this.hospitales = response.hospitales;
      });
  }
  abrirMedico(medico: Medico) {}
}
