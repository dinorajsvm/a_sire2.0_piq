import { TestBed, getTestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularMaterialModule } from 'src/app/core/modules/material/angular-material.module';

describe('AuthGuard', () => {
  let injector: TestBed;
  let guard: AuthGuard;
  let routerMock = {navigate: jasmine.createSpy('navigate'), getCurrentNavigation: jasmine.createSpy('getCurrentNavigation')}
  let routeMock: any = { snapshot: {}};
  let mockAuthService = jasmine.createSpyObj('AuthService', [ 'isLoggedIn' ]);

  beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [ AuthGuard,
      { provide: Router, useValue: routerMock },
      {
        provide: AuthService,
        useValue: mockAuthService
      }],
    imports: [HttpClientTestingModule, AngularMaterialModule]
  });
  injector = getTestBed();
  mockAuthService = TestBed.get(AuthService);
  guard = injector.get(AuthGuard);
});

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect an unauthenticated user to the login route', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    expect(guard.canLoad(routeMock, [])).toEqual(true);
  });

  it('should allow the authenticated user to access app', () => {
    mockAuthService.isLoggedIn.and.returnValue(false);
    expect(guard.canLoad(routeMock, [])).toEqual(false);
  });
});
