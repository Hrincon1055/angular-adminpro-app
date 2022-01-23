import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public formSubmittted: boolean = false;
  public registerForm = this._fb.group(
    {
      nombre: ['Test 100', [Validators.required, Validators.minLength(3)]],
      email: ['test100@test.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
      password2: ['123456', [Validators.required, Validators.minLength(6)]],
      terminos: [true, Validators.required],
    },
    { validators: this.passwordIguales('password', 'password2') }
  );
  constructor(
    private _fb: FormBuilder,
    private _usuarioService: UsuarioService,
    private _router: Router
  ) {}
  ngOnInit(): void {}
  public crearUsuario(): void {
    this.formSubmittted = true;
    if (this.registerForm.invalid) {
      return;
    }
    // creacion
    this._usuarioService.crearUsuario(this.registerForm.value).subscribe(
      (response) => {
        this._router.navigateByUrl('/');
      },
      (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }
  public campoNoValido(campo: string): boolean {
    if (this.registerForm.get(campo)?.invalid && this.formSubmittted) {
      return true;
    } else {
      return false;
    }
  }
  public aceptarTerminos(): boolean {
    return !this.registerForm.get('terminos')?.value && this.formSubmittted;
  }
  public passwordNoValidas(): boolean {
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;
    if (pass1 !== pass2 && this.formSubmittted) {
      return true;
    } else {
      return false;
    }
  }
  public passwordIguales(pass1: string, pass2: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);
      if (pass1Control?.value === pass2Control?.value) {
        pass2Control?.setErrors(null);
      } else {
        pass2Control?.setErrors({ noEsIgual: true });
      }
    };
  }
}
