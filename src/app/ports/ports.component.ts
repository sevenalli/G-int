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
    { 
      title: 'DEPJL', 
      route: '#', 
      image: 'jerfLasfar.jpg'
    },
    { 
      title: 'DEPA', 
      route: '#', 
      image: 'depa.png'
    },
    { 
      title: 'SMA', 
      route: '#', 
      image: 'sma.png'
    },
    
    { 
      title: 'DEPT', 
      route: '#', 
      image: 'dept.png'
    },
    { 
      title: 'TC3PC', 
      route: '#', 
      image: 'tc3pc.png'
    },
    { 
      title: 'DEPL', 
      route: '#', 
      image: 'depl.png'
    },
    { 
      title: 'DEPN', 
      route: '#', 
      image: 'depn.png'
    },
    { 
      title: 'DEPS', 
      route: '#', 
      image: 'deps.png'
    },
     { 
      title: 'DEPM', 
      route: '#', 
      image: 'depm.png'
    },
    { 
      title: 'DEPD', 
      route: '#', 
      image: 'depd.png'
    },

  ];
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
  

}
