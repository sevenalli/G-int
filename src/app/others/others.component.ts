import { Component, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';

interface Engine {
  id: string;
  notifications: number;
  hookType: string;
  status1: string;
  status2: string;
  power: string;
  hours: string;
  extra: string;
}

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// These imports are for Angular standalone components
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-others',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './others.component.html',
  styleUrl: './others.component.css'
})
export class OthersComponent implements AfterViewInit {
  searchQuery: string = '';
  filteredEngines: Engine[] = [];
  engines: Engine[] = [
    {
      id: 'G380003',
      notifications: 0,
      hookType: 'hook',
      status1: 'AFFECTE',
      status2: 'DRIVE',
      power: 'ON',
      hours: '43 889 H',
      extra: 'EXTRA 1'
    },
    {
      id: 'G400001',
      notifications: 3,
      hookType: 'grab-orange',
      status1: 'STANDBY',
      status2: 'PARK',
      power: 'ON',
      hours: '33 878 H',
      extra: 'EXTRA 2'
    },
    {
      id: 'G400002',
      notifications: 1,
      hookType: 'grab-red',
      status1: 'AFFECTE',
      status2: 'DRIVE',
      power: 'OFF',
      hours: '21 100 H',
      extra: 'EXTRA 3'
    }
  ];
  selectedEngine: Engine = this.engines[0];

  onInput() {
    const query = this.searchQuery.trim().toLowerCase();
    if (query.length === 0) {
      this.filteredEngines = [];
      return;
    }
    this.filteredEngines = this.engines.filter(e => e.id.toLowerCase().includes(query));
  }

  onSearch(event: Event) {
    event.preventDefault();
    if (this.filteredEngines.length > 0) {
      this.selectEngine(this.filteredEngines[0]);
    }
  }

  selectEngine(engine: Engine) {
    this.selectedEngine = engine;
    this.searchQuery = engine.id;
    this.filteredEngines = [];
    // Optionally update map/chart here for selected engine
  }

  motorState = false;

  ngAfterViewInit() {
    // Optionally update map/chart for selectedEngine here
  
    // Initialize map using Leaflet
    const L = (window as any).L;
    if (L) {
      const map = L.map('map').setView([33.13388146275545, -8.623893381906033], 13); // User-specified location
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
      // User-specified engine location marker
      L.marker([33.13388146275545, -8.623893381906033]).addTo(map).bindPopup('Engine at Safi, Morocco');
    }
    // Initialize Chart.js
    const Chart = (window as any).Chart;
    if (Chart) {
      const ctx = (document.getElementById('engineChart') as HTMLCanvasElement).getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['G380003', 'G400001', 'G400005', 'M630001'],
          datasets: [{
            label: 'Engine Hours',
            data: [43889, 33878, 13000, 46389],
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
          }]
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } }
        }
      });
    }
    // Motor SVG coloring is handled by CSS classes
  }

  toggleMotor() {
    this.motorState = !this.motorState;
    // Optionally, you could manipulate the SVG color directly here if needed
  }
}
