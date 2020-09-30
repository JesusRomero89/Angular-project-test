import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { GLOBAL } from './global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Logearnos contra la API
   * @param usuario Usuario
   */
  usuarioLogin(usuario: Usuario): Observable<any> {
    const json = JSON.stringify(usuario);
    const params = 'json=' + json;
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post(GLOBAL.urlAPI + '/login', params, { headers });
  }
}
