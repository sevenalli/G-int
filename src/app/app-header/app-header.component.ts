import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive ,Router} from '@angular/router';

@Component({
  selector: 'app-app-header',
  standalone: true,
  imports: [ RouterLink,         // enables [routerLink] binding
    RouterLinkActive],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css'
})
export class AppHeaderComponent {
  constructor(private router: Router) {}

  sidebarVisible: boolean = false;
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  navigate(route: string): void {
    this.router.navigate([route]);
}
}
