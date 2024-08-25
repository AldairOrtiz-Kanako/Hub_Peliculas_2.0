import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../Services/users/users.service'; // Ajusta la ruta según tu estructura
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private usersService: UsersService) {}

  onSubmit() {
    this.usersService.login(this.correo, this.contrasena).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          console.log('Login exitoso');
          localStorage.setItem('token', response.toke); // Guarda el token
          this.router.navigate(['/inicio']);
        } else {
          this.errorMessage = 'Credenciales incorrectas';
        }
      },
      error: (error) => {
        console.error('Error en el login', error);
        this.errorMessage = 'Error al intentar iniciar sesión';
      }
    });
  }
}
