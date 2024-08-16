import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Login/login/login.component';
import { RegistroComponent } from './Registro/registro/registro.component';
import { InicioComponent } from './Inicio/inicio/inicio.component';
import { PerfilComponent } from './Perfil/perfil/perfil.component';
import { FavoritosComponent } from './Favoritos/favoritos/favoritos.component';
import { PeliculasComponent } from './Peliculas/peliculas/peliculas.component';
import { SeriesComponent } from './Series/series/series.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'series', component: SeriesComponent },
  { path: 'peliculas', component: PeliculasComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
