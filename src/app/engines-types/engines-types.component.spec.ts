import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnginesTypesComponent } from './engines-types.component';

describe('EnginesTypesComponent', () => {
  let component: EnginesTypesComponent;
  let fixture: ComponentFixture<EnginesTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnginesTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnginesTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
