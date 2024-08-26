import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { UsersService } from '../../Services/users/users.service';
import { Router } from '@angular/router';

// Definimos la interfaz LoginResponse
interface LoginResponse {
  isSuccess: boolean;
  token: string;
  userId: string; // Agregamos userId ya que parece ser requerido
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let usersServiceMock: jasmine.SpyObj<UsersService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    usersServiceMock = jasmine.createSpyObj('UsersService', ['login']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, LoginComponent],
      providers: [
        { provide: UsersService, useValue: usersServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle successful login', () => {
    const mockResponse: LoginResponse = { isSuccess: true, token: 'fake-token', userId: 'user123' };
    usersServiceMock.login.and.returnValue(of(mockResponse));

    component.correo = 'test@example.com';
    component.contrasena = 'password123';
    component.onSubmit();

    expect(usersServiceMock.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/inicio']);
    expect(component.errorMessage).toBe('');
  });

  it('should handle unsuccessful login', () => {
    const mockResponse: LoginResponse = { isSuccess: false, token: '', userId: '' };
    usersServiceMock.login.and.returnValue(of(mockResponse));

    component.correo = 'wrong@example.com';
    component.contrasena = 'wrongpassword';
    component.onSubmit();

    expect(usersServiceMock.login).toHaveBeenCalledWith('wrong@example.com', 'wrongpassword');
    expect(localStorage.getItem('token')).toBeNull();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Credenciales incorrectas');
  });

  it('should handle login error', () => {
    usersServiceMock.login.and.returnValue(throwError(() => new Error('Network error')));

    component.correo = 'test@example.com';
    component.contrasena = 'password123';
    component.onSubmit();

    expect(usersServiceMock.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(localStorage.getItem('token')).toBeNull();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Error al intentar iniciar sesión');
  });

  it('should initialize with empty credentials and no error message', () => {
    expect(component.correo).toBe('');
    expect(component.contrasena).toBe('');
    expect(component.errorMessage).toBe('');
  });
});