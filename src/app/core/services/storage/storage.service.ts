import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Roles } from '../../mgntDBconstants';
import { AppService } from 'src/app/modules/dashboard/services/app.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private _router: Router, private appServices: AppService) {}

  setMackToken(accessToken: string) {
    localStorage.setItem('mackToken', accessToken);
  }
  getMackToken(): string {
    return localStorage.getItem('mackToken')!;
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('accessToken', accessToken);
  }
  getAccessToken(): string {
    return localStorage.getItem('accessToken')!;
  }

  setRefereshToken(accessToken: string) {
    localStorage.setItem('refreshToken', accessToken);
  }
  getRefereshToken(): string {
    return localStorage.getItem('refreshToken')!;
  }
  setRoleCode(roleCode: string) {
    localStorage.setItem('roleCode', roleCode);
  }
  getRoleCode(): string {
    return localStorage.getItem('roleCode')!;
  }
  setUserDetails(userDetails: any) {
    localStorage.setItem('user', userDetails);
  }
  getUserDetails() {
    return JSON.parse(localStorage.getItem('user')!);
  }
  getProjectType() {
    let userDetails = this.getUserDetails();
    return userDetails?.cntrlType;
  }
  redirectBasedonRoles(userDetails: any) {
    if (userDetails?.cntrlType === Roles.SHORE) {
      this._router.navigate(['sire']);
    } else if (userDetails?.cntrlType === Roles.SHIP) {
      this._router.navigate(['sire']);
    } else {
      
      this.appServices.destroyPage();
    }
  }

  checkUserDetails() {
    if (localStorage.getItem('user') === null) {
      return false;
    }
    return true;
  }
}
