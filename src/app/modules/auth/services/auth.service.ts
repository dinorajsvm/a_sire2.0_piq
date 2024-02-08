import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiMethod } from 'src/app/core/constants';
import { Endpoints } from 'src/app/core/mgntDBconstants';
import { HttpService } from 'src/app/core/services/http/http.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private _http: HttpService,
    private _storageService: StorageService,
    private _router: Router
  ) {}

  login(loginPayload: any, errorResponseCallback: any): void {
    loginPayload.projectType = environment.projectType;
    this._http
      .requestCall(
        Endpoints.LOGIN,
        ApiMethod.POST,
        loginPayload,
        environment.authUrl
      )
      .subscribe(
        (res: any) => {
          this._storageService.setAccessToken(res.result.accessToken);
          this._storageService.setUserDetails(
            JSON.stringify(res.result.userInfo)
          );
          // this.getUserRole((roleDetails: any) => {
          //   this._storageService.setRoleCode(roleDetails.result.roleCode);
          //   this.redirect();
          // });
          this.redirect();
        },
        (error: any) => {
          errorResponseCallback();
        }
      );
  }

  logout() {
    let accessToken = this._storageService.getAccessToken();
    this._http
      .requestCall(
        Endpoints.LOGOUT,
        ApiMethod.POST,
        { accessToken: accessToken },
        environment.authUrl
      )
      .subscribe((res: any) => {
        this._storageService.clearStorageRedirect();
      });
  }

  validateToken(token: string, successCallback: any) {
    let validateTokenEndpoint: any = Endpoints['VALIDATE_TOKEN'] + token;
    this._http
      .requestCall(
        validateTokenEndpoint,
        ApiMethod.GET,
        {},
        environment.authUrl
      )
      .subscribe((res: any) => {
        successCallback(res);
      });
  }


  
  // generatetoken
  piqLogin(payload: any) {
    return this._http.requestCall(
      Endpoints.VALIDATE_TOKEN,
      ApiMethod.POST,
      payload,
      environment.apiUrl
    );
  }

  getUserProfile(successCallback: any) {
    this._http
      .requestCall(
        Endpoints.USER_PROFILE,
        ApiMethod.GET_WITH_HEADER,
        {},
        environment.authUrl
      )
      .subscribe((res: any) => {
        successCallback(res);
      });
  }

  getUserRole(successCallback: any) {
    this._http
      .requestCall(Endpoints.ROLE_IDENTITY, ApiMethod.GET)
      .subscribe((res: any) => {
        successCallback(res);
      });
  }

  redirect() {
    this._router.navigate(['sire']);
  }

  isLoggedIn() {
    return !!this._storageService.getAccessToken();
  }
}
