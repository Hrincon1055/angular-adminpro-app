import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [],
})
export class PerfilComponent implements OnInit {
  public perfilForm!: FormGroup;
  public usuario: Usuario;
  public imagenSubir!: File;
  public imgTemp: any;
  constructor(
    private _fb: FormBuilder,
    private _usuarioService: UsuarioService,
    private _fileUploadService: FileUploadService
  ) {
    this.usuario = this._usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this._fb.group({
      nombre: [this.usuario.nombre, [Validators.required]],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }
  public actualizarPerfil(): void {
    this._usuarioService.actualizarPerfil(this.perfilForm.value).subscribe(
      () => {
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        Swal.fire('Guardado', 'Usuario actualizado.', 'success');
      },
      (err) => {
        Swal.fire('Guardado', err.error.msg, 'error');
      }
    );
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
    this._fileUploadService
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid!)
      .then((response) => {
        this.usuario.img = response;
        Swal.fire('Guardado', 'Imagen de usuario actualizada.', 'success');
      })
      .catch((err) => {
        Swal.fire('Error', 'No se pudo subir la imagen.', 'error');
      });
  }
}
