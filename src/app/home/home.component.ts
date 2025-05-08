import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  cranes = [
    {
      id: 'G380003',
      notifications: 0,
      craneType :'G38',
      hookType: 'Crochet',
      status1: 'AFFECTE',
      status2: 'DRIVE',
      power: 'ON',
      hours: '43 889 H',
      extra: 'EXTRA 1'
    },
    {
      id: 'G400001',
      notifications: 3,
      craneType :'G40',
      hookType: 'Benne',
      status1: 'STANDBY',
      status2: 'PARK',
      power: 'ON',
      hours: '33 878 H',
      extra: 'EXTRA 2'
    },
    {
      id: 'G400005',
      notifications: 'M',
      craneType :'G40',
      hookType: 'Grappin',
      status1: 'MAINTENANCE',
      status2: 'ANCRE',
      power: 'OFF',
      hours: '13 000 H',
      extra: 'EXTRA 3'
    },
    {
      id: 'M630001',
      notifications: 0,
      craneType :'M63',
      hookType: 'Benne Motorisée',
      status1: 'AFFECTE',
      status2: 'DRIVE',
      power: 'ON',
      hours: '46 389 H',
      extra: 'EXTRA 4'
    },
    {
      id: 'G380003',
      notifications: 0,
      craneType :'G38',
      hookType: 'Crochet',
      status1: 'AFFECTE',
      status2: 'DRIVE',
      power: 'ON',
      hours: '43 889 H',
      extra: 'EXTRA 1'
    },
    {
      id: 'G400001',
      notifications: 3,
      craneType :'G40',
      hookType: 'Benne',
      status1: 'STANDBY',
      status2: 'PARK',
      power: 'ON',
      hours: '33 878 H',
      extra: 'EXTRA 2'
    },
    {
      id: 'G400005',
      notifications: 'M',
      craneType :'G40',
      hookType: 'Grappin',
      status1: 'MAINTENANCE',
      status2: 'ANCRE',
      power: 'OFF',
      hours: '13 000 H',
      extra: 'EXTRA 3'
    },
    {
      id: 'M630001',
      craneType :'M63',
      notifications: 0,
      hookType: 'Benne Motorisée',
      status1: 'AFFECTE',
      status2: 'DRIVE',
      power: 'ON',
      hours: '46 389 H',
      extra: 'EXTRA 4'
    },
  ];

  // Helper to get the main crane icon class
  getCranIconClass(craneType: string): { type: 'image'; value: string } {
    switch (craneType) {
      case 'G38':
        return { type: 'image', value: 'G38.png' };
        case 'M63':
        return { type: 'image', value: 'M63.png' };
        case 'G40':
        return { type: 'image', value: 'G40.png' };
       
      default:
        return { type: 'image', value: 'default-crane.png' };
    }
  }

  // Helper returns object indicating if it's an icon or image
  getHookIconInfo(hookType: string): { type: 'icon' | 'image'; value: string } {
    switch (hookType) {
      case 'Crochet':
        return { type: 'image', value: 'Crochet.png' }
      case 'Benne':
        return { type: 'image', value: 'Benne.png' };
        case 'Grappin':
        return { type: 'image', value: 'Grappin.png' };
      case 'Benne Motorisée':
        return { type: 'image', value: 'Benne Motorisée.png' }
      default:
        return { type: 'image', value: 'no wifi.png' }
    }
  }

  // Helper to get the power icon class
  getPowerIconClass(powerStatus: string): string {
      return 'bi bi-power'; // Icon remains the same, state handled by text
  }
  
  // Helper to check if there are notifications (handles both number and string values)
  hasNotifications(notifications: number | string): boolean {
    if (typeof notifications === 'number') {
      return notifications > 0;
    } else if (typeof notifications === 'string') {
      // If it's a string like 'M', consider it as having notifications
      return notifications !== '0';
    }
    return false;
  }
}
