import { Injectable } from '@angular/core';
import {
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { colorCodes } from '../constants';
import { SnackbarService } from '../services/snackbar/snackbar.service';
import { StorageService } from '../services/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class mgntdbGuard implements CanLoad {
  public mackToken: any;
  constructor(
    private _authService: AuthService,
    private _storage: StorageService,
    private _router: Router,
    private _snackBar: SnackbarService
  ) {
    const navigationUrl = this._router.getCurrentNavigation();
    this.mackToken = navigationUrl?.extractedUrl.queryParams['token'];
    console.log('PIQ 15-11-2023 Pre-Inspection Questionnarie :) MK');
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    //     if(this._authService.isLoggedIn()) {
    //       return true;
    //     }
    //     else {
    //       if(this.mackToken) {
    //         this._authService.validateToken(this.mackToken, (response: any) => {
    //             if(response.result.valid) {
    //              this._storage.setAccessToken(this.mackToken);
    //              this._authService.getUserProfile((res:any) => {
    //                //Store user details
    //                if(res) {
    //                  let userInfo = res.result.userInfo;
    //                  this._storage.setUserDetails(JSON.stringify(res.result.userInfo));
    //                 //  this._storage.redirectBasedonRoles(userInfo);
    //                   // changed once mack1 to mack2 redirection
    //                    this._router.navigate(['sire']);
    //                }
    //                else {
    //                  this._snackBar.loadSnackBar("Failed to fetch the User Details", colorCodes.ERROR);
    //                  this._storage.clearStorageRedirect();
    //                }
    //              });
    //            }
    //         });
    //      }
    //      else {
    //        this._router.navigate(['auth']);
    //      }
    //       return false;
    //     }

    if (
      this.mackToken == localStorage.getItem('accessToken') &&
      (this.mackToken != undefined ||
        localStorage.getItem('accessToken') != undefined)
    ) {
      return true;
    } else if (this.mackToken != undefined) {
      if (this.mackToken) {
        this._storage.deleteToken();
        console.log('this.mackToken', this.mackToken);
        this._authService.validateToken(this.mackToken, (response: any) => {
          if (response.result.valid) {
            this._storage.setAccessToken(this.mackToken);
            this._authService.getUserProfile((res: any) => {
              if (res) {
                let userInfo = res.result.userInfo;
                this._storage.setUserDetails(
                  JSON.stringify(res.result.userInfo)
                );
                //  this._storage.redirectBasedonRoles(userInfo);
                // changed once mack1 to mack2 redirection
                this._router.navigate(['sire']);
              } else {
                this._snackBar.loadSnackBar(
                  'Failed to fetch the User Details',
                  colorCodes.ERROR
                );
                this._storage.clearStorageRedirect();
              }
            });
          } else {
            this._router.navigate(['auth']);
          }
        });
      } else {
        this._router.navigate(['auth']);
      }
      return false;
    } else if (this._authService.isLoggedIn()) {
      // if(this.referenceNo) {
      //   console.log("is Logged In 28-04-22","this.referenceNo",this.referenceNo);
      //   this._layoutService.getRedirection(this.referenceNo);
      // }
      return true;
    } else {
      // this._router.navigate(['auth']);
      this._storage.clearStorageRedirect();
      return false;
    }
  }
}
