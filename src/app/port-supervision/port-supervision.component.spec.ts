import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortSupervisionComponent } from './port-supervision.component';

describe('PortSupervisionComponent', () => {
  let component: PortSupervisionComponent;
  let fixture: ComponentFixture<PortSupervisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortSupervisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortSupervisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
