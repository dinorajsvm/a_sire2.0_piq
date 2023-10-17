import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyManagementComponent } from './safety-management.component';

describe('SafetyManagementComponent', () => {
  let component: SafetyManagementComponent;
  let fixture: ComponentFixture<SafetyManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SafetyManagementComponent]
    });
    fixture = TestBed.createComponent(SafetyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
