import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hoisting',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './hoisting.component.html',
  styleUrl: './hoisting.component.css'
})
export class HoistingComponent implements OnInit {
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
  // Hoisting control properties
  hoistingValue = 50;
  minHeight = 0;
  maxHeight = 20; // 20 meters
  
  // Rope and grabber properties
  ropeHeight = 100;
  grabberPosition = 50;
  isLoaded = false;
  
  // Get the appropriate grabber image based on loaded state
  get grabberImage(): string {
    return this.isLoaded ? 'opened.svg' : 'grabber.svg';
  }
  
  // Toggle load state
  toggleLoad(): void {
    this.isLoaded = !this.isLoaded;
  }
  
  // Grid properties
  gridMarkers = Array.from({ length: 21 }, (_, i) => i); // 0 to 20 meters
  
  // Computed properties
  get currentHeight(): number {
    return this.lerp(this.minHeight, this.maxHeight, this.hoistingValue / 100);
  }
  
  get ropeStyle() {
    const height = this.lerp(50, 400, this.hoistingValue / 100);
    return {
      height: `${height}px`
    };
  }
  
  get grabberStyle() {
    const top = this.lerp(50, 400, this.hoistingValue / 100);
    return {
      top: `${top}px`
    };
  }
  
  // Helper function for linear interpolation
  lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t;
  }
  
  // Return to operations page
  returnToOperations() {
    // Navigation handled by routerLink in template
  }
}
