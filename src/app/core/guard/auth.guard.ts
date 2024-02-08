import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LayoutService } from 'src/app/layout/services/layout.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { colorCodes } from '../constants';
import { SnackbarService } from '../services/snackbar/snackbar.service';
import { StorageService } from '../services/storage/storage.service';
import { BudgetService } from 'src/app/modules/dashboard/services/budget.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  public mackToken: any;
  public referenceNo: any;
  constructor(
    private _authService: AuthService,
    private _storage: StorageService,
    private _router: Router,
    private _snackBar: SnackbarService,
    private BudgetService: BudgetService
  ) {
    const navigationUrl = this._router.getCurrentNavigation();
    this.mackToken = navigationUrl?.extractedUrl.queryParams['token'];
    this.referenceNo = navigationUrl?.extractedUrl.queryParams['referenceNo'];
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log(this._authService.isLoggedIn(), 'load');

    if (this._authService.isLoggedIn()) {
      // const currentUser: any = this._storage.getUserDetails();
      // if (route?.data?.role && route.data.role.indexOf(currentUser.cntrlType) === -1) {
      //   this._storage.redirectBasedonRoles(currentUser);
      //   return false;
      // }
      // if(this.referenceNo) {
      //   this._layoutService.getRedirection(this.referenceNo);
      // }
      return true;
    } else {
      if (this.mackToken) {
        const requestBody = {
          token: this.mackToken,
        };

        this.BudgetService.piqLogin(requestBody).subscribe((response) => {
          this._storage.setAccessToken(this.mackToken);
          this._authService.getUserProfile((res: any) => {
                  //Store user details
                  if (res) {
                    this._storage.setAccessToken(response.accestoken);
                    this._storage.setRefereshToken(response.refreshtoken)
                    let userInfo = res.result.userInfo;
                    this._storage.setUserDetails(JSON.stringify(res.result.userInfo));
                     this._storage.redirectBasedonRoles(userInfo); // changed once mack1 to mack2 redirection
                  }
                  else {
                    this._snackBar.loadSnackBar("Failed to fetch the User Details", colorCodes.ERROR);
                    this._storage.clearStorageRedirect();
                  }
                });
        });
        return false;
      } else {
        console.log('Token Not Avaialable');
        // this._router.navigate(['auth']);
        return true;
      }
      // return false;
    }
  }
}
