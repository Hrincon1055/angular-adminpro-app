import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent implements OnInit {
  public usuario: Usuario;
  constructor(
    private _usuarioService: UsuarioService,
    private _router: Router
  ) {
    this.usuario = this._usuarioService.usuario;
  }
  ngOnInit(): void {}
  public logout() {
    this._usuarioService.logout();
  }
  public buscar(termino: string): void {
    if (termino.length === 0) {
      return;
    }
    this._router.navigateByUrl(`/dashboard/buscar/${termino}`);
  }
}
