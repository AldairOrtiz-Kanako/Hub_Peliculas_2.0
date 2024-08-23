import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../Services/users/users.service';
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  user = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  };

  constructor(private router: Router, private usersService: UsersService) {}

  onSubmit() {
    this.usersService.registerUser(this.user).subscribe({
      next: (response: any) => {
        console.log('Usuario registrado exitosamente', response);
        // Aquí puedes agregar lógica adicional, como navegar a la página de login
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        console.error('Error al registrar usuario', error);
        // Aquí puedes manejar el error, como mostrar un mensaje al usuario
      },
    });
  }

  Login() {
    this.router.navigate(['/login']);
  }
}
