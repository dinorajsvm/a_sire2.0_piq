import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameConfirmationDialogComponent } from './name-confirmation-dialog.component';

describe('NameConfirmationDialogComponent', () => {
  let component: NameConfirmationDialogComponent;
  let fixture: ComponentFixture<NameConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NameConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NameConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
