import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageConfirmationDialogComponent } from './image-confirmation-dialog.component';

describe('ImageConfirmationDialogComponent', () => {
  let component: ImageConfirmationDialogComponent;
  let fixture: ComponentFixture<ImageConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
