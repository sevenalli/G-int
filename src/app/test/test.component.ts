import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TestComponent implements OnInit {
  // Crane Position States
  private _rotationValue: number = 45; // Slew angle in degrees (0-360)
  private _luffingValue: number = 50; // Luffing value (0-100%)
  private _hookValue: number = 50; // Hook height (0-100%)
  private _isLoaded: boolean = false; // Load status

  // Unified Rotation Control (0 = initial position, 100 = final position)
  unifiedRotationValue: number = 50;
  
  // Initial and final values for rotation and scaleX
  initialRotation = 0;
  finalRotation = 180;
  initialScaleX = 1;
  finalScaleX = -1;
  
  // Luffing and hoisting properties
  armLuffingAngle: number = 20;
  ropeHeight: number = 100;
  grabberTop: number = 100;
  
  // System Status
  systemStatus: string = 'OPERATIONAL';
  
  // Alarms
  alarms: Array<{message: string, severity: string, time: string}> = [
    { time: '10:05:23', message: 'System startup complete', severity: 'info' }
  ];

  constructor() {}
  
  ngOnInit() {
    // Initialize the component
    this.updateLuffingComponents();
  }
  
  // Getters and setters for crane properties
  get rotationValue(): number {
    return this._rotationValue;
  }
  
  set rotationValue(value: number) {
    // Ensure value is within 0-360 range
    this._rotationValue = (value + 360) % 360;
    // Update scaleX based on rotation
    this.updateScaleXFromRotation();
  }
  
  get luffingValue(): number {
    return this._luffingValue;
  }
  
  set luffingValue(value: number) {
    this._luffingValue = this.clampValue(value, 0, 100);
    this.updateLuffingComponents();
  }
  
  get hookValue(): number {
    return this._hookValue;
  }
  
  set hookValue(value: number) {
    this._hookValue = this.clampValue(value, 0, 100);
    this.updateHoistingComponents();
  }
  
  get isLoaded(): boolean {
    return this._isLoaded;
  }
  
  // Computed properties for display
  get luffingAngle(): number {
    return this.lerp(40, 0, this._luffingValue / 100);
  }
  
  get currentHeight(): number {
    return this.lerp(0, 20, this._hookValue / 100); // 0-20 meters
  }
  
  // Style for the rope in the side view hoisting mechanism
  get ropeStyle() {
    const height = this.lerp(70, 200, this._hookValue / 100);
    return {
      height: `${height}px`
    };
  }
  
  // Style for the grabber in the side view hoisting mechanism
  get grabberStyle() {
    const top = this.lerp(50, 200, this._hookValue / 100);
    return {
      top: `${top}px`
    };
  }
  
  // Style for the rope in the vertical hoisting panel
  get ropeVerticalStyle() {
    const height = this.lerp(20, 250, this._hookValue / 100);
    return {
      height: `${height}px`
    };
  }
  
  // Style for the grabber in the vertical hoisting panel
  get grabberVerticalStyle() {
    const top = this.lerp(20, 250, this._hookValue / 100);
    return {
      top: `${top}px`
    };
  }
  
  // Image for the grabber based on load state
  get grabberImage(): string {
    return this._isLoaded ? 'grabber.svg' : 'opened.svg';
  }
  
  // Current scaleX value based on rotation
  get currentScaleX(): number {
    // If rotation is between 0-180, scaleX is 1, otherwise -1
    return this._rotationValue > 180 ? -1 : 1;
  }
  
  // Style for the upper-rotate div
  get upperRotateStyle(): { [key: string]: string } {
    return {
      'transform': `scaleX(${this.currentScaleX})`
    };
  }
  
  // Style for the arm based on luffing angle
  get armStyle(): { [key: string]: string } {
    return {
      'transform': `rotate(${this.luffingAngle}deg)`
    };
  }
  
  // Style for the rope-grabber container based on luffing value (position-based)
  get ropeGrabberPositionStyle(): { [key: string]: string } {
    // Calculate new left and top positions based on luffing value
    const baseLeft = 105; // Base left position in %
    const baseTop = 30;  // Base top position in %
    
    // Adjust positions based on luffing value (0-100)
    const leftAdjust = this.lerp(0, 15, this.luffingValue / 100); // Move left as luffing increases
    const topAdjust = this.lerp(0, -16, this.luffingValue / 100);  // Move down as luffing increases
    
    return {
      'left': `${baseLeft + leftAdjust}%`,
      'top': `${baseTop + topAdjust}%`
    };
  }
  
  // Methods for crane control
  rotateLeft(): void {
    this.rotationValue = (this.rotationValue - 45 + 360) % 360;
  }
  
  rotateRight(): void {
    this.rotationValue = (this.rotationValue + 45) % 360;
  }
  
  luffUp(): void {
    this.luffingValue -= 10;
  }
  
  luffDown(): void {
    this.luffingValue += 10;
  }
  
  raiseHook(): void {
    this.hookValue -= 10;
  }
  
  lowerHook(): void {
    this.hookValue += 10;
  }
  
  toggleLoad(): void {
    this._isLoaded = !this._isLoaded;
    this.addAlarm(this._isLoaded ? 'Load attached' : 'Load detached', 'info');
  }
  
  // Update methods for component synchronization
  updateLuffingComponents(): void {
    // Update arm angle based on luffing value
    this.armLuffingAngle = this.lerp(40, 0, this._luffingValue / 100);
  }
  
  updateHoistingComponents(): void {
    // Update rope height and grabber position based on hook value
    this.ropeHeight = this.lerp(50, 200, this._hookValue / 100);
    this.grabberTop = this.lerp(50, 200, this._hookValue / 100);
  }
  
  updateScaleXFromRotation(): void {
    // No need to do anything here, as currentScaleX is computed dynamically
  }
  
  // Add a new alarm to the list
  addAlarm(message: string, severity: string): void {
    const now = new Date();
    const time = now.toLocaleTimeString();
    this.alarms.unshift({ time, message, severity });
    
    // Keep only the 10 most recent alarms
    if (this.alarms.length > 10) {
      this.alarms.pop();
    }
  }
  
  // Helper methods
  private clampValue(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
  
  // Linear interpolation helper for positioning elements
  lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t;
  }
  
  // Get text representation of positions for display
  getRotationText(): string {
    return `${this.rotationValue.toFixed(1)}°`;
  }
  
  getHookHeightText(): string {
    return `${this.hookValue.toFixed(1)}%`;
  }
  
  getLuffingAngleText(): string {
    return `${this.luffingAngle.toFixed(1)}°`;
  }
  
  getLoadStateText(): string {
    return this.isLoaded ? 'ATTACHED' : 'DETACHED';
  }
  
  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString();
  }
}
