import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PIQLandingPageComponent } from './piq-landing-page.component';

describe('PIQLandingPageComponent', () => {
  let component: PIQLandingPageComponent;
  let fixture: ComponentFixture<PIQLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PIQLandingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PIQLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
