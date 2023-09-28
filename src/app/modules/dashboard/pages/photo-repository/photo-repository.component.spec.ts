import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoRepositoryComponent } from './photo-repository.component';

describe('PhotoRepositoryComponent', () => {
  let component: PhotoRepositoryComponent;
  let fixture: ComponentFixture<PhotoRepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhotoRepositoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
