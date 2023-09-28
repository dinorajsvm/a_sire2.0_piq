import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService = jasmine.createSpyObj('AuthService', [ 'login' ]);

  const formBuilder: FormBuilder = new FormBuilder();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: FormBuilder, useValue: formBuilder },
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ],
    })
    .compileComponents();
    mockAuthService = TestBed.get(AuthService);
    mockAuthService.login.and.returnValue({
      result: {
        accessToken: 'test-access-token',
        userInfo: 'ship-user',
        roleCode: 'admin'
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('should handle submit', () => {
    component.onSubmit();
    expect(component.loginForm.value.username).toBe('');
    expect(component.loginForm.value.password).toBe('');
  })
});
