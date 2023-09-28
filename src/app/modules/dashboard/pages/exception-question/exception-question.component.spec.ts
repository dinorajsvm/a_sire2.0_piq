import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionQuestionComponent } from './exception-question.component';

describe('ExceptionQuestionComponent', () => {
  let component: ExceptionQuestionComponent;
  let fixture: ComponentFixture<ExceptionQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExceptionQuestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceptionQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
