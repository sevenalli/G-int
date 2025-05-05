import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlewingComponent } from './slewing.component';

describe('SlewingComponent', () => {
  let component: SlewingComponent;
  let fixture: ComponentFixture<SlewingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlewingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlewingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
