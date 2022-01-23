import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
declare const gapi: any;
const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public auth2: any;
  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _ngZone: NgZone
  ) {
    this.googleInit();
  }

  public googleInit() {
    return new Promise<void>((resolve) => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id:
            '503584228784-7gb1f8ppkgcjeheevj87pp9vuru3hgml.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    });
  }
  public logout() {
    localStorage.removeItem('token-adminpro');
    this.auth2.signOut().then(() => {
      this._ngZone.run(() => {
        this._router.navigateByUrl('/login');
      });
    });
  }
  public validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token-adminpro') || '';
    return this._http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': token,
        },
      })
      .pipe(
        tap((response: any) => {
          localStorage.setItem('token-adminpro', response.token);
        }),
        map((response: any) => true),
        catchError((err) => of(false))
      );
  }
  public crearUsuario(formData: RegisterForm): Observable<any> {
    return this._http.post(`${base_url}/usuarios`, formData).pipe(
      tap((response: any) => {
        localStorage.setItem('token-adminpro', response.token);
      })
    );
  }
  public login(formData: LoginForm): Observable<any> {
    return this._http.post(`${base_url}/login`, formData).pipe(
      tap((response: any) => {
        localStorage.setItem('token-adminpro', response.token);
      })
    );
  }
  public loginGoogle(token: any): Observable<any> {
    return this._http.post(`${base_url}/login/google`, { token }).pipe(
      tap((response: any) => {
        localStorage.setItem('token-adminpro', response.token);
      })
    );
  }
}
