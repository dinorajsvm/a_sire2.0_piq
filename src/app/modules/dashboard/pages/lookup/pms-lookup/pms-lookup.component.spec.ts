import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmsLookupComponent } from './pms-lookup.component';

describe('PmsLookupComponent', () => {
  let component: PmsLookupComponent;
  let fixture: ComponentFixture<PmsLookupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PmsLookupComponent]
    });
    fixture = TestBed.createComponent(PmsLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
