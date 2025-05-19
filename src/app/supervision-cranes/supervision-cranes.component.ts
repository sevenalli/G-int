import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-supervision-cranes',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './supervision-cranes.component.html',
  styleUrl: './supervision-cranes.component.css'
})
export class SupervisionCranesComponent implements OnInit {
  private _rotationValue: number = 280;
  private _jibExtension: number = 100;
  private _trolleyValue: number = 0;
  private _hookValue: number = 0;
  private _luffingValue: number = 0;
  private _isLoaded: boolean = true;
  // Unified Rotation Control (0 = initial position, 100 = final position)
  unifiedRotationValue: number = 0;
  // Flag to prevent infinite update loops between rotation and unified rotation
  private _updatingFromRotation: boolean = false;
  
  // Luffing and hoisting properties
  armLuffingAngle: number = 40;
  flecheLuffingAngle: number = 10;
  flecheLuffingLeft: number = 100;
  flecheLuffingTop: number = 5;
  grabberTopPos: number = 75;
  ropeLeftPos: number = 332;
  grabberLeftPos: number = 175;
  ropeTopPos: number = 167;
  baseRopeHeight: number = 39;
  ropeGrabberTop: number = -9;
  
  // Hoisting grid properties
  minHeight: number = 0;
  maxHeight: number = 20; // 20 meters
  gridMarkers = Array.from({ length: 21 }, (_, i) => i); // 0 to 20 meters
  engineCode: string = '';
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {  
    // Get the engineCode from route parameters
    this.route.paramMap.subscribe(params => {
      this.engineCode = params.get('engineCode') || '';
      console.log('Engine Code:', this.engineCode);
      // Here you would typically load engine-specific data
    });
    
    // Initialize the component
    this.updateLuffingComponents();
  }
  
  
  // Getters and setters for crane properties
  get rotationValue(): number {
    // Calculate rotation based on unified rotation value
    return Math.round(this.lerp(this.initialRotation, this.finalRotation, this.unifiedRotationValue / 100)) % 360;
  }
  
  set rotationValue(value: number) {
    // Ensure value is within 0-360 range
    value = (value + 360) % 360;
    this._rotationValue = value;
    
    // Calculate progress between initial and final rotation
    const progress = this.calculateProgress(this.initialRotation, this.finalRotation, value);
    
    // Update unified rotation value
    this.unifiedRotation = progress * 100;
  }
  
  possibleAngles: number[] = this.generateAngles(-360, 360, 5);
  
  // Initial and final angles for rotation
  initialRotation = 280;
  finalRotation = 100;
  
  // Getter for the current angle based on unified rotation value
  get currentAngle(): number {
    // Calculate angle based on unified rotation value
    return Math.round(this.lerp(this.initialRotation, this.finalRotation, this.unifiedRotationValue / 100));
  }
  set unifiedRotation(value: number) {
    this.unifiedRotationValue = value;
    // The getters handle calculations for rotation and scaleX
  }
  
  get unifiedRotation(): number {
    return this.unifiedRotationValue;
  }
  

  // Helper function to generate the angle array
  private generateAngles(min: number, max: number, step: number): number[] {
    const angles = [];
    for (let angle = min; angle <= max; angle += step) {
      angles.push(angle);
    }
    return angles;
  }
  possibleScaleX: number[] = this.generateScaleX(-1, 1, 0.1);

  // Initial and final scaleX values
  initialScaleX = 1;
  finalScaleX = -1;
  
  // Private property for scaleX index
  private _currentScaleXIndex: number = this.possibleScaleX.findIndex(scale => scale === this.initialScaleX);

  // Getter for the current scaleX based on unified rotation value
  get currentScaleX(): number {
    // Calculate scaleX based on unified rotation value
    return Number(this.lerp(this.initialScaleX, this.finalScaleX, this.unifiedRotationValue / 100).toFixed(1));
  }
  
  // Getter for scaleX index
  get currentScaleXIndex(): number {
    return this._currentScaleXIndex;
  }
  
  // Setter for the scaleX index - updates the unified rotation value
  set currentScaleXIndex(index: number) {
    this._currentScaleXIndex = index;
    const scale = this.possibleScaleX[index];
    // Calculate progress between initial and final scaleX
    const progress = this.calculateProgress(this.initialScaleX, this.finalScaleX, scale);
    this.unifiedRotation = progress * 100;
  }

  // Helper function to generate the scaleX array
  private generateScaleX(min: number, max: number, step: number): number[] {
    const scaleX: number[] = [];
    for (let x = min; x <= max; x += step) {
      // Fix potential floating point inaccuracies
      scaleX.push(Math.round(x * 10) / 10); 

    }

    return scaleX;
  }
  
  get jibExtension(): number {
    return this._jibExtension;
  }
  
  set jibExtension(value: number) {
    this._jibExtension = this.clampValue(value, 20, 100);
  }
  
  get trolleyValue(): number {
    return this._trolleyValue;
  }
  
  set trolleyValue(value: number) {
    // Trolley position depends on jib extension
    const maxTrolley = this._jibExtension;
    this._trolleyValue = this.clampValue(value, 0, maxTrolley);
  }
  
  get hookValue(): number {
    return this._hookValue;
  }
  
  set hookValue(value: number) {
    this._hookValue = this.clampValue(value, 0, 100);
    this.updateHoistingComponents();
  }
  
  get luffingValue(): number {
    return this._luffingValue;
  }
  
  set luffingValue(value: number) {
    this._luffingValue = this.clampValue(value, 0, 100);
    this.updateLuffingComponents();
  }
  
  get isLoaded(): boolean {
    return this._isLoaded;
  }
  
  // Computed properties for display
  get luffingAngle(): number {
    return this.lerp(40, 0, this._luffingValue / 100);
  }
  
