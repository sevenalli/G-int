import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-operations',
  imports: [ FormsModule ],
  templateUrl: './operations.component.html',
  styleUrl: './operations.component.css'
})
export class OperationsComponent {
   
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

  private generateScaleX(min: number, max: number, step: number): number[] {
    const scaleX: number[] = [];
    for (let x = min; x <= max; x += step) {
      scaleX.push(x);
    }
    return scaleX;
  }




  // Logic to change the currentAngle based on user interaction or simulation
  // This could be extended to load engine-specific rotation data


  get grabberImage(): string {
    return this.currentScaleX === -1 ? 'opened.svg' : 'grabber.svg';
  }

  get ropeHeight(): number {
    // 39px at scaleX -1, 139px at scaleX 1
    return 78 + ((this.currentScaleX + 1) / 2) * 270;
  }

  get grabberTop(): number {
    // 130px at scaleX -1, 230px at scaleX 1
    return 165 + ((this.currentScaleX + 1) / 2) * 270;
  }

  // Logic to change the currentAngle based on user interaction or simulation
  // This could be extended to load engine-specific rotation data


}
