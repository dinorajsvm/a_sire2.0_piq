import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularMaterialModule } from '../../../core/modules/material/angular-material.module';
import { AdvancedSearchService } from './advanced-search.service';
import { AuthComponent } from '../../auth/auth.component';

describe('AdvancedSearchService', () => {
  let service: AdvancedSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'auth', component: AuthComponent }
        ]),
        HttpClientTestingModule,
        AngularMaterialModule
      ]
    });
    service = TestBed.inject(AdvancedSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
