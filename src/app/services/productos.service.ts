import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Obtener listado de productos desde la API
   */
  listadoProductos(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.get(GLOBAL.urlAPI + '/productos', { headers });
  }

  /**
   * Obtener información de producto desde la API a partir de producto.id
   * @param producto Producto
   */
  datosProducto(producto: Producto): Observable<any> {
    return this.http.get(GLOBAL.urlAPI + '/producto' + '/' + producto.id);
  }

  /**
   * Actualizar información de producto
   * @param producto Producto
   */
  editDatosProducto(producto: Producto): Observable<any> {
    const json = JSON.stringify(producto);
    const params = 'json=' + json;
    console.log(params);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post(GLOBAL.urlAPI + '/editar-producto', params, { headers });
  }

  /**
   * Añadir nuevo producto
   * @param producto Producto
   */
  nuevoProducto(producto: Producto): Observable<any> {
    const json = JSON.stringify(producto);
    const params = 'json=' + json;
    console.log(params);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post(GLOBAL.urlAPI + '/nuevo-producto', params, { headers });
  }

  /**
   * Eliminar producto de bd
   * @param producto Producto
   */
  deleteProducto(producto: Producto): Observable<any> {
    const json = JSON.stringify(producto);
    const params = 'json=' + json;
    console.log(params);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post(GLOBAL.urlAPI + '/eliminar-producto', params, { headers });
  }

  /**
   * Subir imagen a directorio
   * @param file any
   */
  subirImagen(file: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post(GLOBAL.urlAPI + '/subir-imagen-producto', file, { headers });
  }

  /**
   * Borrar imagen de usuario com imagen default
   * @param producto Producto
   */
  actualizarImagen(producto: Producto): Observable<any> {
    const json = JSON.stringify(producto);
    const params = 'json=' + json;
    console.log(params);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post(GLOBAL.urlAPI + '/actualizar-imagen-producto', params, { headers });
  }

  /**
   * Obtener imagen de usuario desde la API
   * @param producto Producto
   */
  obtenerImagen(producto: Producto): Observable<any> {
    const json = JSON.stringify(producto);
    const params = 'json=' + json;
    console.log(params);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post(GLOBAL.urlAPI + '/imagen-producto', params, { headers });
  }
}
