import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Medico } from '../models/medico.model';
import { Observable } from 'rxjs';
const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class MedicoService {
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
  public cargarMedicos(): Observable<Medico[]> {
    const url = `${base_url}/medicos`;
    return this._http
      .get<Medico[]>(url, this.headers)
      .pipe(map((response: any) => response.medicos));
  }
  public cargarMedicoPorId(id: string) {
    const url = `${base_url}/medicos/${id}`;
    return this._http
      .get(url, this.headers)
      .pipe(map((response: any) => response.medico));
  }
  public crearMedico(medico: { nombre: string; hospital: string }): Observable<{
    ok: boolean;
    medico: Medico;
  }> {
    const url = `${base_url}/medicos`;
    return this._http.post<{ ok: boolean; medico: Medico }>(
      url,
      medico,
      this.headers
    );
  }
  public actualizarMedico(medico: Medico) {
    const url = `${base_url}/medicos/${medico._id}`;
    return this._http.put(url, medico, this.headers);
  }
  public eliminarMedico(_id: string | undefined) {
    const url = `${base_url}/medicos/${_id}`;
    return this._http.delete(url, this.headers);
  }
}
