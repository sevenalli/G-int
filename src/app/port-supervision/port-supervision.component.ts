import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Port, PortsService } from '../services/ports.service';




@Component({
  selector: 'app-ports',
  imports: [CommonModule, RouterModule],
  templateUrl: './port-supervision.component.html',
  styleUrl: './port-supervision.component.css'
})
export class PortSupervisionComponent {
//  ports = [
//     { 
//       title: 'DEPJL', 
//       route: 'choixSupervision', 
//       image: 'jerfLasfar.jpg'
//     },
//     { 
//       title: 'DEPA', 
//       route: 'choixSupervision', 
//       image: 'depa.png'
//     },
//     { 
//       title: 'SMA', 
//       route: 'choixSupervision', 
//       image: 'sma.jpg'
//     },
    
//     { 
//       title: 'DEPT', 
//       route: 'choixSupervision', 
//       image: 'dept.png'
//     },
//     { 
//       title: 'TC3PC', 
//       route: 'choixSupervision', 
//       image: 'tc3pc.png'
//     },
//     { 
//       title: 'DEPL', 
//       route: 'choixSupervision', 
//       image: 'depl.png'
//     },
//     { 
//       title: 'DEPN', 
//       route: 'choixSupervision', 
//       image: 'depn.png'
//     },
//     { 
//       title: 'DEPS', 
//       route: 'choixSupervision', 
//       image: 'deps.png'
//     },
    
//     { 
//       title: 'DEPD', 
//       route: 'choixSupervision', 
//       image: 'depd.png'
//     },

//   ];
  
ports: Port[] = [];
  constructor(private router: Router, private portsService: PortsService) {}

  ngOnInit(): void {
    this.portsService.getPorts().subscribe({
      next: (data) => this.ports = data,
      complete: () => console.log('Ports loaded successfully', this.ports),
      error: (err) => console.error('Failed to load ports', err)
    });
  }

  navigateTo(port: Port): void {
    this.router.navigate(
      ['/choixSupervision'],
      { 
        queryParams: {portName: port.name, portId: port.portId},
        state: { portId: port.portId, portName: port.name }
      }
    )
  }
  

}
