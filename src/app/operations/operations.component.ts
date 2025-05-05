import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';



@Component({
  selector: 'app-operations',
  imports: [ CommonModule, FormsModule , RouterLink,
    RouterLinkActive],
  templateUrl: './operations.component.html',
  styleUrl: './operations.component.css'
})
export class OperationsComponent {
   
  // Unified Luffing Control (0 = initial position, 100 = final position)
  unifiedLuffingValue: number = 0;
  
  // Hoisting Control (0 = fully raised, 100 = fully lowered)
  hoistingValue: number = 0;
  
  // Unified Rotation Control (0 = initial position, 100 = final position)
  unifiedRotationValue: number = 0;
  
  // Luffing Angle (e.g., 0 = high, 75 = low)
  // These will be calculated based on unifiedLuffingValue
  armLuffingAngle: number = 40; 
  armLuffingTop: number = 39;
  
  flecheLuffingAngle: number = 10; 
  flecheLuffingLeft: number = 165; 
  flecheLuffingTop: number = 55; 
  grabberTopPos: number = 75; // Initial position
  ropeLeftPos: number = 332;
  grabberLeftPos: number = 75;
  ropeTopPos: number = 167; // Initial position
  baseRopeHeight: number = 39; // Initial height
  ropeGrabbertop: number = -9;



  possibleAngles: number[] = this.generateAngles(-360, 360, 5);
  
  // Initial and final angles for rotation
  initialAngle = 285;
  finalAngle = 90;
  
  // Private property for angle index
  private _currentAngleIndex: number = this.possibleAngles.findIndex(angle => angle === this.initialAngle);

  // Getter for the current angle based on unified rotation value
  get currentAngle(): number {
    // Calculate angle based on unified rotation value
    return Math.round(this.lerp(this.initialAngle, this.finalAngle, this.unifiedRotationValue / 100));
  }
  
  // Getter for angle index
  get currentAngleIndex(): number {
    return this._currentAngleIndex;
  }
  
  // Setter for the angle index - updates the unified rotation value
  set currentAngleIndex(index: number) {
    this._currentAngleIndex = index;
    const angle = this.possibleAngles[index];
    // Calculate progress between initial and final angles
    const progress = this.calculateProgress(this.initialAngle, this.finalAngle, angle);
    this.unifiedRotation = progress * 100;
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




  // Logic to change the currentAngle based on user interaction or simulation
  // This could be extended to load engine-specific rotation data


  get grabberImage(): string {
    return this.currentScaleX === -1 ? 'opened.svg' : 'grabber.svg';
  }

  get ropeHeight(): number {
    // Height based on hoisting value (0 = minimum height, 100 = maximum height)
    return this.baseRopeHeight + (this.hoistingValue / 100) * 200;
  }

  get grabberTop(): number {
    // Base position + offset from luffing + offset from hoisting
    const luffingOffset = this.grabberTopPos;
    const hoistingOffset = (this.hoistingValue / 100) * 200;
    return 130 + luffingOffset + hoistingOffset;
  }
  

  // --- Luffing Styles ---

  get flecheLuffingStyle(): { [key: string]: string } {
    // Assuming 0 degrees is the base position in the SVG
    const rotate = this.flecheLuffingAngle;
    const left = this.flecheLuffingLeft;
    const top = this.flecheLuffingTop;

    return {
      'transform': `rotate(${rotate}deg)`,
      'left': `${left}px`,
      'top': `${top}px`

    };
  }

  get armLuffingStyle(): { [key: string]: string } {
    const rotate = this.armLuffingAngle;
    return {
      'transform': `rotate(${rotate}deg)`
    };
  }

  get ropeGrabberStyle(): { [key: string]: string } {
    return {
      'left': `${this.grabberLeftPos}px`,
      'transform': `translateY(${this.grabberTopPos}px)`
    };
  }

  // Update all luffing components based on unified value
  updateLuffingComponents(): void {
    const progress = this.unifiedLuffingValue / 100; // 0 to 1 transition value
    
    // Linear interpolation between initial and final states
    // Initial: arm 0deg, flech 0deg, flech-left 65px, grabber-left 0px
    // Final: arm -5deg, flech 22deg, flech-left 55px, grabber-left -30px
    
    this.armLuffingAngle = this.lerp(40, 0, progress);
    this.flecheLuffingAngle = this.lerp(10, 5, progress);
    this.flecheLuffingLeft = this.lerp(165, 65, progress);
    this.grabberLeftPos = this.lerp(75, -24, progress);  
    this.grabberTopPos = this.lerp(75, -10, progress); 
    this.ropeLeftPos = this.lerp(332, 235, progress); 
    this.ropeGrabbertop = this.lerp(-9, 20, progress);
    this.ropeTopPos = this.lerp(167, 80, progress);
    this.flecheLuffingTop = this.lerp(55,0,progress);
   
    
  }
  
  // Update rope and grabber position based on hoisting value
  updateHoistingComponents(): void {
    // Hoisting doesn't need to update any values here
    // Calculations are handled in the getters for ropeHeight and grabberTop
    // This method exists for potential future enhancements
  }
  
  // Set hoisting value and update components
  set hoisting(value: number) {
    this.hoistingValue = value;
    this.updateHoistingComponents();
  }
  
  get hoisting(): number {
    return this.hoistingValue;
  }
  
  // Linear interpolation helper
  private lerp(start: number, end: number, progress: number): number {
    return start + (end - start) * progress;
  }
  
  // Set unified luffing value and update all components
  set unifiedLuffing(value: number) {
    this.unifiedLuffingValue = value;
    this.updateLuffingComponents();
  }
  
  get unifiedLuffing(): number {
    return this.unifiedLuffingValue;
  }
  
  // Set unified rotation value and update both angle and scaleX
  set unifiedRotation(value: number) {
    this.unifiedRotationValue = value;
    // No need to call any update methods as the getters handle the calculations
  }
  
  get unifiedRotation(): number {
    return this.unifiedRotationValue;
  }
  
  // Helper function to calculate progress between start and end values
  private calculateProgress(start: number, end: number, current: number): number {
    return Math.max(0, Math.min(1, (current - start) / (end - start)));
  }


}
