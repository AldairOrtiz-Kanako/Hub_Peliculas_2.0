import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { InicioComponent } from './inicio.component';
import { UsersService } from '../../Services/users/users.service';

// Definimos la interfaz CatalogoItem aquí para las pruebas
interface CatalogoItem {
  id: number;
  tipo: string;
  titulo: string;
  fechaEstreno: Date;
  sinopsis: string;
  genero: string;
  director: string;
  poster: string;
  trailer: string;
  temporadas?: number;
  episodios?: number;
  duracion?: number;
}

describe('InicioComponent', () => {
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;
  let usersServiceMock: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    usersServiceMock = jasmine.createSpyObj('UsersService', ['getUserId', 'agregarAFavoritos']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, InicioComponent],
      providers: [
        { provide: UsersService, useValue: usersServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch catalog items on init', () => {
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpClientSpy.get.and.returnValue(of([]));
    (component as any).http = httpClientSpy;

    component.ngOnInit();

    expect(httpClientSpy.get).toHaveBeenCalledWith('http://localhost:5025/api/PeliculasySeries');
  });

  it('should toggle modal visibility', () => {
    expect(component.isModalVisible).toBeFalse();
    
    component.showModal();
    expect(component.isModalVisible).toBeTrue();
    
    component.hideModal();
    expect(component.isModalVisible).toBeFalse();
  });

  it('should return a default poster', () => {
    const defaultPoster = component.getDefaultPoster();
    expect(defaultPoster).toMatch(/^https:\/\/via\.placeholder\.com\/300x450\?text=/);
  });

  it('should handle image error', () => {
    const mockEvent = { target: { src: '' } };
    spyOn(component, 'getDefaultPoster').and.returnValue('default-url');

    component.handleImageError(mockEvent);

    expect(mockEvent.target.src).toBe('default-url');
  });

  it('should add to favorites when user is authenticated', () => {
    const mockItem: CatalogoItem = { 
      id: 1, 
      tipo: 'Película', 
      titulo: 'Test Movie',
      fechaEstreno: new Date(),
      sinopsis: '',
      genero: '',
      director: '',
      poster: '',
      trailer: ''
    };
    usersServiceMock.getUserId.and.returnValue('123');
    usersServiceMock.agregarAFavoritos.and.returnValue(of('Agregado a favoritos'));
    component.agregarAFavoritos(mockItem);

    expect(usersServiceMock.agregarAFavoritos).toHaveBeenCalledWith({
      usuarioID: 123,
      peliculasID: 1,
      seriesID: null
    });
    expect(component.mensajeExito).toContain('Test Movie se ha agregado a favoritos correctamente.');
  });

  it('should show error message when adding to favorites fails', () => {
    const mockItem: CatalogoItem = { 
      id: 1, 
      tipo: 'Serie', 
      titulo: 'Test Series',
      fechaEstreno: new Date(),
      sinopsis: '',
      genero: '',
      director: '',
      poster: '',
      trailer: ''
    };
    usersServiceMock.getUserId.and.returnValue('123');
    usersServiceMock.agregarAFavoritos.and.returnValue(throwError(() => new Error('Test error')));

    component.agregarAFavoritos(mockItem);

    expect(component.mensajeExito).toBe('Hubo un error al agregar a favoritos. Por favor, intenta de nuevo.');
  });

  it('should show message when user is not authenticated', () => {
    const mockItem: CatalogoItem = { 
      id: 1, 
      tipo: 'Película', 
      titulo: 'Test Movie',
      fechaEstreno: new Date(),
      sinopsis: '',
      genero: '',
      director: '',
      poster: '',
      trailer: ''
    };
    usersServiceMock.getUserId.and.returnValue(null);

    component.agregarAFavoritos(mockItem);

    expect(component.mensajeExito).toBe('Debes iniciar sesión para agregar a favoritos.');
  });

  it('should clear success message after 3 seconds', (done) => {
    component.mostrarMensajeExito('Test message');
    expect(component.mensajeExito).toBe('Test message');

    setTimeout(() => {
      expect(component.mensajeExito).toBeNull();
      done();
    }, 3100);
  });
});