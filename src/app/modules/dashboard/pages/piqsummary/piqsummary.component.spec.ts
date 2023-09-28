import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PIQSummaryComponent } from './piqsummary.component';

describe('PIQSummaryComponent', () => {
  let component: PIQSummaryComponent;
  let fixture: ComponentFixture<PIQSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PIQSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PIQSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
