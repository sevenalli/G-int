import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisionCranesComponent } from './supervision-cranes.component';

describe('SupervisionCranesComponent', () => {
  let component: SupervisionCranesComponent;
  let fixture: ComponentFixture<SupervisionCranesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupervisionCranesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupervisionCranesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
