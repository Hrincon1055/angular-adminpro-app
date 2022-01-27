import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
const base_url = environment.base_url;
@Injectable({
  providedIn: 'root',
})
export class ModalImagenService {
  private _oculatarModal: boolean = true;
  public tipo!: 'usuarios' | 'medicos' | 'hospitales';
  public id!: string | undefined;
  public img?: string;
  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();
  constructor() {}
  get ocultarModal(): boolean {
    return this._oculatarModal;
  }
  public abrirModal(
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string | undefined,
    img: string = 'no-img'
  ): void {
    this._oculatarModal = false;
    this.tipo = tipo;
    this.id = id;
    if (img.includes('https')) {
      this.img = img;
    } else {
      this.img = `${base_url}/upload/${tipo}/${img}`;
    }
  }
  public cerrarModal(): void {
    this._oculatarModal = true;
  }
}
