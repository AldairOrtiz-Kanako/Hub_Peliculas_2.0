import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Login/login/login.component';
import { RegistroComponent } from './Registro/registro/registro.component';
import { InicioComponent } from './Inicio/inicio/inicio.component';
import { SeriesComponent } from './Inicio/Series/series/series.component';
import { PeliculasComponent } from './Inicio/Peliculas/peliculas/peliculas.component';
import { FavoritosComponent } from './Inicio/Favoritos/favoritos/favoritos.component';
import { PerfilComponent } from './Perfil/perfil/perfil.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: 'inicio',
    component: InicioComponent,
    children: [
      { path: 'series', component: SeriesComponent },
      { path: 'peliculas', component: PeliculasComponent },
      { path: 'favoritos', component: FavoritosComponent },
    ],
  },
  { path: 'perfil', component: PerfilComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