  get ropeHeight(): number {
    // Height based on hoisting value (0 = minimum height, 100 = maximum height)
    return this.baseRopeHeight + (this._hookValue / 100) * 200;
  }
  
  // Current height in meters based on hook value
  get currentHeight(): number {
    return this.lerp(this.minHeight, this.maxHeight, this._hookValue / 100);
  }
  
  // Style for the rope in the hoisting mechanism
  get ropeStyle() {
    const height = this.lerp(50, 400, this._hookValue / 100);
    return {
      height: `${height}px`
    };
  }
  
  // Style for the grabber in the hoisting mechanism
  get grabberStyle() {
    const top = this.lerp(50, 400, this._hookValue / 100);
    return {
      top: `${top}px`
    };
  }
  
  // Image for the grabber based on load state
  get grabberImage(): string {
    return this._isLoaded ? 'grabber.svg' : 'opened.svg';
  }
  
  get grabberTop(): number {
    // Base position + offset from luffing + offset from hoisting
    const luffingOffset = this.grabberTopPos;
    const hoistingOffset = (this._hookValue / 100) * 200;
    return 130 + luffingOffset + hoistingOffset;
  }
  
  // Style objects for crane components
  get flecheStyle(): { [key: string]: string } {
    const rotate = this.flecheLuffingAngle;
    const left = this.flecheLuffingLeft;
    const top = this.flecheLuffingTop;
    
    return {
      'transform': `rotate(${rotate}deg)`,
      'left': `${left}px`,
      'top': `${top}px`
    };
  }
  
  get armStyle(): { [key: string]: string } {
    const rotate = this.armLuffingAngle;
    return {
      'transform': `rotate(${rotate}deg)`
    };
  }
  
  // Methods for crane control
  rotateLeft(): void {
    // Rotate counterclockwise by 10 degrees
    this.rotationValue = (this.rotationValue - 180 + 360) % 360;
    
  }
  
  rotateRight(): void {
    // Rotate clockwise by 10 degrees
    this.rotationValue = (this.rotationValue + 180) % 360;
   
  }
  

  
  // Helper function to calculate progress between start and end values
  private calculateProgress(start: number, end: number, current: number): number {
    // Handle the case where the rotation crosses the 0/360 boundary
    if (start > end) {
      // For example, going from 280 to 100 degrees
      if (current >= start || current <= end) {
        // We're in the valid range
        if (current >= start) {
          // Between start and 360
          return (current - start) / ((360 - start) + end);
        } else {
          // Between 0 and end
          return ((360 - start) + current) / ((360 - start) + end);
        }
      } else {
        // Outside the range, clamp to 0 or 1
        if (this.getShortestRotationDistance(current, start) < 
            this.getShortestRotationDistance(current, end)) {
          return 0; // Closer to start
        } else {
          return 1; // Closer to end
        }
      }
    } else {
      // Normal case (e.g., 100 to 280)
      return Math.max(0, Math.min(1, (current - start) / (end - start)));
    }
  }
  
  extendJib(): void {
    this.jibExtension += 5;
    // If trolley is beyond new jib extension, adjust it
    if (this.trolleyValue > this.jibExtension) {
      this.trolleyValue = this.jibExtension;
    }
  }
  
  retractJib(): void {
    this.jibExtension -= 5;
    // If trolley is beyond new jib extension, adjust it
    if (this.trolleyValue > this.jibExtension) {
      this.trolleyValue = this.jibExtension;
    }
  }
  
  moveTrolleyIn(): void {
    this.trolleyValue -= 5;
  }
  
  moveTrolleyOut(): void {
    this.trolleyValue += 5;
  }
  
  raiseHook(): void {
    this.hookValue -= 5;
  }
  
  lowerHook(): void {
    this.hookValue += 5;
  }
  
  luffUp(): void {
    this.luffingValue -= 5;
  }
  
  luffDown(): void {
    this.luffingValue += 5;
  }
  
  toggleLoad(): void {
    this._isLoaded = !this._isLoaded;
    console.log('Load status toggled:', this._isLoaded ? 'ATTACHED' : 'DETACHED');
  }
  
  // Update methods for component synchronization
  updateLuffingComponents(): void {
    const progress = this._luffingValue / 100; // 0 to 1 transition value
    
    // Linear interpolation between initial and final states
    this.armLuffingAngle = this.lerp(40, 0, progress);
    this.flecheLuffingAngle = this.lerp(10, 5, progress);
    this.flecheLuffingLeft = this.lerp(215, 130, progress);
    this.grabberLeftPos = this.lerp(50, -32, progress);  
    this.grabberTopPos = this.lerp(35, -45, progress); 
    this.ropeLeftPos = this.lerp(306, 225, progress); 
    this.ropeGrabberTop = this.lerp(-9, 20, progress);
    this.ropeTopPos = this.lerp(132, 50, progress);
    this.flecheLuffingTop = this.lerp(50, 0, progress);
  }
  
  updateHoistingComponents(): void {
    // Calculations are handled in the getters for ropeHeight and grabberTop
    // This method exists for potential future enhancements
  }
  
  // Helper methods
  private clampValue(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
  
  // Helper method to get the shortest rotation distance between two angles
  private getShortestRotationDistance(from: number, to: number): number {
    const diff = (to - from + 360) % 360;
    return diff > 180 ? 360 - diff : diff;
  }
  
  // Linear interpolation helper for positioning elements
  lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t;
  }
  
  // Get text representation of positions for display
  getRotationText(): string {
    return `${this.rotationValue.toFixed(1)}°`;
  }
  
  getJibExtensionText(): string {
    return `${this.jibExtension.toFixed(1)}%`;
  }
  
  getTrolleyPositionText(): string {
    return `${this.trolleyValue.toFixed(1)}%`;
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
}
