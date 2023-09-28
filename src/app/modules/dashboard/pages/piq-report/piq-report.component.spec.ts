import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiqReportComponent } from './piq-report.component';

describe('PiqReportComponent', () => {
  let component: PiqReportComponent;
  let fixture: ComponentFixture<PiqReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PiqReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PiqReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
