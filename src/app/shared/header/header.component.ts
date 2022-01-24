import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent implements OnInit {
  public usuario: Usuario;
  constructor(private _usuarioService: UsuarioService) {
    this.usuario = this._usuarioService.usuario;
  }
  ngOnInit(): void {}
  public logout() {
    this._usuarioService.logout();
  }
}
