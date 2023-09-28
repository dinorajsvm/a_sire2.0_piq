import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectIdDialogComponent } from './select-id-dialog.component';

describe('SelectIdDialogComponent', () => {
  let component: SelectIdDialogComponent;
  let fixture: ComponentFixture<SelectIdDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectIdDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectIdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
