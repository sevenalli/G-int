import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MqttService, IMqttMessage } from 'ngx-mqtt';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;

  // Real-time accessory detection from MQTT
  currentAccessoryType: string = 'Unknown';
  spreaderAttached: boolean = false;
  twinliftSpreaderAttached: boolean = false;
  grabCloseActive: boolean = false;
  grabOpenActive: boolean = false;

  cranes = [
    {
      id: 'G380003',
      notifications: 0,
      craneType: 'G38',
      hookType: 'Crochet',
      status1: 'AFFECTE',
      status2: 'DRIVE',
      power: 'ON',
      hours: '43 889 H',
      extra: 'EXTRA 1',
      route: '/supervisionCranes'
    },
    {
      id: 'G400001',
      notifications: 3,
      craneType: 'G40',
      hookType: 'Benne',
      status1: 'STANDBY',
      status2: 'PARK',
      power: 'ON',
      hours: '33 878 H',
      extra: 'EXTRA 2',
      route: '/supervisionCranes'
    },
    {
      id: 'G400005',
      notifications: 'M',
      craneType: 'G40',
      hookType: 'Grappin',
      status1: 'MAINTENANCE',
      status2: 'ANCRE',
      power: 'OFF',
      hours: '13 000 H',
      extra: 'EXTRA 3',
      route: '/supervisionCranes'
    },
    {
      id: 'M630001',
      notifications: 0,
      craneType: 'M63',
      hookType: 'Benne Motorisée',
      status1: 'AFFECTE',
      status2: 'DRIVE',
      power: 'ON',
      hours: '46 389 H',
      extra: 'EXTRA 4',
      route: '/terexSupervision'
    },
    {
      id: 'G380003',
      notifications: 0,
      craneType: 'G38',
      hookType: 'Crochet',
      status1: 'AFFECTE',
      status2: 'DRIVE',
      power: 'ON',
      hours: '43 889 H',
      extra: 'EXTRA 1',
      route: '/supervisionCranes'
    },
    {
      id: 'G400001',
      notifications: 3,
      craneType: 'G40',
      hookType: 'Benne',
      status1: 'STANDBY',
      status2: 'PARK',
      power: 'ON',
      hours: '33 878 H',
      extra: 'EXTRA 2',
      route: '/supervisionCranes'
    },
    {
      id: 'G400005',
      notifications: 'M',
      craneType: 'G40',
      hookType: 'Grappin',
      status1: 'MAINTENANCE',
      status2: 'ANCRE',
      power: 'OFF',
      hours: '13 000 H',
      extra: 'EXTRA 3',
      route: '/supervisionCranes'
    },
    {
      id: 'M630001',
      craneType: 'M63',
      notifications: 0,
      hookType: 'Benne Motorisée',
      status1: 'AFFECTE',
      status2: 'DRIVE',
      power: 'ON',
      hours: '46 389 H',
      extra: 'EXTRA 4',
      route: '/terexSupervision'
    },
  ];

  constructor(
    private _mqttService: MqttService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.connectToMqtt();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  connectToMqtt(): void {
    try {
      this.subscription = this._mqttService.observe('site/pi5/generator/snapshot').subscribe({
        next: (message: IMqttMessage) => {
          try {
            const parsed = JSON.parse(message.payload.toString());
            const data = parsed.data || parsed;
            this.updateAccessoryType(data);
          } catch (e) { console.error('Parse error', e); }
        },
        error: (error: any) => console.error('MQTT error:', error)
      });
    } catch (e) { console.error('MQTT connect error:', e); }
  }

  updateAccessoryType(data: any): void {
    // Primary Spreader detection
    if (data.Ruckmeldung_1_Spreader_gesteckt !== undefined) {
      this.spreaderAttached = Boolean(data.Ruckmeldung_1_Spreader_gesteckt);
    }

    // Twinlift Spreader detection
    if (data.VAR_Ruckmeldung_2_Twinlift_Spreader_gesteckt !== undefined) {
      this.twinliftSpreaderAttached = Boolean(data.VAR_Ruckmeldung_2_Twinlift_Spreader_gesteckt);
    }

    // Motor Grab control signals
    if (data.TK_Steuerhebel_Motorgreifer_Hubwerk2_Schlieen !== undefined) {
      this.grabCloseActive = Boolean(data.TK_Steuerhebel_Motorgreifer_Hubwerk2_Schlieen);
    }
    if (data.TK_Steuerhebel_Motorgreifer_Hubwerk2_Offnen !== undefined) {
      this.grabOpenActive = Boolean(data.TK_Steuerhebel_Motorgreifer_Hubwerk2_Offnen);
    }

    // Determine accessory type based on logic
    this.currentAccessoryType = this.determineAccessoryType();

    // Update the first crane's hookType as example (or all cranes if needed)
    // This updates the M630001 crane which is index 3 (terex supervision crane)
    if (this.cranes[3]) {
      this.cranes[3].hookType = this.currentAccessoryType;
    }
    if (this.cranes[7]) {
      this.cranes[7].hookType = this.currentAccessoryType;
    }

    this.cdr.detectChanges();
  }

  determineAccessoryType(): string {
    // Priority 1: Twinlift Spreader
    if (this.twinliftSpreaderAttached) {
      return 'Twinlift Spreader';
    }

    // Priority 2: Standard Spreader
    if (this.spreaderAttached) {
      return 'Spreader';
    }

    // Priority 3: Motor Grab (if grab signals are active)
    if (this.grabCloseActive || this.grabOpenActive) {
      return 'Benne Motorisée';
    }

    // Default: Hook (Crochet)
    return 'Crochet';
  }

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
        return { type: 'image', value: 'Crochet.png' };
      case 'Benne':
        return { type: 'image', value: 'Benne.png' };
      case 'Grappin':
        return { type: 'image', value: 'Grappin.png' };
      case 'Benne Motorisée':
        return { type: 'image', value: 'Benne Motorisée.png' };
      case 'Spreader':
        return { type: 'image', value: 'Spreader.png' };
      case 'Twinlift Spreader':
        return { type: 'image', value: 'Twinlift Spreader.png' };
      default:
        return { type: 'image', value: 'no wifi.png' };
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
