import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateRepositoryComponent } from './certificate-repository.component';

describe('CertificateRepositoryComponent', () => {
  let component: CertificateRepositoryComponent;
  let fixture: ComponentFixture<CertificateRepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificateRepositoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
