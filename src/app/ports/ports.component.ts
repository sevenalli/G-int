import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';




@Component({
  selector: 'app-ports',
  imports: [CommonModule, RouterModule],
  templateUrl: './ports.component.html',
  styleUrl: './ports.component.css'
})
export class PortsComponent {
 ports = [
    { title: 'DEPJL', route: '/accueil' },
    { title: 'DEPA', route: '#' },
    { title: 'SMA', route: '#' },
    { title: 'DEPC', route: '#' },
    { title: 'DEPT', route: '#' },
    { title: 'TC3', route: '#' },

  ];
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
  

}
