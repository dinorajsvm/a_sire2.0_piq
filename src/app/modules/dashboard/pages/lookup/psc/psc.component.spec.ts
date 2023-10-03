import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PscComponent } from './psc.component';

describe('PscComponent', () => {
  let component: PscComponent;
  let fixture: ComponentFixture<PscComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PscComponent]
    });
    fixture = TestBed.createComponent(PscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
