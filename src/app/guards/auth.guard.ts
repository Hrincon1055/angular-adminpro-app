import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { tap } from 'rxjs/operators';

import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private _usuarioService: UsuarioService,
    private _router: Router
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this._usuarioService.validarToken().subscribe((response) => {
      console.log(response);
    });

    return this._usuarioService.validarToken().pipe(
      tap((isAuth) => {
        if (!isAuth) {
          this._router.navigateByUrl('/login');
        }
      })
    );
  }
}
