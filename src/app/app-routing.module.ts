import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { IdentityGuard } from './services/guards/identity.guard';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { PerfilComponent } from './components/usuarios/perfil/perfil.component';
import { ProductosComponent } from './components/productos/productos.component';
import { EditarProductoComponent } from './components/productos/editar-producto/editar-producto.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [IdentityGuard]
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [IdentityGuard]
  },
  {
    path: 'perfil/:id',
    component: PerfilComponent,
    canActivate: [IdentityGuard]
  },
  {
    path: 'productos',
    component: ProductosComponent,
    canActivate: [IdentityGuard]
  },
  {
    path: 'editar-producto',
    component: EditarProductoComponent,
    canActivate: [IdentityGuard]
  },
  {
    path: 'editar-producto/:id',
    component: EditarProductoComponent,
    canActivate: [IdentityGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
