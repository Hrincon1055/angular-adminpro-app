import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private _usuarioService: UsuarioService,
    private _router: Router
  ) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this._usuarioService.validarToken().pipe(
      tap((isAuth) => {
        if (!isAuth) {
          this._router.navigateByUrl('/login');
        }
      })
    );
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._usuarioService.validarToken().pipe(
      tap((isAuth) => {
        if (!isAuth) {
          this._router.navigateByUrl('/login');
        }
      })
    );
  }
}
