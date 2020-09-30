import { Component, OnInit, DoCheck, AfterViewInit, AfterViewChecked } from '@angular/core';
import { GLOBAL } from './services/global';
import { Usuario } from './models/usuario';
import { UsuariosService } from './services/usuarios.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {
  title = 'proyectoFinal';
  usuario: string;
  id: string;
  user: Usuario;
  administrador: boolean;
  urlResource: string;
  imagen: string;

  constructor(
    private usuarioService: UsuariosService
  ) { }

  /**
   * Checkear rol de usuario logeado
   * Obtener imagen de localStorage
   */
  ngOnInit(): void {
    this.checkRol();
    this.urlResource = GLOBAL.urlResourcesUsuarios;
    this.imagen = localStorage.getItem('imagen');
  }

  /**
   * Checkear rol de usuario logeado
   * Obtener imagen de localStorage
   */
  ngDoCheck(): void {
    this.usuario = localStorage.getItem('usuario');
    this.id = localStorage.getItem('id');
    this.administrador = GLOBAL.administrador;
    this.urlResource = GLOBAL.urlResourcesUsuarios;
    this.imagen = localStorage.getItem('imagen');
  }

  /**
   * Cerrar sesión actual
   */
  cerrarSesion() {
    localStorage.clear();
  }

  /**
   * Obtener datos de usuario de localStorage
   * Obtener rol de usuario desde API
   */
  checkRol() {
    this.usuario = localStorage.getItem('usuario');
    this.id = localStorage.getItem('id');
    this.user = new Usuario();
    this.user.id = parseInt(this.id, null);
    this.user.email = this.usuario;
    this.usuarioService.obtenerRol(this.user).subscribe(result => {
      console.log('rol', result);
      if (result.data[0].rol === 1) {
        GLOBAL.administrador = true;
        this.administrador = GLOBAL.administrador;
      }
    });
  }
}
