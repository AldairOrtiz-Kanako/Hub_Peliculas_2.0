import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

interface CatalogoItem {
  tipo: string;
  titulo: string;
  fechaEstreno: Date;
  sinopsis: string;
  genero: string;
  director: string;
  poster: string;
  trailer: string;
  duracion?: number;
}

@Component({
  selector: 'app-peliculas',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, DatePipe, RouterLink, SidebarComponent, HeaderComponent],
  templateUrl: './peliculas.component.html',
  styleUrl: './peliculas.component.css'
})
export class PeliculasComponent implements OnInit {
  isModalVisible: boolean = false;
  catalogoItems$: Observable<CatalogoItem[]> = of([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCatalogoPeliculas();
  }

  fetchCatalogoPeliculas() {
    const apiUrl = 'http://localhost:5025/api/Movies';
    this.catalogoItems$ = this.http.get<CatalogoItem[]>(apiUrl).pipe(
      map(items => this.shuffleArray(items))
    );
  }

  private shuffleArray(array: CatalogoItem[]): CatalogoItem[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  showModal() {
    this.isModalVisible = true;
  }

  hideModal() {
    this.isModalVisible = false;
  }

  getDefaultPoster(): string {
    const defaultPosters = [
      'https://via.placeholder.com/300x450?text=Película+1',
      'https://via.placeholder.com/300x450?text=Serie+TV',
      'https://via.placeholder.com/300x450?text=Documental',
      'https://via.placeholder.com/300x450?text=Animación',
      'https://via.placeholder.com/300x450?text=Thriller'
    ];
    return defaultPosters[Math.floor(Math.random() * defaultPosters.length)];
  }

  handleImageError(event: any) {
    event.target.src = this.getDefaultPoster();
  }
}
