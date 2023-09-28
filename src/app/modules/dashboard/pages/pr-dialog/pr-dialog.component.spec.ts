import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrDialogComponent } from './pr-dialog.component';

describe('PrDialogComponent', () => {
  let component: PrDialogComponent;
  let fixture: ComponentFixture<PrDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
