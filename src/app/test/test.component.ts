import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MotorState {
  id: number;
  isOn: boolean;
  checkpointId: string;
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TestComponent implements OnInit {
  currentScaleX: any;
  armStyle: { [klass: string]: any; } | null | undefined;
  ropeGrabberTop: any;
  ropeHeight: any;
  ropeTopPos: any;
  ropeLeftPos: any;
  grabberTop: any;
  grabberLeftPos: any;
  grabberImage: string;
  currentDate: Date | undefined;
  engineCode: string = 'G012222';
  motors: MotorState[] = [];

  constructor() {
    this.grabberImage = 'grabber.svg';
  }

  ngOnInit() {
    // Initialize motors with their corresponding checkpoint IDs and default states
    this.motors = [
      { id: 1, isOn: true, checkpointId: 'checkpoint1' },
      { id: 2, isOn: false, checkpointId: 'checkpoint2' },
      { id: 3, isOn: true, checkpointId: 'checkpoint3' },
      { id: 4, isOn: true, checkpointId: 'checkpoint4' },
      { id: 5, isOn: false, checkpointId: 'checkpoint5' },
      { id: 6, isOn: true, checkpointId: 'checkpoint6' },
      { id: 7, isOn: true, checkpointId: 'checkpoint7' }
    ];
    
    // Update all checkpoints based on initial motor states
    this.updateAllCheckpoints();
  }

  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString();
  }

  navigateTo(engineCode: string): void {
    this.engineCode = engineCode;
  }

  toggleMotor(motorId: number): void {
    const motor = this.motors.find(m => m.id === motorId);
    if (motor) {
      motor.isOn = !motor.isOn;
      this.updateCheckpoint(motor.checkpointId, motor.isOn);
      this.currentDate = new Date();
    }
  }

  updateCheckpoint(checkpointId: string, isOn: boolean): void {
    const element = document.querySelector(`.${checkpointId}`) as HTMLElement;
    if (element) {
      if (isOn) {
        element.style.backgroundColor = '#71ff4e';
        element.style.borderColor = '#028613';
        element.style.boxShadow = '0 0 10px #028613, 0 0 20px #028613, 0 0 30px #028613';
      } else {
        element.style.backgroundColor = '#d62c2c';
        element.style.borderColor = '#921818';
        element.style.boxShadow = '0 0 10px #d62c2c, 0 0 20px #d62c2c, 0 0 30px #d62c2c';
      }
    }
  }

  updateAllCheckpoints(): void {
    this.motors.forEach(motor => {
      this.updateCheckpoint(motor.checkpointId, motor.isOn);
    });
  }

  getMotorImage(isOn: boolean): string {
    return isOn ? 'greenMotor.png' : 'redMotor.png';
  }
}
