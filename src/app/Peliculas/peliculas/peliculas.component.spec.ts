import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeliculasComponent } from './peliculas.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { of } from 'rxjs';

describe('PeliculasComponent', () => {
  let component: PeliculasComponent;
  let fixture: ComponentFixture<PeliculasComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PeliculasComponent,
        HttpClientTestingModule,
        RouterLink,
        SidebarComponent,
        HeaderComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PeliculasComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with isModalVisible as false', () => {
    expect(component.isModalVisible).toBeFalse();
  });

  it('should fetch catalog items on init', (done) => {
    const mockItems = [
      {
        tipo: 'Película',
        titulo: 'Test Movie',
        fechaEstreno: new Date(),
        sinopsis: 'Test',
        genero: 'Action',
        director: 'Test Director',
        poster: 'url',
        trailer: 'url',
      },
    ];

    component.ngOnInit();

    const req = httpMock.expectOne('http://localhost:5025/api/Movies');
    expect(req.request.method).toBe('GET');
    req.flush(mockItems);

    component.catalogoItems$.subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items[0].titulo).toBe('Test Movie');
      done();
    });
  });

  it('should show modal', () => {
    component.showModal();
    expect(component.isModalVisible).toBeTrue();
  });

  it('should hide modal', () => {
    component.isModalVisible = true;
    component.hideModal();
    expect(component.isModalVisible).toBeFalse();
  });

  it('should shuffle array', () => {
    const originalArray = [
      {
        tipo: 'Película',
        titulo: 'Movie 1',
        fechaEstreno: new Date(),
        sinopsis: 'Test',
        genero: 'Action',
        director: 'Director 1',
        poster: 'url1',
        trailer: 'url1',
      },
      {
        tipo: 'Película',
        titulo: 'Movie 2',
        fechaEstreno: new Date(),
        sinopsis: 'Test',
        genero: 'Comedy',
        director: 'Director 2',
        poster: 'url2',
        trailer: 'url2',
      },
    ];

    const shuffledArray = component['shuffleArray']([...originalArray]);

    expect(shuffledArray.length).toBe(originalArray.length);
    expect(shuffledArray).not.toEqual(originalArray);
    originalArray.forEach(item => {
      expect(shuffledArray).toContain(item);
    });
  });
});