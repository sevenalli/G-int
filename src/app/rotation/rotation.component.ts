import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rotation',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './rotation.component.html',
  styleUrls: ['./rotation.component.css']
})
export class RotationComponent implements OnInit {
  // The engine code from the route parameter
  engineCode: string = '';
  
  

  constructor(private route: ActivatedRoute) {}
  
  ngOnInit() {
    // Get the engineCode from route parameters
    this.route.paramMap.subscribe(params => {
      this.engineCode = params.get('engineCode') || '';
      console.log('Engine Code:', this.engineCode);
      // Here you would typically load engine-specific data
    });
  }
  // Define possible rotation angles for the crane boom (-90 to +90 degrees in 5-degree steps)
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

  // Logic to change the currentAngle based on user interaction or simulation
  // This could be extended to load engine-specific rotation data


}
