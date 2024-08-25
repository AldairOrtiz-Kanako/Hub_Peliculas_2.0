import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsersService, UsuarioDto } from '../../Services/users/users.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: UsuarioDto | null = null;
  error: string | null = null;

  constructor(private usersService: UsersService, private router: Router) {}

  ngOnInit() {
    console.log('Is logged in:', this.usersService.isLoggedIn());
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    this.usersService.getUserInfo().subscribe({
      next: (data) => {
        if (data === null) {
          console.warn('Usuario no autenticado');
          this.router.navigate(['/login']); // Redirige al usuario a la página de login
        } else {
          this.usuario = data;
        }
      },
      error: (err) => {
        console.error('Error al cargar los datos del usuario', err);
        this.error = 'No se pudieron cargar los datos del usuario. Por favor, intenta de nuevo más tarde.';
      }
    });
  }
}
