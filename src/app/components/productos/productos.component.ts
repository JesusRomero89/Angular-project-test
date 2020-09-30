import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Producto } from 'src/app/models/producto';
import { ProductosService } from 'src/app/services/productos.service';
import { GLOBAL } from 'src/app/services/global';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: any = [];
  productosInf: any = [];
  tablaCargada: boolean;
  producto: Producto;
  productoSeleccionado: Producto;
  urlResources: string;
  refFilter: string;

  constructor(
    private productoService: ProductosService,
    private toast: ToastrService
  ) {
    this.urlResources = GLOBAL.urlResourcesProductos;
    this.productoSeleccionado = new Producto();
  }

  /**
   * Mostramos spinner mientras se carga la tabla de productos
   */
  ngOnInit(): void {
    setTimeout(() => {
      this.tablaCargada = true;
      this.cargarProductos();
    }, 3000);
    document.title = 'PRODUCTOS';
  }

  /**
   * Obtener listado de productos desde la API
   */
  cargarProductos() {
    this.productoService.listadoProductos().subscribe(result => {
      this.productos = result.data;
    });
  }

  /**
   * Obtener id del producto seleccionado
   * @param id number
   */
  seleccionarProducto(id: number, referencia?: string, descripcion?: string, unidades?: number, precio?: number, imagen?: string) {
    this.productoSeleccionado = new Producto();
    this.productoSeleccionado.id = id;
    this.productoSeleccionado.referencia = referencia;
    this.productoSeleccionado.descripcion = descripcion;
    this.productoSeleccionado.unidades = unidades;
    this.productoSeleccionado.precio = precio;
    this.productoSeleccionado.imagen = imagen;
  }

  /**
   * Eliminar producto de la bd y actualizar lista de productos
   */
  eliminarProducto() {
    this.productoService.deleteProducto(this.productoSeleccionado).subscribe(result => {
      if (result.code === 200) {
        this.toast.success('Producto eliminado', 'Aviso', { timeOut: 3000, positionClass: 'toast-top-right' });
        this.productos.splice(this.productoSeleccionado.id, 1);
        this.cargarProductos();
      } else {
        this.toast.error('Producto no eliminado', 'Error', { timeOut: 3000, positionClass: 'toast-top-right' });
      }
    });
  }
}
