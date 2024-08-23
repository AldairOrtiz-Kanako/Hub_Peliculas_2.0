import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [NgIf, RouterLink, SidebarComponent, HeaderComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent {
  isModalVisible: boolean = false;

  showModal() {
    this.isModalVisible = true;
  }

  hideModal() {
    this.isModalVisible = false;
  }
}
