import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeriesComponent } from './series.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('SeriesComponent', () => {
  let component: SeriesComponent;
  let fixture: ComponentFixture<SeriesComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeriesComponent, HttpClientTestingModule],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(SeriesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
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

  it('should fetch catalog items on init', () => {
    const mockItems = [
      {
        titulo: 'Test Series',
        temporadas: 3,
        episodios: 30,
        fechaEstreno: new Date(),
        sinopsis: 'Test',
        genero: 'Drama',
        director: 'Test Director',
        poster: 'url',
        trailer: 'url',
      },
    ];

    component.ngOnInit();

    const req = httpMock.expectOne('http://localhost:5025/api/Series');
    expect(req.request.method).toBe('GET');
    req.flush(mockItems);

    component.catalogoItems$.subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items[0].titulo).toBe('Test Series');
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
        titulo: 'Series 1',
        temporadas: 1,
        episodios: 10,
        fechaEstreno: new Date(),
        sinopsis: 'Test',
        genero: 'Drama',
        director: 'Director 1',
        poster: 'url1',
        trailer: 'url1',
      },
      {
        titulo: 'Series 2',
        temporadas: 2,
        episodios: 20,
        fechaEstreno: new Date(),
        sinopsis: 'Test',
        genero: 'Comedy',
        director: 'Director 2',
        poster: 'url2',
        trailer: 'url2',
      },
      {
        titulo: 'Series 3',
        temporadas: 3,
        episodios: 30,
        fechaEstreno: new Date(),
        sinopsis: 'Test',
        genero: 'Action',
        director: 'Director 3',
        poster: 'url3',
        trailer: 'url3',
      },
    ];

    const shuffledArray = component['shuffleArray']([...originalArray]);

    expect(shuffledArray.length).toBe(originalArray.length);
    expect(shuffledArray).not.toEqual(originalArray);
    expect(shuffledArray).toContain(originalArray[0]);
    expect(shuffledArray).toContain(originalArray[1]);
    expect(shuffledArray).toContain(originalArray[2]);
  });

  it('should return a default poster', () => {
    const defaultPoster = component.getDefaultPoster();
    expect(defaultPoster).toMatch(
      /^https:\/\/via\.placeholder\.com\/300x450\?text=/
    );
  });

  it('should handle image error', () => {
    const mockEvent = {
      target: {
        src: '',
      },
    };
    spyOn(component, 'getDefaultPoster').and.returnValue('default-poster-url');

    component.handleImageError(mockEvent);

    expect(mockEvent.target.src).toBe('default-poster-url');
    expect(component.getDefaultPoster).toHaveBeenCalled();
  });
});
