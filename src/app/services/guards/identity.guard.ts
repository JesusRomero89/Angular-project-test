import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IdentityGuard implements CanActivate {
  constructor(
    private router: Router
  ) { }

  canActivate() {
    const identity = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (identity && token) {
      console.log('identity guard: OK');
      return true;
    }
    this.router.navigate(['login']);
    return true;
  }
}
