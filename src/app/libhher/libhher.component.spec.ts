import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibhherComponent } from './libhher.component';

describe('LibhherComponent', () => {
  let component: LibhherComponent;
  let fixture: ComponentFixture<LibhherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibhherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibhherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
