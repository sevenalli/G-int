import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import {
  ApexChart,
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexFill,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
  ApexStroke,
  NgApexchartsModule
} from "ng-apexcharts";
import { NgxGaugeModule } from 'ngx-gauge';
import { ActivatedRoute } from '@angular/router';

export type SparklineOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  fill: ApexFill;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  colors: string[];
};

@Component({
  selector: 'app-supension',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, NgxGaugeModule],
  templateUrl: './supension.component.html',
  styleUrl: './supension.component.css',
  encapsulation: ViewEncapsulation.None
})
export class SupensionComponent implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;
  engineCode: string = '';
  currentDate: Date = new Date();

  // ===================== LOAD & SAFETY =====================
  chargeNette: number = 0;  // Radial Gauge, 0-41 t
  vitesseVent: number = 0;  // Digital Badge, 0-20 m/s
  hauteurLevageAdmissible: number = 0;  // Vertical Progress, 0-100 %
  compteurSpectre: number = 0;  // Odometer, 0-∞ SWP

  // ===================== SPEED & MOTION =====================
  vitesseMecLevage: number = 0;  // Semicircle Speedometer, -105 to 105 m/min
  vitesseOrientation: number = 0;  // Circular Gauge, 0-1.6 rpm

  // ===================== ENGINE & ENERGY =====================
  niveauCarburant: number = 0;  // Liquid Fill, 0-100 %
  temperatureMoteur: number = 0;  // Linear Thermometer, 0-110 °C
  puissanceMesuree: number = 0;  // Sparkline, 0-900 kW
  courantApparent: number = 0;  // Digital Readout, 0-400 A

  // ===================== ELECTRICAL =====================
  courantReel: number = 0;  // Sparkline/Area Chart, 0-600 A
  tensionMoteur: number = 0;  // Digital Gauge, 0-480 V
  frequenceReseau: number = 0;  // Text Readout, 58-62 Hz
  tensionReseauFreinage: number = 0;  // Bar Gauge, 0-600 V
  coupleEntrainement: number = 0;  // Radial Gauge (Torque), 0-100 %

  // ===================== TEMPERATURES =====================
  tempHuileReducteur: number = 0;  // Vertical Thermometer, 20-90 °C
  tempMoteurLevage: number = 0;  // Linear Bar, 20-110 °C
  tempMoteurOrientation: number = 0;  // Linear Bar, 20-100 °C
  tempAlternateur1: number = 0;  // Text/Mini Badge, 20-100 °C
  tempAlternateur2: number = 0;  // Text/Mini Badge, 20-100 °C

  // ===================== HYDRAULICS =====================
  tempHydraulique: number = 0;  // Circular Thermometer, 10-90 °C
  pressionPompe: number = 0;  // Pressure Gauge, 0-350 Bar
  pressionVolee: number = 0;  // Pressure Gauge, 0-400 Bar
  pressionFreinLevage: number = 0;  // Circular Pressure, 0-150 Bar
  pressionFreinOrientation: number = 0;  // Circular Pressure, 0-150 Bar
  pressionNiveau2: number = 0;  // Digital Readout, 0-300 Bar
  pressionDruckstufe7: number = 0;  // Digital Readout, 0-350 Bar
  anglePivotPompe: number = 0;  // Semi-Circle Gauge, -20 to 20 °

  // ===================== LOAD MECHANICS =====================
  coupleCharge: number = 0;  // Horizontal Bar, 0-3000 mt
  chargeBruteDMS1: number = 0;  // Data Table Row, 0-50 t
  chargeBruteDMS2: number = 0;  // Data Table Row, 0-50 t
  lastmessbolzenDMS1: number = 0;  // Line Chart, 0-4000 Raw
  lastmessbolzenDMS2: number = 0;  // Line Chart, 0-4000 Raw

  // ===================== POSITION & GEOMETRY =====================
  porteeMetres: number = 0;  // Boom radius in meters
  angleOrientation: number = 0;  // Superstructure angle
  hauteurLevage: number = 0;  // Hook height in meters
  calageAngleX: number = 0;  // Crane tilt X axis
  calageAngleY: number = 0;  // Crane tilt Y axis

  // ===================== GROSS LOAD =====================
  chargeBrute: number = 0;  // Gross load in tonnes
  chargeBruteAdmissible: number = 0;  // Max allowable gross load
  chargeBruteRelative: number = 0;  // Load percentage
  chargeNetteAdmissible: number = 0;  // Max allowable net load
  coupleChargeNominal: number = 0;  // Nominal load moment

  // ===================== SPEED LIMITS =====================
  vitesseLevageAdmissible: number = 0;  // Allowable hoist speed
  vitesseMaxiPeripherie: number = 0;  // Max peripheral speed
  vitesseMaxiGrue: number = 0;  // Max crane speed
  tempsAcceleration: number = 0;  // Acceleration time

  // ===================== CYLINDER PRESSURES =====================
  pressionVoleeTige: number = 0;  // Luffing cylinder rod side
  pressionFreinOrientation2: number = 0;  // Slewing brake 2
  consignePompe: number = 0;  // Pump setpoint
  anglePivotPompe2: number = 0;  // Pump pivot angle 2
  anglePivotPompe3: number = 0;  // Pump pivot angle 3

  // ===================== OPERATIONAL STATUS =====================
  dieselEnMarche: boolean = false;  // Diesel running
  kranHauptschalter: boolean = false;  // Main switch ON
  spreaderConnected: boolean = false;  // Spreader attached
  twinliftConnected: boolean = false;  // Twinlift attached
  containerVerrouille: boolean = false;  // Container locked

  // ===================== GEAR & TRANSMISSION =====================
  getriebeStufeI: boolean = false;  // Gear 1 (slow)
  getriebeStufeII: boolean = false;  // Gear 2 (medium)
  getriebeStufeIII: boolean = false;  // Gear 3 (fast)
  vitesseTranslationRapide: number = 0;  // Fast travel speed
  vitesseTranslationMoyenne: number = 0;  // Medium travel speed
  vitesseTranslationLente: number = 0;  // Slow travel speed

  // ===================== MAINTENANCE COUNTERS =====================
  heuresService: number = 0;  // Total service hours
  heuresDepuisEntretien: number = 0;  // Hours since last maintenance
  heuresAvantEntretien: number = 0;  // Hours until next maintenance

  // ===================== BOOM ANGLE =====================
  angleFleche: number = 0;  // Boom angle (0-90°)
  porteeCodeurAbsolu: number = 0;  // Radius from absolute encoder

  // ===================== ENGINE SENSORS =====================
  tempEauRadiateur: number = 0;  // Diesel water cooler temp
  tempAirTurbo: number = 0;  // Turbo intake air temp

  // ===================== ELECTRICAL / DRIVES =====================
  tensionBusDC: number = 0;  // DC bus voltage
  puissanceActive: number = 0;  // Active power
  consigneVitesseMoteur: number = 0;  // Motor speed setpoint (rpm)
  vitesseMoteurReelle: number = 0;  // Actual motor speed (rpm)
  tempMoteurOrient2: number = 0;  // Slewing motor 2 temp

  // ===================== ADDITIONAL HYDRAULICS =====================
  anglePivotPompe4: number = 0;  // Pump 4 pivot angle
  pressionFreinOrientation3: number = 0;  // Slewing brake 3
  pressionCapteurFondM2: number = 0;  // Luffing sensor M2 (raw)
  pressionCapteurTigeM3: number = 0;  // Luffing sensor M3 (raw)

  // Thresholds
  chargeNetteThresholds = { '0': { color: '#00E396' }, '20': { color: '#FEB019' }, '30': { color: '#FF4560' } };

  // History arrays for sparklines
  puissanceHistory: number[] = [];
  courantReelHistory: number[] = [];
  dms1History: number[] = [];
  dms2History: number[] = [];
  private maxDataPoints = 30;

  // Chart options
  puissanceChartOptions: SparklineOptions | undefined;
  courantChartOptions: SparklineOptions | undefined;
  dms1ChartOptions: SparklineOptions | undefined;
  dms2ChartOptions: SparklineOptions | undefined;

  constructor(
    private route: ActivatedRoute,
    private _mqttService: MqttService,
    private cdr: ChangeDetectorRef
  ) {
    this.initCharts();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.engineCode = params.get('engineCode') || '';
    });
    this.connectToTelemetry();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  connectToTelemetry(): void {
    try {
      this.subscription = this._mqttService.observe('site/pi5/generator/snapshot').subscribe({
        next: (message: IMqttMessage) => {
          try {
            const parsed = JSON.parse(message.payload.toString());
            const data = parsed.data || parsed;
            const timestamp = parsed.ts || null;
            this.updateFromTelemetry(data, timestamp);
          } catch (e) { console.error('Parse error', e); }
        },
        error: (error: any) => console.error('MQTT error:', error)
      });
    } catch (e) { console.error('MQTT connect error:', e); }
  }

  updateFromTelemetry(data: any, timestamp?: string): void {
    this.currentDate = timestamp ? new Date(timestamp) : new Date();

    // LOAD & SAFETY
    if (data.Charge_nette_en_tonnes !== undefined) this.chargeNette = Number(data.Charge_nette_en_tonnes);
    if (data.Vitesse_du_vent_valeur_reelle !== undefined) this.vitesseVent = Number(data.Vitesse_du_vent_valeur_reelle);
    if (data.Hauteur_de_levage_admissible_en_pourcentage !== undefined) this.hauteurLevageAdmissible = Number(data.Hauteur_de_levage_admissible_en_pourcentage);
    if (data.Compteur_spectre_de_charge_du_mec_levage !== undefined) this.compteurSpectre = Number(data.Compteur_spectre_de_charge_du_mec_levage);

    // SPEED & MOTION
    if (data.Vitesse_du_mec_levage_en_m_min !== undefined) this.vitesseMecLevage = Number(data.Vitesse_du_mec_levage_en_m_min);
    if (data.Vitesse_d_orientation_maxi_en_tr_min_reduite !== undefined) this.vitesseOrientation = Number(data.Vitesse_d_orientation_maxi_en_tr_min_reduite);

    // ENGINE & ENERGY
    if (data.Reservoir_de_carburant_diesel_niveau_de_remplissage_en !== undefined) this.niveauCarburant = Number(data.Reservoir_de_carburant_diesel_niveau_de_remplissage_en);
    if (data.Temperature_du_moteur_en_degres_Celsius !== undefined) this.temperatureMoteur = Number(data.Temperature_du_moteur_en_degres_Celsius);
    if (data.Puissance_mesuree_en_kW !== undefined) { this.puissanceMesuree = Number(data.Puissance_mesuree_en_kW); this.addToHistory(this.puissanceHistory, this.puissanceMesuree); }
    if (data.Courant_apparent !== undefined) this.courantApparent = Number(data.Courant_apparent);

    // ELECTRICAL
    if (data.Valeur_reelle_du_courant_en_A !== undefined) { this.courantReel = Number(data.Valeur_reelle_du_courant_en_A); this.addToHistory(this.courantReelHistory, this.courantReel); }
    if (data.Valeur_reelle_tension_moteur_en_V !== undefined) this.tensionMoteur = Number(data.Valeur_reelle_tension_moteur_en_V);
    if (data.Frequence_de_reseau !== undefined) this.frequenceReseau = Number(data.Frequence_de_reseau);
    if (data.Tension_reseau_du_simoreg_de_freinage !== undefined) this.tensionReseauFreinage = Number(data.Tension_reseau_du_simoreg_de_freinage);
    if (data.Valeur_reelle_du_couple_venant_de_l_entrainement !== undefined) this.coupleEntrainement = Number(data.Valeur_reelle_du_couple_venant_de_l_entrainement);

    // TEMPERATURES
    if (data.Mec_levage_1_temperature_de_l_huile_du_reducteur !== undefined) this.tempHuileReducteur = Number(data.Mec_levage_1_temperature_de_l_huile_du_reducteur);
    if (data.Mec_levage_1_temperature_du_moteur_en_degres_Celsius !== undefined) this.tempMoteurLevage = Number(data.Mec_levage_1_temperature_du_moteur_en_degres_Celsius);
    if (data.Mec_orient_1_temperature_du_moteur_en_degres_Celsius !== undefined) this.tempMoteurOrientation = Number(data.Mec_orient_1_temperature_du_moteur_en_degres_Celsius);
    if (data.Alternateur_valeur_de_temperature_1_PT100 !== undefined) this.tempAlternateur1 = Number(data.Alternateur_valeur_de_temperature_1_PT100);
    if (data.Alternateur_valeur_de_temperature_2_PT100 !== undefined) this.tempAlternateur2 = Number(data.Alternateur_valeur_de_temperature_2_PT100);

    // HYDRAULICS
    if (data.Temperature_du_systeme_hydraulique !== undefined) this.tempHydraulique = Number(data.Temperature_du_systeme_hydraulique);
    if (data.Valeur_reelle_pression_de_pompe !== undefined) this.pressionPompe = Number(data.Valeur_reelle_pression_de_pompe);
    if (data.Pression_mec_de_volee_cote_fond !== undefined) this.pressionVolee = Number(data.Pression_mec_de_volee_cote_fond);
    if (data.Pression_de_service_pour_le_frein_du_mec_de_levage !== undefined) this.pressionFreinLevage = Number(data.Pression_de_service_pour_le_frein_du_mec_de_levage);
    if (data.Pression_de_service_du_frein_dorientation_1 !== undefined) this.pressionFreinOrientation = Number(data.Pression_de_service_du_frein_dorientation_1);
    if (data.Valeur_pression_pr_niv_de_press_2_en_bars !== undefined) this.pressionNiveau2 = Number(data.Valeur_pression_pr_niv_de_press_2_en_bars);
    if (data.Druckwert_fur_Druckstufe_7_in_bar !== undefined) this.pressionDruckstufe7 = Number(data.Druckwert_fur_Druckstufe_7_in_bar);
    if (data.Valeur_reelle_angle_de_pivotement_pompe_1 !== undefined) this.anglePivotPompe = Number(data.Valeur_reelle_angle_de_pivotement_pompe_1);

    // LOAD MECHANICS
    if (data.Couple_de_charge_en_metres_x_tonnes !== undefined) this.coupleCharge = Number(data.Couple_de_charge_en_metres_x_tonnes);
    if (data.Charge_brute_mec_levage_1_jauge_DMS_1 !== undefined) this.chargeBruteDMS1 = Number(data.Charge_brute_mec_levage_1_jauge_DMS_1);
    if (data.Charge_brute_mec_levage_1_jauge_DMS_2 !== undefined) this.chargeBruteDMS2 = Number(data.Charge_brute_mec_levage_1_jauge_DMS_2);
    if (data.Lastmessbolzen_Hubwerk_1_DMS_1 !== undefined) { this.lastmessbolzenDMS1 = Number(data.Lastmessbolzen_Hubwerk_1_DMS_1); this.addToHistory(this.dms1History, this.lastmessbolzenDMS1); }
    if (data.Lastmessbolzen_Hubwerk_1_DMS_2 !== undefined) { this.lastmessbolzenDMS2 = Number(data.Lastmessbolzen_Hubwerk_1_DMS_2); this.addToHistory(this.dms2History, this.lastmessbolzenDMS2); }

    // POSITION & GEOMETRY
    if (data.Portee_en_metres !== undefined) this.porteeMetres = Number(data.Portee_en_metres);
    if (data.Angle_d_orientation_superstructure_chassis_valeur_reelle !== undefined) this.angleOrientation = Number(data.Angle_d_orientation_superstructure_chassis_valeur_reelle);
    if (data.Valeur_reelle_de_la_hauteur_de_levage_en_m_codeur_absolu !== undefined) this.hauteurLevage = Number(data.Valeur_reelle_de_la_hauteur_de_levage_en_m_codeur_absolu);
    if (data.Calage_angle_de_laxe_X !== undefined) this.calageAngleX = Number(data.Calage_angle_de_laxe_X);
    if (data.Calage_angle_de_laxe_Y !== undefined) this.calageAngleY = Number(data.Calage_angle_de_laxe_Y);

    // GROSS LOAD
    if (data.Charge_brute_en_tonnes !== undefined) this.chargeBrute = Number(data.Charge_brute_en_tonnes);
    if (data.Charge_brute_en_tonnes_admissible !== undefined) this.chargeBruteAdmissible = Number(data.Charge_brute_en_tonnes_admissible);
    if (data.Charge_brute_relative !== undefined) this.chargeBruteRelative = Number(data.Charge_brute_relative);
    if (data.Charge_nette_admissible_en_tonnes !== undefined) this.chargeNetteAdmissible = Number(data.Charge_nette_admissible_en_tonnes);
    if (data.Couple_de_charge_nominal !== undefined) this.coupleChargeNominal = Number(data.Couple_de_charge_nominal);

    // SPEED LIMITS
    if (data.Mec_levage_vitesse_admissible_en_m_min !== undefined) this.vitesseLevageAdmissible = Number(data.Mec_levage_vitesse_admissible_en_m_min);
    if (data.Vitesse_maxi_a_la_peripherie_en_m_min_reduite !== undefined) this.vitesseMaxiPeripherie = Number(data.Vitesse_maxi_a_la_peripherie_en_m_min_reduite);
    if (data.Vitesse_maxi_de_la_grue_en_tr_min !== undefined) this.vitesseMaxiGrue = Number(data.Vitesse_maxi_de_la_grue_en_tr_min);
    if (data.Temps_d_acceleration_effectif_en_sec !== undefined) this.tempsAcceleration = Number(data.Temps_d_acceleration_effectif_en_sec);

    // CYLINDER PRESSURES
    if (data.Pression_mec_de_volee_cote_tige !== undefined) this.pressionVoleeTige = Number(data.Pression_mec_de_volee_cote_tige);
    if (data.Pression_de_service_du_frein_dorientation_2 !== undefined) this.pressionFreinOrientation2 = Number(data.Pression_de_service_du_frein_dorientation_2);
    if (data.Valeur_de_consigne_pompe_hydraulique !== undefined) this.consignePompe = Number(data.Valeur_de_consigne_pompe_hydraulique);
    if (data.Valeur_reelle_angle_de_pivotement_pompe_2 !== undefined) this.anglePivotPompe2 = Number(data.Valeur_reelle_angle_de_pivotement_pompe_2);
    if (data.Valeur_reelle_angle_de_pivotement_pompe_3 !== undefined) this.anglePivotPompe3 = Number(data.Valeur_reelle_angle_de_pivotement_pompe_3);

    // OPERATIONAL STATUS
    if (data.Uberwachung_Signal_Dieselmotor_in_Betrieb !== undefined) this.dieselEnMarche = Boolean(data.Uberwachung_Signal_Dieselmotor_in_Betrieb);
    if (data.Kranhauptschalter_ist_EIN !== undefined) this.kranHauptschalter = Boolean(data.Kranhauptschalter_ist_EIN);
    if (data.Ruckmeldung_1_Spreader_gesteckt !== undefined) this.spreaderConnected = Boolean(data.Ruckmeldung_1_Spreader_gesteckt);
    if (data.VAR_Ruckmeldung_2_Twinlift_Spreader_gesteckt !== undefined) this.twinliftConnected = Boolean(data.VAR_Ruckmeldung_2_Twinlift_Spreader_gesteckt);
    if (data.Ruckmeldung_Container_verriegelt !== undefined) this.containerVerrouille = Boolean(data.Ruckmeldung_Container_verriegelt);

    // GEAR & TRANSMISSION
    if (data.Hubwerk1_Getriebeumschaltung_Endstellung_Getriebestufe_I_langsam !== undefined) this.getriebeStufeI = Boolean(data.Hubwerk1_Getriebeumschaltung_Endstellung_Getriebestufe_I_langsam);
    if (data.Hubwerksgetriebeumschaltung_Endstellung_Getriebestufe_II_Mittel_schnell !== undefined) this.getriebeStufeII = Boolean(data.Hubwerksgetriebeumschaltung_Endstellung_Getriebestufe_II_Mittel_schnell);
    if (data.Hubwerksgetriebeumschaltung_Getriebestufe_III_schnell !== undefined) this.getriebeStufeIII = Boolean(data.Hubwerksgetriebeumschaltung_Getriebestufe_III_schnell);
    if (data.Vitesse_de_translation_rapide_m_min !== undefined) this.vitesseTranslationRapide = Number(data.Vitesse_de_translation_rapide_m_min);
    if (data.Vitesse_de_translation_moyenne_m_min !== undefined) this.vitesseTranslationMoyenne = Number(data.Vitesse_de_translation_moyenne_m_min);
    if (data.Vitesse_de_translation_lente_m_min !== undefined) this.vitesseTranslationLente = Number(data.Vitesse_de_translation_lente_m_min);

    // MAINTENANCE COUNTERS
    if (data.Compteur_d_heures_de_service_heures !== undefined) this.heuresService = Number(data.Compteur_d_heures_de_service_heures);
    if (data.Compteur_d_heures_de_service_heures_depuis_le_dernier_entretien !== undefined) this.heuresDepuisEntretien = Number(data.Compteur_d_heures_de_service_heures_depuis_le_dernier_entretien);
    if (data.Compteur_d_heures_de_service_heures_jusqu_au_prochain_entretien !== undefined) this.heuresAvantEntretien = Number(data.Compteur_d_heures_de_service_heures_jusqu_au_prochain_entretien);

    // BOOM ANGLE
    if (data.Angle_de_la_fleche_unite_en_degres_0_90_degres !== undefined) this.angleFleche = Number(data.Angle_de_la_fleche_unite_en_degres_0_90_degres);
    if (data.Portee_en_metres_codeur_absolu !== undefined) this.porteeCodeurAbsolu = Number(data.Portee_en_metres_codeur_absolu);

    // ENGINE SENSORS
    if (data.Tempertur_Dieselmotor_Wasserkuhler !== undefined) this.tempEauRadiateur = Number(data.Tempertur_Dieselmotor_Wasserkuhler);
    if (data.Tempertur_Dieselmotor_Ladeluft !== undefined) this.tempAirTurbo = Number(data.Tempertur_Dieselmotor_Ladeluft);

    // ELECTRICAL / DRIVES
    if (data.Tension_du_circuit_intermediaire_en_V !== undefined) this.tensionBusDC = Number(data.Tension_du_circuit_intermediaire_en_V);
    if (data.Puissance_en_kW !== undefined) this.puissanceActive = Number(data.Puissance_en_kW);
    if (data.Valeur_de_consigne_vitesse_moteur !== undefined) this.consigneVitesseMoteur = Number(data.Valeur_de_consigne_vitesse_moteur);
    if (data.Valeur_reelle_vitesse_en_t_min !== undefined) this.vitesseMoteurReelle = Number(data.Valeur_reelle_vitesse_en_t_min);
    if (data.Mec_orient_2_temperature_du_moteur_en_degres_Celsius !== undefined) this.tempMoteurOrient2 = Number(data.Mec_orient_2_temperature_du_moteur_en_degres_Celsius);

    // ADDITIONAL HYDRAULICS
    if (data.Valeur_reelle_angle_de_pivotement_pompe_4 !== undefined) this.anglePivotPompe4 = Number(data.Valeur_reelle_angle_de_pivotement_pompe_4);
    if (data.Pression_de_service_du_frein_dorientation_3 !== undefined) this.pressionFreinOrientation3 = Number(data.Pression_de_service_du_frein_dorientation_3);
    if (data.Wippwerk_Drucksensor_Bodenseite_M2 !== undefined) this.pressionCapteurFondM2 = Number(data.Wippwerk_Drucksensor_Bodenseite_M2);
    if (data.Wippwerk_Drucksensor_Stangenseite_M3 !== undefined) this.pressionCapteurTigeM3 = Number(data.Wippwerk_Drucksensor_Stangenseite_M3);

    this.updateCharts();
    this.cdr.detectChanges();
  }

  addToHistory(arr: number[], val: number): void {
    arr.push(val);
    if (arr.length > this.maxDataPoints) arr.shift();
  }

  initCharts(): void {
    this.puissanceChartOptions = this.createSparkline('#FEB019');
    this.courantChartOptions = this.createSparkline('#008FFB');
    this.dms1ChartOptions = this.createSparkline('#00E396');
    this.dms2ChartOptions = this.createSparkline('#FF4560');
  }

  createSparkline(color: string): SparklineOptions {
    return {
      series: [{ name: 'Value', data: [] }],
      chart: { type: 'area', height: 60, sparkline: { enabled: true } },
      stroke: { curve: 'smooth', width: 2 },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 } },
      colors: [color],
      xaxis: { type: 'category' },
      yaxis: { show: false },
      dataLabels: { enabled: false },
      tooltip: { theme: 'dark' }
    };
  }

  updateCharts(): void {
    if (this.puissanceChartOptions) this.puissanceChartOptions.series = [{ name: 'Power', data: [...this.puissanceHistory] }];
    if (this.courantChartOptions) this.courantChartOptions.series = [{ name: 'Current', data: [...this.courantReelHistory] }];
    if (this.dms1ChartOptions) this.dms1ChartOptions.series = [{ name: 'DMS1', data: [...this.dms1History] }];
    if (this.dms2ChartOptions) this.dms2ChartOptions.series = [{ name: 'DMS2', data: [...this.dms2History] }];
  }

  // Helper methods
  getWindClass(): string {
    if (this.vitesseVent >= 15) return 'danger';
    if (this.vitesseVent >= 8) return 'warning';
    return 'safe';
  }

  getTempColor(temp: number, max: number): string {
    const ratio = temp / max;
    if (ratio >= 0.85) return '#FF4560';
    if (ratio >= 0.65) return '#FEB019';
    return '#00E396';
  }

  getFuelClass(): string {
    if (this.niveauCarburant <= 15) return 'critical';
    if (this.niveauCarburant <= 30) return 'low';
    return 'normal';
  }

  getFreqClass(): string {
    if (this.frequenceReseau < 58 || this.frequenceReseau > 62) return 'danger';
    if (this.frequenceReseau < 59 || this.frequenceReseau > 61) return 'warning';
    return 'safe';
  }
}
