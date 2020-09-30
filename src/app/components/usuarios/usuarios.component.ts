import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { GLOBAL } from '../../services/global';
import { Usuario } from 'src/app/models/usuario';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any = [];
  urlResources: string;
  tablaCargada: boolean;
  usuario: Usuario;
  userSeleccionado: Usuario;
  mailFilter: string;

  constructor(
    private usuarioService: UsuariosService,
    private toast: ToastrService
  ) {
    this.urlResources = GLOBAL.urlResourcesUsuarios;
    this.usuario = new Usuario();
    this.userSeleccionado = new Usuario();
  }

  /**
   * Mostrar spinner mientras carga listado de usuarios
   */
  ngOnInit(): void {
    setTimeout(() => {
      this.tablaCargada = true;
      this.cargarUsuarios();
    }, 3000);
    document.title = 'USUARIOS';
  }

  /**
   * Obtener listado de usuarios desde la API
   */
  cargarUsuarios() {
    this.usuarioService.listadoUsuarios().subscribe(result => {
      this.usuarios = result.data;
    });
  }

  /**
   * Obtener id y email de usuario seleccionado
   * @param id number
   * @param email string
   */
  seleccionarUsuario(id: number, email: string, nombre?: string, apellidos?: string, imagen?: string, rol?: number) {
    this.userSeleccionado = new Usuario();
    this.userSeleccionado.id = id;
    this.userSeleccionado.email = email;
    this.userSeleccionado.nombre = nombre;
    this.userSeleccionado.apellidos = apellidos;
    this.userSeleccionado.imagen = imagen;
    this.userSeleccionado.rol = rol;
    console.log(this.userSeleccionado);
  }

  /**
   * Eliminar usuario de bd y listado
   */
  eliminarUsuario() {
    this.usuarioService.deleteUsuario(this.userSeleccionado).subscribe(result => {
      if (result.code === 200) {
        this.toast.success('Usuario eliminado', 'Aviso', { timeOut: 3000, positionClass: 'toast-top-right' });
        this.usuarios.splice(this.userSeleccionado.id, 1);
        this.cargarUsuarios();
      } else {
        this.toast.error('Usuario no eliminado', 'Error', { timeOut: 3000, positionClass: 'toast-top-right' });
      }
    });
  }
}
