import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PerfilComponent } from './perfil.component';
import { UsersService, UsuarioDto } from '../../Services/users/users.service';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const usersSpy = jasmine.createSpyObj('UsersService', [
      'isLoggedIn',
      'getUserInfo',
    ]);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PerfilComponent],
      providers: [
        { provide: UsersService, useValue: usersSpy },
        { provide: Router, useValue: routerSpyObj },
      ],
    }).compileComponents();

    usersServiceSpy = TestBed.inject(
      UsersService
    ) as jasmine.SpyObj<UsersService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init when user is authenticated', () => {
    const mockUser: UsuarioDto = {
      nombre: 'Test User',
      nombreUsuario: 'exampleuser',
      correo: 'test@example.com',
    };
    usersServiceSpy.isLoggedIn.and.returnValue(true);
    usersServiceSpy.getUserInfo.and.returnValue(of(mockUser));

    fixture.detectChanges(); // Trigger ngOnInit

    expect(component.usuario).toEqual(mockUser);
    expect(component.error).toBeNull();
  });

  it('should redirect to login when user is not authenticated', () => {
    usersServiceSpy.isLoggedIn.and.returnValue(true);
    usersServiceSpy.getUserInfo.and.returnValue(of(null));

    fixture.detectChanges(); // Trigger ngOnInit

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set error message when loading user data fails', () => {
    usersServiceSpy.isLoggedIn.and.returnValue(true);
    usersServiceSpy.getUserInfo.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    fixture.detectChanges(); // Trigger ngOnInit

    expect(component.error).toBe(
      'No se pudieron cargar los datos del usuario. Por favor, intenta de nuevo más tarde.'
    );
  });
});
