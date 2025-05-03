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
      id: 'G400005',
      notifications: 'M',
      hookType: 'grab-red',
      status1: 'MAINTENANCE',
      status2: 'ANCRE',
      power: 'OFF',
      hours: '13 000 H',
      extra: 'EXTRA 3'
    },
    {
      id: 'M630001',
      notifications: 0,
      hookType: 'grab-orange',
      status1: 'AFFECTE',
      status2: 'DRIVE',
      power: 'ON',
      hours: '46 389 H',
      extra: 'EXTRA 4'
    },
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
      id: 'G400005',
      notifications: 'M',
      hookType: 'grab-red',
      status1: 'MAINTENANCE',
      status2: 'ANCRE',
      power: 'OFF',
      hours: '13 000 H',
      extra: 'EXTRA 3'
    },
    {
      id: 'M630001',
      notifications: 0,
      hookType: 'grab-orange',
      status1: 'AFFECTE',
      status2: 'DRIVE',
      power: 'ON',
      hours: '46 389 H',
      extra: 'EXTRA 4'
    }
  ];

  // Helper to get the main crane icon class
  getCranIconClass(): { type:  'image'; value: string } {
    return { type: 'image', value: 'crane40.png' }
  }

  // Helper returns object indicating if it's an icon or image
  getHookIconInfo(hookType: string): { type: 'icon' | 'image'; value: string } {
    switch (hookType) {
      case 'hook':
        return { type: 'image', value: 'hook.png' }
      case 'grab-orange':
        return { type: 'image', value: 'grabber.png' };
      case 'grab-red':
        return { type: 'image', value: 'redgrabber.png' }
      default:
        return { type: 'image', value: 'no wifi.png' }
    }
  }

  // Helper to get the power icon class
  getPowerIconClass(powerStatus: string): string {
      return 'bi bi-power'; // Icon remains the same, state handled by text
  }
}
