import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-slewing',
  templateUrl: './slewing.component.html',
  styleUrls: ['./slewing.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class SlewingComponent implements OnInit {
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
  // Rope and grabber properties
  ropeGrabbertop = 150;
  ropeHeight = 100;
  ropeTopPos = 92;
  ropeLeftPos = 240;
  grabberTop = 130;
  grabberLeftPos = 235;
  grabberImage = 'grabber.svg';
  
  // Luffing extension control (0-100%)
  luffingExtension = 50;
  minArmWidth = 360;
  maxArmWidth = 160;
  
  // Unified luffing control (0-100%)
  unifiedLuffing = 50;
  
  // Unified rotation control (0-100%)
  unifiedRotationValue = 50;
  initialAngle = 0;
  finalAngle = 360;
  initialScaleX = 1;
  finalScaleX = -1;
  
  // Computed styles for arm and fleche
  get flecheLuffingStyle() {
    return {
      transform: `rotate(${this.currentLuffingAngle}deg)`
    };
  }
  
  get armLuffingStyle() {
    return {
      transform: `rotate(${this.currentLuffingAngle}deg)`
    };
  }
  
  // Computed current values based on unified controls
  get currentLuffingAngle(): number {
    return Math.round(this.lerp(0, 45, this.unifiedLuffing / 100));
  }
  
  // Computed arm height based on luffing extension percentage
  get currentArmHeight(): number {
    // Map the luffing extension (0-100%) to a height range (150-450px)
    return 160 + (this.luffingExtension / 100) * 300;
  }
  
  get currentAngle(): number {
    return Math.round(this.lerp(this.initialAngle, this.finalAngle, this.unifiedRotationValue / 100));
  }
  
  get currentScaleX(): number {
    return this.lerp(this.initialScaleX, this.finalScaleX, this.unifiedRotationValue / 100);
  }
  
  // Unified rotation control getter/setter
  get unifiedRotation(): number {
    return this.unifiedRotationValue;
  }
  
  set unifiedRotation(value: number) {
    this.unifiedRotationValue = value;
  }
  
  // Linear interpolation helper function
  lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t;
  }
  
  // Return to operations page
  returnToOperations() {
    // Navigation handled by routerLink in template
  }
}
