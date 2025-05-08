import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-engines-types',
  imports: [CommonModule, RouterModule],
  templateUrl: './engines-types.component.html',
  styleUrl: './engines-types.component.css'
})
export class EnginesTypesComponent {
  ports = [
    { title: 'Levage', route: '/home' },
    { title: 'Roulants', route: '#' },
    { title: 'accessories', route: '#' }
   

  ];
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
