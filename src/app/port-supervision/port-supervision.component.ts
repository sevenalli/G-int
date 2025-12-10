import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-port-supervision',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './port-supervision.component.html',
  styleUrl: './port-supervision.component.css'
})
export class PortSupervisionComponent {
  ports = [
    {
      title: 'DEPJL',
      route: 'choixSupervision',
      image: 'jerfLasfar.jpg'
    },
    {
      title: 'DEPA',
      route: 'choixSupervision',
      image: 'depa.png'
    },
    {
      title: 'SMA',
      route: 'choixSupervision',
      image: 'sma.jpg'
    },
    {
      title: 'DEPT',
      route: 'choixSupervision',
      image: 'dept.png'
    },
    {
      title: 'TC3PC',
      route: 'choixSupervision',
      image: 'tc3pc.png'
    },
    {
      title: 'DEPL',
      route: 'choixSupervision',
      image: 'depl.png'
    },
    {
      title: 'DEPN',
      route: 'choixSupervision',
      image: 'depn.png'
    },
    {
      title: 'DEPS',
      route: 'choixSupervision',
      image: 'deps.png'
    },
    {
      title: 'DEPD',
      route: 'choixSupervision',
      image: 'depd.png'
    }
  ];

  constructor(private router: Router) { }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
