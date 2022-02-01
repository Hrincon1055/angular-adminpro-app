import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;
  public clearImgSubs!: Subscription;
  constructor(
    private _usuarioService: UsuarioService,
    private _busquedasService: BusquedasService,
    private _modalImagenService: ModalImagenService
  ) {}
  ngOnDestroy(): void {
    this.clearImgSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarUsuarios();
    this.clearImgSubs = this._modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe((img) => this.cargarUsuarios());
  }
  public cargarUsuarios(): void {
    this.cargando = true;
    this._usuarioService
      .cargarUsuarios(this.desde)
      .subscribe(({ total, usuarios }) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      });
  }
  public cambiarPagina(valor: number): void {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }
  public buscar(termino: string): any {
    if (termino.length === 0) {
      return (this.usuarios = this.usuariosTemp);
    }
    this._busquedasService
      .buscar('usuarios', termino)
      .subscribe((response: Usuario[]) => {
        this.usuarios = response;
      });
  }
  public eliminarUsuario(usuario: Usuario): any {
    if (usuario.uid === this._usuarioService.uid) {
      return Swal.fire('Error', 'No puede borrar ese usuario', 'error');
    }
    Swal.fire({
      title: 'Borrar usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'si, borrar',
    }).then((result) => {
      if (result.isConfirmed) {
        this._usuarioService.eliminarUsuario(usuario).subscribe(() => {
          this.cargarUsuarios();
          Swal.fire(
            'Usuario borrado',
            `${usuario.nombre} fue eliminado correctamente`,
            'success'
          );
        });
      }
    });
  }
  public cambiarRole(usuario: Usuario) {
    this._usuarioService.guardarUsuario(usuario).subscribe((response) => {
      console.log(response);
    });
  }
  public abrirModal(usuario: Usuario) {
    this._modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }
}
