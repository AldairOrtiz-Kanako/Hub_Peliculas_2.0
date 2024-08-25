import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { UsersService, AgregarFavoritoParams } from '../../Services/users/users.service';

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

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, DatePipe, RouterLink, SidebarComponent, HeaderComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent implements OnInit {
  isModalVisible: boolean = false;
  catalogoItems$: Observable<CatalogoItem[]> = of([]);
  mensajeExito: string | null = null;

  constructor(private http: HttpClient, private usersService: UsersService) {}

  ngOnInit() {
    this.fetchCatalogoCompleto();
  }

  fetchCatalogoCompleto() {
    const apiUrl = 'http://localhost:5025/api/PeliculasySeries';
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

  agregarAFavoritos(item: CatalogoItem) {
    const userId = this.usersService.getUserId();
    if (userId) {
      const params: AgregarFavoritoParams = {
        usuarioID: parseInt(userId),
        peliculasID: item.tipo === 'Película' ? item.id : null,
        seriesID: item.tipo === 'Serie' ? item.id : null
      };
      this.usersService.agregarAFavoritos(params).subscribe({
        next: (response: any) => {
          console.log('Agregado a favoritos:', response);
          this.mostrarMensajeExito(`${item.titulo} se ha agregado a favoritos correctamente.`);
        },
        error: (error: any) => {
          console.error('Error al agregar a favoritos:', error);
          this.mostrarMensajeExito('Hubo un error al agregar a favoritos. Por favor, intenta de nuevo.');
        }
      });
    } else {
      console.error('Usuario no autenticado');
      this.mostrarMensajeExito('Debes iniciar sesión para agregar a favoritos.');
    }
  }

  mostrarMensajeExito(mensaje: string) {
    this.mensajeExito = mensaje;
    setTimeout(() => {
      this.mensajeExito = null;
    }, 3000); // El mensaje desaparecerá después de 3 segundos
  }
}