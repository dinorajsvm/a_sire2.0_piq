import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AngularMaterialModule } from 'src/app/core/modules/material/angular-material.module';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
// import { ApiUrl } from 'src/app/core/constants';

describe('Auth service', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(
          [
            {
              path: 'auth',
              loadChildren: () => import('../auth.module').then(m=> m.AuthModule)
            },
            // {
            //   path: 'cmb',
            //   loadChildren: () => import('../../cmb/cmb.module').then(m=> m.CmbModule)
            // }
        ]
        ),
        AngularMaterialModule
      ],
      providers: [ { provide: Router, useValue: mockRouter} ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // to make sure that there are no outstanding requests.
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle login', () => {
    const status = service.isLoggedIn();
    expect(status).toBeFalsy();
  });

  it('should get User Role', async () => {
    const dummyData = { role: 'admin' };
    service.getUserRole((response: any) => {
      expect(response.role).toBe('admin');
    });
    const req = httpMock.expectOne(`${environment.apiUrl}/identity/role`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should get User Profile', async () => {
    const dummyData = { role: 'admin' };
    service.getUserProfile((response: any) => {
      expect(response.role).toBe('admin');
    });
    const req = httpMock.expectOne(`${environment.authUrl}/user/profile`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should logout', async () => {
    const dummyData = { role: 'admin' };
    service.logout();
    const req = httpMock.expectOne(`${environment.authUrl}/logout`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyData);
  });

  it('should validate Token', async () => {
    const dummyData = { valid: true };
    service.validateToken('mock-token', (response: any) => {
      expect(response.valid).toBeTruthy();
    });
    const req = httpMock.expectOne(`${environment.authUrl}/validate/token/mock-token`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should validate login', async () => {
    const dummyData = {
      accessToken: 'test-access-token',
      userInfo: 'ship-user',
      roleCode: 'admin'
    };
    const payload = {
      userName: 'TTT100',
      password: 'password'
    }
    service.login(payload, (response: any) => {
      expect(response.accessToken).toBe('test-access-token');
    });
    const req = httpMock.expectOne(`${environment.authUrl}/user/login`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyData);
  });

  it('should handle redirect', () => {
    service.redirect();
    expect (mockRouter.navigate).toHaveBeenCalled();
  });

});
