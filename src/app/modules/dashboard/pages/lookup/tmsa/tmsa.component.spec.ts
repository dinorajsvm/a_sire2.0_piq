import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TMSAComponent } from './tmsa.component';

describe('TMSAComponent', () => {
  let component: TMSAComponent;
  let fixture: ComponentFixture<TMSAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TMSAComponent]
    });
    fixture = TestBed.createComponent(TMSAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
