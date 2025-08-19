import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Engine, EnginesService } from '../services/engines.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  engines: Engine[] = [];

  constructor(
    private route: ActivatedRoute,
    private enginesService: EnginesService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // --- START OF MODIFICATION ---

      const terminalIds = this.normalizeQueryParam(params['terminalIds']);
      const engineTypeIds = this.normalizeQueryParam(params['equipmentIds']);

      // --- END OF MODIFICATION ---

      console.log('Normalized Terminal IDs:', terminalIds);
      console.log('Normalized Engine Type IDs:', engineTypeIds);

      if (terminalIds.length > 0 && engineTypeIds.length > 0) {
        this.enginesService.getEnginesByCriteria(terminalIds, engineTypeIds)
          .subscribe({
            next: (data) => {
              this.engines = data;
              console.log('Engines loaded:', this.engines);
            },
            error: (err) => {
              console.error('Failed to load engines by criteria', err);
            }
          });
      }
    });
  }

  private normalizeQueryParam(param: any): string[] {
    if (!param) {
      return []; // Case: Parameter doesn't exist
    }
    if (Array.isArray(param)) {
      return param; // Case: Already an array (e.g., ?id=1&id=2)
    }
    // Case: A single value or a comma-separated string
    // We convert it to a string first to be safe, then split.
    return String(param).split(',');
  }

  // cranes = [
  //   {
  //     id: 'G380003',
  //     notifications: 0,
  //     craneType :'G38',
  //     hookType: 'Crochet',
  //     status1: 'AFFECTE',
  //     status2: 'DRIVE',
  //     power: 'ON',
  //     hours: '43 889 H',
  //     extra: 'EXTRA 1',
  //     route: '/supervisionCranes'
  //   },
  //   {
  //     id: 'G400001',
  //     notifications: 3,
  //     craneType :'G40',
  //     hookType: 'Benne',
  //     status1: 'STANDBY',
  //     status2: 'PARK',
  //     power: 'ON',
  //     hours: '33 878 H',
  //     extra: 'EXTRA 2',
  //     route: '/supervisionCranes'
  //   },
  //   {
  //     id: 'G400005',
  //     notifications: 'M',
  //     craneType :'G40',
  //     hookType: 'Grappin',
  //     status1: 'MAINTENANCE',
  //     status2: 'ANCRE',
  //     power: 'OFF',
  //     hours: '13 000 H',
  //     extra: 'EXTRA 3',
  //     route: '/supervisionCranes'
  //   },
  //   {
  //     id: 'M630001',
  //     notifications: 0,
  //     craneType :'M63',
  //     hookType: 'Benne Motorisée',
  //     status1: 'AFFECTE',
  //     status2: 'DRIVE',
  //     power: 'ON',
  //     hours: '46 389 H',
  //     extra: 'EXTRA 4',
  //     route: '/terexSupervision'
  //   },
  //   {
  //     id: 'G380003',
  //     notifications: 0,
  //     craneType :'G38',
  //     hookType: 'Crochet',
  //     status1: 'AFFECTE',
  //     status2: 'DRIVE',
  //     power: 'ON',
  //     hours: '43 889 H',
  //     extra: 'EXTRA 1',
  //     route: '/supervisionCranes'
  //   },
  //   {
  //     id: 'G400001',
  //     notifications: 3,
  //     craneType :'G40',
  //     hookType: 'Benne',
  //     status1: 'STANDBY',
  //     status2: 'PARK',
  //     power: 'ON',
  //     hours: '33 878 H',
  //     extra: 'EXTRA 2',
  //     route: '/supervisionCranes'
  //   },
  //   {
  //     id: 'G400005',
  //     notifications: 'M',
  //     craneType :'G40',
  //     hookType: 'Grappin',
  //     status1: 'MAINTENANCE',
  //     status2: 'ANCRE',
  //     power: 'OFF',
  //     hours: '13 000 H',
  //     extra: 'EXTRA 3',
  //     route: '/supervisionCranes'
  //   },
  //   {
  //     id: 'M630001',
  //     craneType :'M63',
  //     notifications: 0,
  //     hookType: 'Benne Motorisée',
  //     status1: 'AFFECTE',
  //     status2: 'DRIVE',
  //     power: 'ON',
  //     hours: '46 389 H',
  //     extra: 'EXTRA 4',
  //     route: '/terexSupervision'
  //   },
  // ];

  // Helper to get the main crane icon class
  // We will base the icon on the engine's name for now as an example.
  getCranIconClass(engineName: string): { type: 'image'; value: string } {
    if (engineName.toLowerCase().includes('terex')) {
      return { type: 'image', value: 'M63.png' };
    }
    if (engineName.toLowerCase().includes('g38')) {
      return { type: 'image', value: 'G38.png' };
    }
    return { type: 'image', value: 'default-crane.png' };
  }

  // we will return a default or placeholder icon.
  getHookIconInfo(engine: Engine): { type: 'icon' | 'image'; value: string } {
    // Placeholder logic. You can enhance this later if you add 'hookType' to your Engine model.
    return { type: 'image', value: 'Crochet.png' }; // Return a default hook
  }

  // Helper to get the power status. This uses the 'isActive' property from your Engine.
  getPowerStatus(isActive: boolean): { icon: string; text: string } {
    if (isActive) {
      return { icon: 'bi bi-power text-success', text: 'ON' };
    } else {
      return { icon: 'bi bi-power text-danger', text: 'OFF' };
    }
  }
  
  // Helper to check if there are notifications (handles both number and string values)
  hasNotifications(engine: Engine): boolean {
    return engine.notifications ? engine.notifications > 0 : false;
  }

}
