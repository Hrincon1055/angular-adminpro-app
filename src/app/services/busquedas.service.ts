import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';
const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class BusquedasService {
  public usuario!: Usuario;
  constructor(private _http: HttpClient) {}
  get token(): string {
    return localStorage.getItem('token-adminpro') || '';
  }
  get headers(): Object {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }
  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      (usuario) =>
        new Usuario(
          usuario.nombre,
          usuario.email,
          usuario.google,
          usuario.img,
          usuario.role,
          usuario.uid
        )
    );
  }
  private transformarHospitales(resultados: any[]): Hospital[] {
    return resultados;
  }
  private transformarMedicos(resultados: any[]): Medico[] {
    return resultados;
  }

  public buscar(
    tipo: 'hospitales' | 'medicos' | 'usuarios',
    termino: string
  ): any {
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this._http
      .get<Usuario[] | Hospital[] | Medico[]>(url, this.headers)
      .pipe(
        map((response: any) => {
          switch (tipo) {
            case 'usuarios':
              return this.transformarUsuarios(response.data);
            case 'hospitales':
              return this.transformarHospitales(response.data);
            case 'medicos':
              return this.transformarMedicos(response.data);
            default:
              return [];
          }
        })
      );
  }
}
