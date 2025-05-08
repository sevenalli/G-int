import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css'
})
export class AppHeaderComponent {
  isNavbarCollapsed: boolean = true;
  
  constructor(private router: Router, public themeService: ThemeService) {}

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
    // Add body class to prevent scrolling when menu is open
    if (!this.isNavbarCollapsed) {
      document.body.classList.add('navbar-open');
    } else {
      document.body.classList.remove('navbar-open');
    }
  }
  
  closeNavbar() {
    if (!this.isNavbarCollapsed) {
      this.isNavbarCollapsed = true;
      document.body.classList.remove('navbar-open');
    }
  }
  
  navigate(route: string): void {
    this.router.navigate([route]);
    this.closeNavbar();
  }
}
