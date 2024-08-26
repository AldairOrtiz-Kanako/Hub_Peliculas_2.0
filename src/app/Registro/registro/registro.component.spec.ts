import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroComponent } from './registro.component';
import { Router } from '@angular/router';
import { UsersService } from '../../Services/users/users.service';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const usersServiceSpyObj = jasmine.createSpyObj('UsersService', [
      'registerUser',
    ]);

    await TestBed.configureTestingModule({
      imports: [RegistroComponent, FormsModule],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        { provide: UsersService, useValue: usersServiceSpyObj },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    usersServiceSpy = TestBed.inject(
      UsersService
    ) as jasmine.SpyObj<UsersService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user object', () => {
    expect(component.user).toEqual({
      Nombre: '',
      Apellido: '',
      NombreUsuario: '',
      Correo: '',
      Contrasena: '',
    });
  });

  it('should call registerUser and navigate to login on successful registration', () => {
    const testUser = {
      Nombre: 'Test',
      Apellido: 'User',
      NombreUsuario: 'testuser',
      Correo: 'test@example.com',
      Contrasena: 'password123',
    };
    component.user = testUser;
    usersServiceSpy.registerUser.and.returnValue(of({ success: true }));

    component.onSubmit();

    expect(usersServiceSpy.registerUser).toHaveBeenCalledWith(testUser);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle error on registration failure', () => {
    const testUser = {
      Nombre: 'Test',
      Apellido: 'User',
      NombreUsuario: 'testuser',
      Correo: 'test@example.com',
      Contrasena: 'password123',
    };
    component.user = testUser;
    const errorResponse = { error: 'Registration failed' };
    usersServiceSpy.registerUser.and.returnValue(
      throwError(() => errorResponse)
    );

    spyOn(console, 'error');

    component.onSubmit();

    expect(usersServiceSpy.registerUser).toHaveBeenCalledWith(testUser);
    expect(console.error).toHaveBeenCalledWith(
      'Error al registrar usuario',
      errorResponse
    );
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to login page when Login method is called', () => {
    component.Login();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
