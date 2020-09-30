import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Usuario } from 'src/app/models/usuario';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formulario: FormGroup;
  usuario: Usuario;

  constructor(
    private builder: FormBuilder,
    private loginService: LoginService,
    private toast: ToastrService,
    private router: Router
  ) {
    this.formulario = this.builder.group(
      {
        email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
        password: ['', [Validators.required, Validators.minLength(5)]]
      });
  }

  ngOnInit(): void {
    document.title = 'LOGIN';
  }

  /**
   * Logearnos contra la API y guardar id, email, imagen y token en localStorage
   */
  login() {
    if (this.formulario.valid) {
      this.usuario = new Usuario();
      this.usuario.email = this.formulario.controls.email.value;
      this.usuario.password = this.formulario.controls.password.value;

      this.loginService.usuarioLogin(this.usuario).subscribe(result => {
        if (result.code === 200) {
          localStorage.setItem('usuario', this.formulario.controls.email.value);
          localStorage.setItem('id', result.data[0].id);
          localStorage.setItem('rol', result.data[0].rol);
          localStorage.setItem('imagen', result.data[0].imagen);
          localStorage.setItem('token', 'login-ok');

          if (result.data[0].rol === 1) {
            GLOBAL.administrador = true;
          } else {
            GLOBAL.administrador = false;
          }
          this.router.navigate(['productos']);
        } else {
          this.toast.error('Login incorrecto', 'Aviso', { timeOut: 3000, positionClass: 'toast-top-right' });
        }
      });
    } else {
      this.toast.error('Login incorrecto', 'Aviso', { timeOut: 3000, positionClass: 'toast-top-right' });
    }
  }
}
