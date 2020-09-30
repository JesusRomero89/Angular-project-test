import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductosService } from 'src/app/services/productos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GLOBAL } from 'src/app/services/global';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css']
})
export class EditarProductoComponent implements OnInit {
  producto: Producto;
  id: number;
  url: string;
  formulario: FormGroup;
  file: any;
  filesToUpload: any;
  imageSrc: any;
  imagenSubida: string;

  constructor(
    private productosService: ProductosService,
    private route: ActivatedRoute,
    private router: Router,
    private builder: FormBuilder,
    private toast: ToastrService
  ) {
    this.formulario = this.builder.group(
      {
        referencia: ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
        unidades: ['', [Validators.required]],
        imagen: [''],
        precio: ['', [Validators.required]]
      }
    );
  }

  /**
   * Obtener datos de producto a partir de id obtenido como parámetro desde PRODUCTOS.component y cargar datos en el formulario
   */
  ngOnInit(): void {
    document.title = 'EDITAR PRODUCTO';
    this.producto = new Producto();
    this.route.params.subscribe(result => {
      this.producto.id = result.id;
    });
    if (this.producto.id !== undefined) {
      this.productosService.datosProducto(this.producto).subscribe(result => {
        this.id = result.data[0].id;
        this.formulario.controls.referencia.setValue(result.data[0].referencia);
        this.formulario.controls.descripcion.setValue(result.data[0].descripcion);
        this.formulario.controls.unidades.setValue(result.data[0].unidades);
        this.formulario.controls.precio.setValue(result.data[0].precio);
        this.imageSrc = GLOBAL.urlResourcesProductos + '/' + result.data[0].imagen;
      });
      this.productosService.obtenerImagen(this.producto).subscribe(result => {
        this.imagenSubida = result.data[0].imagen;
      });
      this.url = GLOBAL.urlResources;
    }
  }

  /**
   * obtener archivo a través del campo imagen del formulario y almacenarlo en array
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
      this.makeFileRequest(GLOBAL.urlAPI + '/subir-imagen-producto', this.filesToUpload).then(
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
   * @param files Array<Files>
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
      this.producto = new Producto();
      this.producto.referencia = this.formulario.controls.referencia.value;
      this.producto.descripcion = this.formulario.controls.descripcion.value;
      this.producto.unidades = this.formulario.controls.unidades.value;
      this.producto.precio = this.formulario.controls.precio.value;

      if (this.filesToUpload !== undefined) {
        this.imagenSubida = this.filesToUpload[0].name;
      }
      this.producto.imagen = this.imagenSubida;

      // Introducir nuevo producto
      if (this.id === undefined) {
        this.productosService.nuevoProducto(this.producto).subscribe(result => {
          if (result.code === 200) {
            this.toast.success('Producto insertado', 'Aviso', { timeOut: 3000, positionClass: 'toast-top-right' });
            this.guardarImagen();
            this.back();
          } else {
            this.toast.error('Producto no insertado', 'Error', { timeOut: 3000, positionClass: 'toast-top-right' });
          }
        });
      } else {
        // Actualizar datos de producto existente
        this.producto.id = this.id;
        this.productosService.editDatosProducto(this.producto).subscribe(result => {
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
   * Volver a productos.component
   */
  back() {
    this.router.navigate(['productos']);
  }

  /**
   * Borrar imagen de perfil
   */
  borrarImagen() {
    this.producto = new Producto();
    this.producto.id = this.id;
    this.productosService.actualizarImagen(this.producto).subscribe(result => {
      console.log(result);
    });
    this.imagenSubida = GLOBAL.imageProductoDefault;
    this.imageSrc = GLOBAL.urlResourcesProductos + '/' + GLOBAL.imageProductoDefault;
  }
}
