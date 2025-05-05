import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-acceuil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.css']
})
export class AcceuilComponent {
  menuItems = [
    { title: '3D Temps réel', route: '/operations' },
    { title: '3D Play Back', route: '/operations' },
    { title: 'Monitoring des engins', route: '/operations' },
    { title: 'Maintenance', route: '/operations' },
    { title: 'Exploitation', route: '/operations' },
    { title: 'Performance', route: '/operations' },
    { title: 'Sécurité', route: '/operations' },
    { title: 'Diagnostique', route: '/operations' },
    { title: 'RSE', route: '/operations' }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
  
  getIconClass(index: number): string {
    // Map each menu item to an appropriate Bootstrap icon
    const iconClasses = [
      'bi bi-badge-3d', // 3D Temps réel
      'bi-play-circle',        // 3D Play Back
      'bi-display',            // Monitoring des engins
      'bi-tools',              // Maintenance
      'bi-gear',               // Exploitation
      'bi-graph-up',           // Performance
      'bi-shield-check',       // Sécurité
      'bi-search',             // Diagnostique
      'bi-globe'               // RSE
    ];
    
    return iconClasses[index] || 'bi-app';
  }
  
  getCurrentDate(): string {
    const now = new Date();
    return now.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
