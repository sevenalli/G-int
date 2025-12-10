import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MqttService, IMqttMessage } from 'ngx-mqtt';

// Notification tag definition
interface NotificationTag {
  tagName: string;
  message: string;
  type: 'Critical' | 'Alarm' | 'Warning' | 'Fault' | 'Info';
  category: string;
}

// Active notification
export interface Notification {
  id: number;
  tagName: string;
  timestamp: Date;
  message: string;
  type: 'Critical' | 'Alarm' | 'Warning' | 'Fault' | 'Info';
  category: string;
  isRead: boolean;
  isActive: boolean;
}

// All notification tags from the specification
const NOTIFICATION_TAGS: NotificationTag[] = [
  // Diesel Engine
  { tagName: 'Dieselmotor_Not_Aus', message: 'ARRÊT D\'URGENCE MOTEUR ACTIVÉ', type: 'Critical', category: 'Diesel Engine' },
  { tagName: 'Dieselmotor_Oeldruck_zu_niedrig_GHxK2', message: 'Pression d\'huile moteur critique (Basse)', type: 'Alarm', category: 'Diesel Engine' },
  { tagName: 'Dieselmotor_Kuehlwassertemperatur_zu_hoch_GI', message: 'Surchauffe moteur : Temp. eau trop élevée', type: 'Alarm', category: 'Diesel Engine' },
  { tagName: 'Dieselmotor_Kuehlwassermangel_GHxK2', message: 'Niveau liquide de refroidissement bas', type: 'Warning', category: 'Diesel Engine' },
  { tagName: 'Dieselmotor_Ueberdrehzahl_GHxK2', message: 'Alarme : Survitesse moteur détectée', type: 'Alarm', category: 'Diesel Engine' },
  { tagName: 'Dieselmotor_Wasser_im_Vorfilter_GHxK2', message: 'Eau détectée dans le préfiltre carburant', type: 'Warning', category: 'Diesel Engine' },
  { tagName: 'Dieselmotor_Ladeluftpumpe_Stoerung_GHxK2', message: 'Défaut : Pompe d\'air de suralimentation', type: 'Fault', category: 'Diesel Engine' },
  { tagName: 'Dieselmotor_EDC_Fehler_GHxK2', message: 'Erreur système injection (EDC)', type: 'Fault', category: 'Diesel Engine' },
  { tagName: 'Dieselmotor_MFR_Fehler_GHxK2', message: 'Erreur contrôleur moteur (MFR)', type: 'Fault', category: 'Diesel Engine' },
  { tagName: 'Dieselmotor_Abstellalarm_GHxK2', message: 'Alarme d\'arrêt moteur général', type: 'Alarm', category: 'Diesel Engine' },

  // Emergency
  { tagName: 'Fahrwerk_Not_Halt_ausgelost', message: 'ARRÊT D\'URGENCE TRANSLATION GÉNÉRAL', type: 'Critical', category: 'Emergency' },
  { tagName: 'Fahrwerk_Not_Halt_vorne_rechts', message: 'AU Translation : Avant Droite', type: 'Critical', category: 'Emergency' },
  { tagName: 'Fahrwerk_Not_Halt_vorne_links', message: 'AU Translation : Avant Gauche', type: 'Critical', category: 'Emergency' },
  { tagName: 'Fahrwerk_Not_Halt_hinten_rechts', message: 'AU Translation : Arrière Droite', type: 'Critical', category: 'Emergency' },
  { tagName: 'Fahrwerk_Not_Halt_hinten_links', message: 'AU Translation : Arrière Gauche', type: 'Critical', category: 'Emergency' },
  { tagName: 'OPT_Fahrwerk_Notendschalter_vorne', message: 'Fin de course urgence : Translation Avant', type: 'Warning', category: 'Emergency' },
  { tagName: 'OPT_Fahrwerk_Notendschalter_hinten', message: 'Fin de course urgence : Translation Arrière', type: 'Alarm', category: 'Emergency' },

  // Safety System
  { tagName: 'HW1_B_w_Sicherheits_SPS_Limit_Verschleigrenz', message: 'Critique : Limite d\'usure frein levage 1 atteinte', type: 'Critical', category: 'Safety System' },
  { tagName: 'HW1_B_w_Sicherheits_SPS_Warnung_Verschleigr', message: 'Avertissement : Usure frein levage 1', type: 'Warning', category: 'Safety System' },
  { tagName: 'HW1_B_w_Sicherheits_SPS_Sersorstwert_bei_Br', message: 'Défaut Capteur : Frein levage 1 reste ouvert', type: 'Fault', category: 'Safety System' },
  { tagName: 'HW1_B_w_Sicherheits_SPS_Diskrepanzfehler_Ser', message: 'Erreur incohérence capteurs (Levage 1)', type: 'Fault', category: 'Safety System' },
  { tagName: 'Hubwerk1_Bremsschutz', message: 'Protection frein levage 1 déclenchée', type: 'Warning', category: 'Safety System' },
  { tagName: 'Drehwerk_Bremsschutz', message: 'Protection frein orientation déclenchée', type: 'Alarm', category: 'Safety System' },
  { tagName: 'OPT_Fahrwerk_Hinderniserkennung_vorne_rechts', message: 'Obstacle détecté : Avant Droite', type: 'Warning', category: 'Safety System' },
  { tagName: 'OPT_Fahrwerk_Hinderniserkennung_vorne_links', message: 'Obstacle détecté : Avant Gauche', type: 'Warning', category: 'Safety System' },

  // Electrical
  { tagName: 'VAR_Fremdeinspeisung_Temperaturuberwachung', message: 'Arrêt : Surchauffe transformateur externe', type: 'Critical', category: 'Electrical' },
  { tagName: 'Absicherung_Spreader', message: 'Défaut fusible : Spreader', type: 'Fault', category: 'Electrical' },
  { tagName: 'FI_Schutzschalter_Spreader', message: 'Disjoncteur différentiel Spreader déclenché', type: 'Fault', category: 'Electrical' },
  { tagName: 'Absicherung_Monitor_Turmkabine', message: 'Défaut alim. : Moniteur cabine', type: 'Fault', category: 'Electrical' },
  { tagName: 'Absicherung_Leistungsmessumformer', message: 'Défaut protection : Convertisseur de puissance', type: 'Fault', category: 'Electrical' },
  { tagName: 'Hauptsicherung_Arbeitsplatzbeleuchtung_Portal', message: 'Fusible éclairage portique grillé', type: 'Warning', category: 'Electrical' },

  // Status (Info)
  { tagName: 'Kranhauptschalter_ist_EIN', message: 'Grue sous tension (ON)', type: 'Info', category: 'Status (Info)' },
  { tagName: 'Uberwachung_Signal_Dieselmotor_in_Betrieb', message: 'Moteur Diesel en marche', type: 'Info', category: 'Status (Info)' },
  { tagName: 'Sturmbolzen_rechts_verriegelt', message: 'Verrouillage tempête engagé (Droite)', type: 'Info', category: 'Status (Info)' },
  { tagName: 'Sturmbolzen_links_verriegelt', message: 'Verrouillage tempête engagé (Gauche)', type: 'Info', category: 'Status (Info)' },
  { tagName: 'Ruckmeldung_Container_verriegelt', message: 'Container Verrouillé', type: 'Info', category: 'Status (Info)' },

  // System & Communication Faults
  { tagName: 'Abschaltung_Programm_durch_DP_Bus_Fehler', message: 'Arrêt Programme : Erreur Bus Profibus (DP)', type: 'Critical', category: 'System' },
  { tagName: 'Abschaltung_Programm_durch_ASI_Bus_Fehler', message: 'Arrêt Programme : Erreur Bus ASI', type: 'Critical', category: 'System' },

  // Spreader & Twistlocks
  { tagName: 'Ruckmeldung_Container_entriegelt', message: 'Container Déverrouillé', type: 'Info', category: 'Spreader' },
  { tagName: 'Ruckmeldung_Spreader_aufgesetzt', message: 'Spreader posé sur container (Landed)', type: 'Info', category: 'Spreader' },
  { tagName: 'Ruckmeldung_Spreader_in_Mittelstellung', message: 'Spreader centré (Mittelstellung)', type: 'Info', category: 'Spreader' },
  { tagName: 'Ruckmeldung_1_Spreader_gesteckt', message: 'Câble Spreader Connecté', type: 'Info', category: 'Spreader' },
  { tagName: 'RCLD_Ruckmeldung_Twistlocks_verriegelt', message: 'Twistlocks Verrouillés (Feedback RCLD)', type: 'Info', category: 'Spreader' },

  // Hoist & Drive Faults
  { tagName: 'Hubwerk1_Fehler_Getriebeumschaltung', message: 'Erreur changement de vitesse Levage 1', type: 'Fault', category: 'Hoist' },

  // Travel Faults
  { tagName: 'Schienenbremse_rechts_Oldruck_erreicht_0', message: 'Défaut Pression : Frein Rail Droit', type: 'Alarm', category: 'Travel' },
  { tagName: 'Schienenbremse_links_Oldruck_erreicht_0', message: 'Défaut Pression : Frein Rail Gauche', type: 'Alarm', category: 'Travel' },

  // Chassis Status
  { tagName: 'Kran_abgestutzt', message: 'Grue entièrement calée (Stabilisateurs OK)', type: 'Info', category: 'Chassis' },
  { tagName: 'Oberwagen_und_Unterwagen_verriegelt', message: 'Chassis et Tourelle Verrouillés', type: 'Info', category: 'Chassis' },
  { tagName: 'Sturmbolzen_entriegelt', message: 'Verrous tempête déverrouillés (Prêt à rouler)', type: 'Info', category: 'Chassis' },
  { tagName: 'Fahrwerk_Schienenbremse_rechts_geoffnet', message: 'Frein sur rail droit : OUVERT', type: 'Info', category: 'Chassis' },
  { tagName: 'Fahrwerk_Schienenbremse_links_geoffnet', message: 'Frein sur rail gauche : OUVERT', type: 'Info', category: 'Chassis' },

  // Cable Reel
  { tagName: 'Fahrleitungstrommel_leer', message: 'Attention : Enrouleur câble VIDE', type: 'Warning', category: 'Electrical' },
  { tagName: 'Fahrleitungstrommel_voll', message: 'Info : Enrouleur câble PLEIN', type: 'Info', category: 'Electrical' },

  // Remote Control
  { tagName: 'FFB_Not_Aus_Taste_nicht_betatigt', message: 'Arrêt Urgence Radio : OK (Non actionné)', type: 'Info', category: 'Remote Control' },
  { tagName: 'FFB_Meldung_Hauptschaler_Ein', message: 'Interrupteur principal Radio : ON', type: 'Info', category: 'Remote Control' },
  { tagName: 'FFB_Eingeschaltet', message: 'Radiocommande Connectée', type: 'Info', category: 'Remote Control' },

  // Additional Electrical
  { tagName: 'Absicherung_Beleuchtung_Unterwagen_HSK', message: 'Défaut Fusible : Eclairage Chassis', type: 'Fault', category: 'Electrical' },
  { tagName: 'Kranhauptnetz_Spannung_vorhanden', message: 'Tension Secteur Principale Présente', type: 'Info', category: 'Electrical' }
];

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;
  private notificationId = 0;

  // Filter states
  typeFilter: string = 'all';
  categoryFilter: string = 'all';
  showActiveOnly: boolean = false;
  searchText: string = '';

  // Categories from tags
  categories: string[] = [...new Set(NOTIFICATION_TAGS.map(t => t.category))];

  // Active notifications
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];

  // Track previous tag states
  private previousStates: Map<string, boolean> = new Map();

  constructor(
    private route: ActivatedRoute,
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
            this.processNotifications(data);
          } catch (e) { console.error('Parse error', e); }
        },
        error: (error: any) => console.error('MQTT error:', error)
      });
    } catch (e) { console.error('MQTT connect error:', e); }
  }

  processNotifications(data: any): void {
    for (const tag of NOTIFICATION_TAGS) {
      const currentValue = data[tag.tagName];
      if (currentValue !== undefined) {
        const isActive = Boolean(currentValue);
        const wasActive = this.previousStates.get(tag.tagName) || false;

        // New notification triggered
        if (isActive && !wasActive) {
          this.addNotification(tag, true);
        }
        // Notification cleared
        else if (!isActive && wasActive) {
          this.clearNotification(tag.tagName);
        }

        this.previousStates.set(tag.tagName, isActive);
      }
    }

    this.applyFilters();
    this.cdr.detectChanges();
  }

  addNotification(tag: NotificationTag, isActive: boolean): void {
    // Check if already exists
    const existing = this.notifications.find(n => n.tagName === tag.tagName && n.isActive);
    if (existing) return;

    this.notificationId++;
    this.notifications.unshift({
      id: this.notificationId,
      tagName: tag.tagName,
      timestamp: new Date(),
      message: tag.message,
      type: tag.type,
      category: tag.category,
      isRead: false,
      isActive: isActive
    });

    // Play sound for critical/alarm
    if (tag.type === 'Critical' || tag.type === 'Alarm') {
      this.playAlertSound();
    }
  }

  clearNotification(tagName: string): void {
    const notification = this.notifications.find(n => n.tagName === tagName && n.isActive);
    if (notification) {
      notification.isActive = false;
    }
  }

  playAlertSound(): void {
    // Browser notification sound (optional)
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ==');
      audio.volume = 0.3;
      audio.play().catch(() => { });
    } catch (e) { }
  }

  applyFilters(): void {
    this.filteredNotifications = this.notifications.filter(n => {
      if (this.typeFilter !== 'all' && n.type !== this.typeFilter) return false;
      if (this.categoryFilter !== 'all' && n.category !== this.categoryFilter) return false;
      if (this.showActiveOnly && !n.isActive) return false;
      if (this.searchText.trim()) {
        const search = this.searchText.toLowerCase();
        return n.message.toLowerCase().includes(search) || n.tagName.toLowerCase().includes(search);
      }
      return true;
    });
  }

  filterByType(type: string): void { this.typeFilter = type; this.applyFilters(); }
  filterByCategory(category: string): void { this.categoryFilter = category; this.applyFilters(); }
  toggleActiveOnly(): void { this.showActiveOnly = !this.showActiveOnly; this.applyFilters(); }
  search(text: string): void { this.searchText = text; this.applyFilters(); }

  markAsRead(id: number): void {
    const n = this.notifications.find(n => n.id === id);
    if (n) { n.isRead = true; this.applyFilters(); }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
    this.applyFilters();
  }

  clearAllInactive(): void {
    this.notifications = this.notifications.filter(n => n.isActive);
    this.applyFilters();
  }

  getUnreadCount(): number { return this.notifications.filter(n => !n.isRead).length; }
  getActiveCount(): number { return this.notifications.filter(n => n.isActive).length; }
  getCriticalCount(): number { return this.notifications.filter(n => n.isActive && n.type === 'Critical').length; }

  getTypeClass(type: string): string {
    switch (type) {
      case 'Critical': return 'badge bg-danger';
      case 'Alarm': return 'badge bg-warning text-dark';
      case 'Warning': return 'badge bg-orange';
      case 'Fault': return 'badge bg-secondary';
      case 'Info': return 'badge bg-info text-dark';
      default: return 'badge bg-secondary';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'Critical': return 'bi bi-exclamation-octagon-fill';
      case 'Alarm': return 'bi bi-bell-fill';
      case 'Warning': return 'bi bi-exclamation-triangle-fill';
      case 'Fault': return 'bi bi-x-circle-fill';
      case 'Info': return 'bi bi-info-circle-fill';
      default: return 'bi bi-bell';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'Diesel Engine': return 'bi bi-fuel-pump';
      case 'Emergency': return 'bi bi-sign-stop';
      case 'Safety System': return 'bi bi-shield-exclamation';
      case 'Electrical': return 'bi bi-lightning-charge';
      case 'Status (Info)': return 'bi bi-info-circle';
      default: return 'bi bi-bell';
    }
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
