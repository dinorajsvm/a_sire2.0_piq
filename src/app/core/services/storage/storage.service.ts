import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Roles } from '../../mgntDBconstants';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private _router: Router) {}

  getApiUrl() {
    // let userDetails = this.getUserDetails();
    //return userDetails.cntrlType === Roles.SHORE ? ApiUrl.SHORE : ApiUrl.SHIP;
  }
  setAccessToken(accessToken: string) {
    localStorage.setItem('accessToken', accessToken);
  }
  getAccessToken(): string {
    return localStorage.getItem('accessToken')!;
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
    // if (localStorage.getItem('user') === null) {
    //   this.clearStorageRedirect();
    // }
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
      this.clearStorageRedirect();
    }
  }
  clearStorageRedirect() {
    this.deleteToken();
    window.close();
    this._router.navigate(['auth']);
  }

  deleteToken(): void {
    localStorage.clear();
  }

  checkUserDetails() {
    if (localStorage.getItem('user') === null) {
      return false;
    }
    return true;
  }
}
