import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Hospital } from '../models/hospital.model';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';
const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  public hospital!: Hospital;
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
  public cargarHospitales(): Observable<Hospital[]> {
    const url = `${base_url}/hospitales`;
    return this._http.get<Hospital[]>(url, this.headers).pipe(
      map((response: any) => {
        return response.hospitales;
      })
    );
  }
  public crearHospital(nombre: string) {
    const url = `${base_url}/hospitales`;
    return this._http.post(url, { nombre }, this.headers);
  }
  public actualizarHospital(nombre: string, _id: string | undefined) {
    const url = `${base_url}/hospitales/${_id}`;
    return this._http.put(url, { nombre }, this.headers);
  }
  public eliminarHospital(_id: string | undefined) {
    const url = `${base_url}/hospitales/${_id}`;
    return this._http.delete(url, this.headers);
  }
}
