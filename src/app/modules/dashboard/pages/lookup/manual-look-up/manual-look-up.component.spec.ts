import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualLookUpComponent } from './manual-look-up.component';

describe('ManualLookUpComponent', () => {
  let component: ManualLookUpComponent;
  let fixture: ComponentFixture<ManualLookUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManualLookUpComponent]
    });
    fixture = TestBed.createComponent(ManualLookUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
