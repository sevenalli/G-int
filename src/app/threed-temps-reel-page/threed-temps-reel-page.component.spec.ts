import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreedTempsReelPageComponent } from './threed-temps-reel-page.component';

describe('ThreedTempsReelPageComponent', () => {
  let component: ThreedTempsReelPageComponent;
  let fixture: ComponentFixture<ThreedTempsReelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreedTempsReelPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreedTempsReelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
