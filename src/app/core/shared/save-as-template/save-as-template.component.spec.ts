import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveAsTemplateComponent } from './save-as-template.component';

describe('SaveAsTemplateComponent', () => {
  let component: SaveAsTemplateComponent;
  let fixture: ComponentFixture<SaveAsTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveAsTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveAsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
