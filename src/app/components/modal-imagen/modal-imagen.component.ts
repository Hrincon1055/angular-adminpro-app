import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [],
})
export class ModalImagenComponent implements OnInit {
  public imagenSubir!: File;
  public imgTemp: any;
  constructor(
    public modalImagenService: ModalImagenService,
    private _fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {}

  public cerrarModal(): void {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
  }
  public cambiarImagen(event: any): any {
    const file: File = event.target.files[0];
    this.imagenSubir = file;
    if (!file) return (this.imgTemp = null);
    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }
  public subirImagen(): void {
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;
    this._fileUploadService
      .actualizarFoto(this.imagenSubir, tipo, id)
      .then((img) => {
        Swal.fire('Guardado', 'Imagen de usuario actualizada.', 'success');
        this.modalImagenService.nuevaImagen.emit(img);
        this.cerrarModal();
      })
      .catch((err) => {
        Swal.fire('Guardado', 'No se pudo subir la imagen.', 'error');
      });
  }
}
