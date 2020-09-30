import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Usuario } from 'src/app/models/usuario';
import { GLOBAL } from '../../../services/global';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario;
  id: number;
  old: string;
  rol: number;
  url: string;
  formulario: FormGroup;
  file: any;
  filesToUpload: any;
  imageSrc: any;
  imagenSubida: string;

  constructor(
    private usuariosService: UsuariosService,
    private route: ActivatedRoute,
    private router: Router,
    private builder: FormBuilder,
    private toast: ToastrService
  ) {
    this.formulario = this.builder.group(
      {
        nombre: ['', [Validators.required]],
        apellidos: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
        password: ['', [Validators.required, Validators.minLength(5)]],
        imagen: [''],
        rol: ['Rol', [Validators.required]]
      }
    );
  }

  /**
   * Obtener datos de usuario a partir de id obtenido como parámetro desde usuarios.component y cargar datos en el formulario
   */
  ngOnInit(): void {
    document.title = 'EDITAR USUARIO';
    this.usuario = new Usuario();
    this.route.params.subscribe(result => {
      this.usuario.id = result.id;
    });
    if (this.usuario.id !== undefined) {
      this.usuariosService.datosUsuario(this.usuario).subscribe(result => {
        this.id = result.data[0].id;
        this.formulario.controls.nombre.setValue(result.data[0].nombre);
        this.formulario.controls.apellidos.setValue(result.data[0].apellidos);
        this.formulario.controls.email.setValue(result.data[0].email);
        this.old = result.data[0].email;
        this.formulario.controls.password.setValue(result.data[0].password);
        this.rol = result.data[0].rol;
        this.formulario.controls.rol.setValue(this.rol);
        this.imageSrc = GLOBAL.urlResourcesUsuarios + '/' + result.data[0].imagen;
      });
      this.usuariosService.obtenerImagen(this.usuario).subscribe(result => {
        this.imagenSubida = result.data[0].imagen;
      });
      this.url = GLOBAL.urlResources;
    }
  }

  /**
   * Obtener archivo a través del campo imagen del formulario y almacenarlo en array
   * @param fileInput any
   */
  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file);
      this.filesToUpload = fileInput.target.files as Array<File>;
      this.file = fileInput.target.files[0].name;
      console.log('upload', this.filesToUpload);
    } else {
      this.file = null;
      this.imageSrc = null;
      this.filesToUpload = null;
    }
  }

  /**
   * Enviamos imagen seleccionada a la API y la guardamos en direcctorio definido en la API
   */
  guardarImagen() {
    if (this.filesToUpload) {
      this.makeFileRequest(GLOBAL.urlAPI + '/subir-imagen-usuario', this.filesToUpload).then(
        (result) => {
          console.log('result', result);
          // tslint:disable-next-line: no-string-literal
          if (result['code'] === 200) {
            // tslint:disable-next-line: no-string-literal
            console.log('FOTO SUBIDA: ' + result['data']);
          } else {
            console.log('ERROR AL SUBIR LA FOTO');
          }
        }, (error) => {
          console.log(error);
        });
    }
  }

  /**
   * Generamos la petición POST para enviar la imagen seleccionada a la API
   * @param url string
   * @param params Array<string>
   * @param files Array<File>
   */
  makeFileRequest(url: string, files: Array<File>) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();
      formData.append('uploads', files[0], files[0].name);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open('POST', url, true);
      xhr.send(formData);
    });
  }

  /**
   * Guardamos los cambios introducidos en el formulario
   * Si no hemos cambiado ningún dato guardamos los que ya estaban
   */
  guardarCambios() {
    if (this.formulario.valid) {
      this.usuario = new Usuario();
      this.usuario.id = this.id;
      this.usuario.nombre = this.formulario.controls.nombre.value;
      this.usuario.apellidos = this.formulario.controls.apellidos.value;
      this.usuario.email = this.formulario.controls.email.value;
      this.usuario.password = this.formulario.controls.password.value;
      this.usuario.rol = parseInt(this.formulario.controls.rol.value, null);

      if (this.filesToUpload !== undefined) {
        this.imagenSubida = this.filesToUpload[0].name;
      }

      this.usuario.imagen = this.imagenSubida;

      // Introducir nuevo usuario
      if (this.id === undefined && this.rol === undefined) {
        this.usuariosService.nuevoUsuario(this.usuario).subscribe(result => {
          console.log(result);
          if (result.code === 200) {
            this.toast.success('Usuario insertado', 'Aviso', { timeOut: 3000, positionClass: 'toast-top-right' });
            this.guardarImagen();
            this.back();
          } else {
            this.toast.error('Usuario no insertado', 'Error', { timeOut: 3000, positionClass: 'toast-top-right' });
          }
        });
      } else {
        // Actualizar datos de usuario
        this.usuario.id = this.id;
        this.usuario.oldEmail = this.old;
        this.usuariosService.editDatosUsuario(this.usuario).subscribe(result => {
          console.log(result);
          if (result.code === 200) {
            this.toast.success('Datos actualizados', 'Aviso', { timeOut: 3000, positionClass: 'toast-top-right' });
            this.guardarImagen();
            this.back();
          } else {
            this.toast.error('Datos no actualizados', 'Error', { timeOut: 3000, positionClass: 'toast-top-right' });
          }
        });
      }
    } else {
      this.toast.error('Revisa los datos del formulario', 'Error', { timeOut: 3000, positionClass: 'toast-top-right' });
    }
  }

  /**
   * Volver a usuarios.component
   */
  back() {
    if (localStorage.getItem('rol') === '1') {
      this.router.navigate(['usuarios']);
    } else {
      this.router.navigate(['productos']);
    }
  }

  /**
   * Borrar imagen de perfil
   */
  borrarImagen() {
    this.usuario = new Usuario();
    this.usuario.id = this.id;
    this.usuariosService.actualizarImagen(this.usuario).subscribe(result => {
      console.log(result);
    });
    this.imagenSubida = GLOBAL.imageUsuarioDefault;
    this.imageSrc = GLOBAL.urlResourcesUsuarios + '/' + GLOBAL.imageUsuarioDefault;
  }
}
