import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselSelectionDialogComponent } from './vessel-selection-dialog.component';

describe('VesselSelectionDialogComponent', () => {
  let component: VesselSelectionDialogComponent;
  let fixture: ComponentFixture<VesselSelectionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VesselSelectionDialogComponent]
    });
    fixture = TestBed.createComponent(VesselSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
