import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule,HttpTestingController,} from '@angular/common/http/testing';
import {UsersService,LoginResponse, UsuarioDto, CatalogoItem, Pelicula,Serie,} from './users.service';
import { PLATFORM_ID } from '@angular/core';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    const mockUserData = {
      nombre: 'Test User',
      correo: 'test@example.com',
      contrasena: 'password123',
    };
    const mockResponse = { message: 'User registered successfully' };

    service.registerUser(mockUserData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/User`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should login a user', () => {
    const mockLoginResponse: LoginResponse = {
      isSuccess: true,
      token: 'fake-token',
      userId: '123',
    };

    service.login('test@example.com', 'password123').subscribe((response) => {
      expect(response).toEqual(mockLoginResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/Login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockLoginResponse);
  });

  it('should get user info', () => {
    const mockUserInfo: UsuarioDto = {
      nombre: 'Test User',
      nombreUsuario: 'testuser',
      correo: 'test@example.com',
    };
    spyOn(service, 'getUserId').and.returnValue('123');

    service.getUserInfo().subscribe((info) => {
      expect(info).toEqual(mockUserInfo);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/User/123`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserInfo);
  });

  it('should get catalogo completo', () => {
    const mockCatalogo: CatalogoItem[] = [
      {
        tipo: 'pelicula',
        titulo: 'Movie 1',
        fechaEstreno: new Date(),
        sinopsis: 'Synopsis 1',
        genero: 'Action',
        director: 'Director 1',
        poster: 'poster1.jpg',
        trailer: 'trailer1.mp4',
        duracion: 120,
      },
      {
        tipo: 'serie',
        titulo: 'Series 1',
        temporadas: 3,
        episodios: 30,
        fechaEstreno: new Date(),
        sinopsis: 'Synopsis 2',
        genero: 'Drama',
        director: 'Director 2',
        poster: 'poster2.jpg',
        trailer: 'trailer2.mp4',
      },
    ];

    service.getCatalogoCompleto().subscribe((catalogo) => {
      expect(catalogo).toEqual(mockCatalogo);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/PeliculasySeries`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCatalogo);
  });

  it('should get catalogo peliculas', () => {
    const mockPeliculas: Pelicula[] = [
      {
        titulo: 'Movie 1',
        fechaEstreno: new Date(),
        duracion: 120,
        sinopsis: 'Synopsis 1',
        genero: 'Action',
        director: 'Director 1',
        poster: 'poster1.jpg',
        trailer: 'trailer1.mp4',
      },
    ];

    service.getCatalogoPeliculas().subscribe((peliculas) => {
      expect(peliculas).toEqual(mockPeliculas);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/Movies`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPeliculas);
  });

  it('should get catalogo series', () => {
    const mockSeries: Serie[] = [
      {
        titulo: 'Series 1',
        temporadas: 3,
        episodios: 30,
        fechaEstreno: new Date(),
        sinopsis: 'Synopsis 2',
        genero: 'Drama',
        director: 'Director 2',
        poster: 'poster2.jpg',
        trailer: 'trailer2.mp4',
      },
    ];

    service.getCatalogoSeries().subscribe((series) => {
      expect(series).toEqual(mockSeries);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/Series`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSeries);
  });

  it('should handle logout', () => {
    spyOn(localStorage, 'removeItem');
    service.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('userId');
  });

  it('should check if user is logged in', () => {
    spyOn(service, 'getToken').and.returnValue('fake-token');
    spyOn(service, 'getUserId').and.returnValue('123');
    expect(service.isLoggedIn()).toBeTrue();

    service['getToken'] = jasmine.createSpy().and.returnValue(null);
    expect(service.isLoggedIn()).toBeFalse();
  });
});
