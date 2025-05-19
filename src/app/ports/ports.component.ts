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
      route: 'threedTempsReelPage', 
      image: 'jerfLasfar.jpg'
    },
    { 
      title: 'DEPA', 
      route: 'threedTempsReelPage', 
      image: 'depa.png'
    },
    { 
      title: 'SMA', 
      route: 'threedTempsReelPage', 
      image: 'sma.jpg'
    },
    
    { 
      title: 'DEPT', 
      route: 'threedTempsReelPage', 
      image: 'dept.png'
    },
    { 
      title: 'TC3PC', 
      route: 'threedTempsReelPage', 
      image: 'tc3pc.png'
    },
    { 
      title: 'DEPL', 
      route: 'threedTempsReelPage', 
      image: 'depl.png'
    },
    
    { 
      title: 'DEPS', 
      route: 'threedTempsReelPage', 
      image: 'deps.png'
    },
     { 
      title: 'DEPM', 
      route: 'threedTempsReelPage', 
      image: 'depm.png'
    },
    { 
      title: 'DEPD', 
      route: 'threedTempsReelPage', 
      image: 'depd.png'
    },

  ];
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
  

}
