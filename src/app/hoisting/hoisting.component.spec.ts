import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoistingComponent } from './hoisting.component';

describe('HoistingComponent', () => {
  let component: HoistingComponent;
  let fixture: ComponentFixture<HoistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoistingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
