import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { Observable, of } from 'rxjs';
import { tap, map, catchError, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

declare const gapi: any;
const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public auth2: any;
  public usuario!: Usuario;
  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _ngZone: NgZone
  ) {
    this.googleInit();
  }
  get token(): string {
    return localStorage.getItem('token-adminpro') || '';
  }
  get uid(): string {
    return this.usuario.uid || '';
  }
  get headers(): Object {
    return {
      headers: {
        'x-token': this.token,
      },
    };
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
    return this._http
      .get(`${base_url}/login/renew`, {
        headers: {
          'x-token': this.token,
        },
      })
      .pipe(
        map((response: any) => {
          const {
            email,
            google,
            img = '',
            nombre,
            role,
            uid,
          } = response.usuario;
          this.usuario = new Usuario(nombre, email, google, img, role, uid, '');
          localStorage.setItem('token-adminpro', response.token);
          return true;
        }),
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
  public actualizarPerfil(formData: {
    email: string;
    nombre: string;
    role: string | undefined;
  }) {
    formData = {
      ...formData,
      role: this.usuario.role,
    };
    return this._http.put(
      `${base_url}/usuarios/${this.uid}`,
      formData,
      this.headers
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
  public cargarUsuarios(desde: number = 0): Observable<CargarUsuario> {
    const url = `${base_url}/usuarios?desde=${desde}`;
    return this._http.get<CargarUsuario>(url, this.headers).pipe(
      delay(1000),
      map((response) => {
        const usuarios = response.usuarios.map(
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
        return {
          total: response.total,
          usuarios,
        };
      })
    );
  }
  public eliminarUsuario(usuario: Usuario) {
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this._http.delete(url, this.headers);
  }
  public guardarUsuario(usuario: Usuario) {
    return this._http.put(
      `${base_url}/usuarios/${usuario.uid}`,
      usuario,
      this.headers
    );
  }
}
