import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReuseConfirmationDialogComponent } from './reuse-confirmation-dialog.component';

describe('ReuseConfirmationDialogComponent', () => {
  let component: ReuseConfirmationDialogComponent;
  let fixture: ComponentFixture<ReuseConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReuseConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReuseConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
