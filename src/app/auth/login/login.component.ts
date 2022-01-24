import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

declare const gapi: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public auth2!: any;
  public loginForm = this._fb.group({
    email: [
      localStorage.getItem('email-adminpro') || '',
      [Validators.required, Validators.email],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false],
  });

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _usuarioService: UsuarioService,
    private _ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.renderButton();
  }
  public login() {
    this._usuarioService.login(this.loginForm.value).subscribe(
      (response) => {
        if (this.loginForm.get('remember')?.value) {
          localStorage.setItem(
            'email-adminpro',
            this.loginForm.get('email')?.value
          );
        } else {
          localStorage.removeItem('email-adminpro');
        }
        this._router.navigateByUrl('/');
      },
      (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  public renderButton() {
    gapi.signin2.render('my-signin2', {
      scope: 'profile email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark',
    });
    this.startApp();
  }
  public async startApp() {
    await this._usuarioService.googleInit();
    this.auth2 = this._usuarioService.auth2;
    this.attachSignin(document.getElementById('my-signin2'));
  }
  attachSignin(element: any) {
    this.auth2.attachClickHandler(
      element,
      {},
      (googleUser: any) => {
        const id_token = googleUser.getAuthResponse().id_token;
        this._usuarioService.loginGoogle(id_token).subscribe((response) => {
          this._ngZone.run(() => {
            this._router.navigateByUrl('/');
          });
        });
      },
      function (error: any) {
        alert(JSON.stringify(error, undefined, 2));
      }
    );
  }
}
