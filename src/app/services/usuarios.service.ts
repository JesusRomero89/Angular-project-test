import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Obtener listado de usuarios desde API
   */
  listadoUsuarios(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.get(GLOBAL.urlAPI + '/usuarios', { headers });
  }

  /**
   * Obtener datos de usuario desde API
   * @param usuario Usuario
   */
  datosUsuario(usuario: Usuario): Observable<any> {
    return this.http.get(GLOBAL.urlAPI + '/usuario' + '/' + usuario.id);
  }

  /**
   * Editar datos de usuario existente
   * @param usuario Usuario
   */
  editDatosUsuario(usuario: Usuario): Observable<any> {
    const json = JSON.stringify(usuario);
    const params = 'json=' + json;
    console.log(params);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post(GLOBAL.urlAPI + '/editar-usuario', params, { headers });
  }

  /**
   * Añadir usuario nuevo a bd
   * @param usuario Usuario
   */
  nuevoUsuario(usuario: Usuario): Observable<any> {
    const json = JSON.stringify(usuario);
    const params = 'json=' + json;
    console.log(params);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post(GLOBAL.urlAPI + '/nuevo-usuario', params, { headers });
  }

  /**
   * Eliminar usuario de bd
   * @param usuario Usuario
   */
  deleteUsuario(usuario: Usuario): Observable<any> {
    const json = JSON.stringify(usuario);
    const params = 'json=' + json;
    console.log(params);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post(GLOBAL.urlAPI + '/eliminar-usuario', params, { headers });
  }

  /**
   * Obtener rol de usuario desde API
   * @param usuario Usuario
   */
  obtenerRol(usuario: Usuario): Observable<any> {
    const json = JSON.stringify(usuario);
    const params = 'json=' + json;
    console.log(params);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post(GLOBAL.urlAPI + '/rol', params, { headers });
  }

  /**
   * Subir imagen a directorio
   * @param file any
   */
  subirImagen(file: any): Observable<any> {
    console.log('image', file);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post(GLOBAL.urlAPI + '/subir-imagen-usuario', file, { headers });
  }

  /**
   * Borrar imagen de usuario com imagen default
   * @param usuario Usuario
   */
  actualizarImagen(usuario: Usuario): Observable<any> {
    const json = JSON.stringify(usuario);
    const params = 'json=' + json;
    console.log(params);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post(GLOBAL.urlAPI + '/actualizar-imagen-usuario', params, { headers });
  }

  /**
   * Obtener imagen de usuario desde la API
   * @param usuario Usuario
   */
  obtenerImagen(usuario: Usuario): Observable<any> {
    const json = JSON.stringify(usuario);
    const params = 'json=' + json;
    console.log(params);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post(GLOBAL.urlAPI + '/imagen-usuario', params, { headers });
  }
}
