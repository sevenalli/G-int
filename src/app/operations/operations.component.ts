import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-operations',
  imports: [ CommonModule, FormsModule ],
  templateUrl: './operations.component.html',
  styleUrl: './operations.component.css'
})
export class OperationsComponent {
   
  // Unified Luffing Control (0 = initial position, 100 = final position)
  unifiedLuffingValue: number = 0;
  
  // Hoisting Control (0 = fully raised, 100 = fully lowered)
  hoistingValue: number = 0;
  
  // Luffing Angle (e.g., 0 = high, 75 = low)
  // These will be calculated based on unifiedLuffingValue
  armLuffingAngle: number = 9; 
  flecheLuffingAngle: number = -23; 
  flecheLuffingLeft: number = 95; 
  grabberTopPos: number = -5; // Initial position
  ropeLeftPos: number = 287;
  grabberLeftPos: number = 30;
  ropeTopPos: number = 87; // Initial position
  baseRopeHeight: number = 39; // Initial height
  ropeGrabbertop: number = -9;



  possibleAngles: number[] = this.generateAngles(-360, 360, 5);
  
  // Index for the current angle in the possibleAngles array
  // Find the index corresponding to 30 degrees
  initialAngle = 70;
  currentAngleIndex: number = this.possibleAngles.findIndex(angle => angle === this.initialAngle);

  // Getter for the current angle based on the index
  get currentAngle(): number {
    // Handle case where initial angle wasn't found exactly (shouldn't happen with steps of 5)
    const index = this.currentAngleIndex >= 0 ? this.currentAngleIndex : 0; 

    return this.possibleAngles[index];
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

  initialScaleX = 1;

  currentScaleXIndex: number = this.possibleScaleX.findIndex(scale => scale === this.initialScaleX);

  // Getter for the current angle based on the index
  get currentScaleX(): number {
    // Handle case where initial angle wasn't found exactly (shouldn't happen with steps of 5)
    const index = this.currentScaleXIndex >= 0 ? this.currentScaleXIndex : 0; 

    return this.possibleScaleX[index];
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
    return {
      'transform': `rotate(${rotate}deg)`,
      'left': `${left}px`
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
    
    this.armLuffingAngle = this.lerp(5, -5, progress);
    this.flecheLuffingAngle = this.lerp(-23, 22, progress);
    this.flecheLuffingLeft = this.lerp(95, 55, progress);
    this.grabberLeftPos = this.lerp(30, -49, progress);  
    this.grabberTopPos = this.lerp(-5, -7, progress); 
    this.ropeLeftPos = this.lerp(287, 210, progress); 
    this.ropeGrabbertop = this.lerp(-9, 20, progress);
   
    
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


}
