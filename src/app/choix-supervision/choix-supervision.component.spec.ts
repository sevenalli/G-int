import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoixSupervisionComponent } from './choix-supervision.component';

describe('ChoixSupervisionComponent', () => {
  let component: ChoixSupervisionComponent;
  let fixture: ComponentFixture<ChoixSupervisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoixSupervisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoixSupervisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
