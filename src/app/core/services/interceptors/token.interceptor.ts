import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, finalize, takeUntil, filter, take, switchMap } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';
import { HttpService } from '../http/http.service';
import { LoaderService } from '../utils/loader.service';
import { CancellationService } from 'src/app/modules/dashboard/services/cancellation.service';
import { BudgetService } from 'src/app/modules/dashboard/services/budget.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../snackbar/snackbar.service';
import { colorCodes } from '../../constants';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  public mackToken: any;
  private isRefreshing = false;

  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  constructor(
    private _storage: StorageService,
    private _http: HttpService,
    private _loaderService: LoaderService,
    private cancellationService: CancellationService,
    private _router: Router,
    private _snackBar: SnackbarService,
    private BudgetService: BudgetService
  ) {
    const navigationUrl = this._router.getCurrentNavigation();
    this.mackToken = navigationUrl?.extractedUrl.queryParams['token'];
    // this.referenceNo = navigationUrl?.extractedUrl.queryParams['referenceNo'];
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // const cancelled$ = this.cancellationService.cancelSignal;
    // const getpiqworkflowmaster = request.url.includes('getpiqworkflowmaster');
    // const getPIQlandingpage = request.url.includes('getPIQlandingpage');
    // const profileUrl = request.url.includes('user/profile');

    // const accessToken: string = this._storage.getAccessToken();
    // // if (this.mackToken) {
    // //   const requestBody = {
    // //     token: this.mackToken,
    // //   };
    // //   this.BudgetService.piqLogin(requestBody).subscribe(
    // //     (response: any) => {
    // //       if (response) {
    // //         this._storage.setAccessToken(response.accestoken);
    // //         this._storage.setRefereshToken(response.refreshtoken);
    // //         this.BudgetService.profileUrl().subscribe((res: any) => {
    // //           if (res) {
    // //             let userInfo = res.result.userInfo;
    // //             this._storage.setUserDetails(
    // //               JSON.stringify(res.result.userInfo)
    // //             );
    // //             this._storage.redirectBasedonRoles(userInfo); // changed once mack1 to mack2 redirection
    // //           }
    // //         });
    // //       }
    // //       if (response.Status === '400') {
    // //         this._router.navigate(['auth']);
    // //         this._snackBar.loadSnackBar('Invalid Token', colorCodes.ERROR);
    // //         this._storage.clearStorageRedirect();
    // //       }
    // //     },
    // //     (error) => {}
    // //   );
    // // }

    // this.showLoader();

    // let modifiedRequest: any;

    // modifiedRequest = this.addAuthorizationHeader(
    //   request,
    //   accessToken,
    //   profileUrl
    // );

    // if (!(getpiqworkflowmaster || getPIQlandingpage)) {
    //   return next.handle(request).pipe(
    //     takeUntil(cancelled$),
    //     catchError((error: HttpErrorResponse) => {
    //       this.hideLoader(); // Hide loader for unexpected errors
    //       return throwError(error);
    //     }),
    //     finalize(() => this.hideLoader())
    //   );
    // }

    // return next.handle(modifiedRequest).pipe(
    //   catchError((err) => this.handleApiError(err)),
    //   tap(() => this.hideLoader())
    // );
    const cancelled$ = this.cancellationService.cancelSignal;
    const getpiqworkflowmaster = request.url.includes('getpiqworkflowmaster');
    const getPIQlandingpage = request.url.includes('getPIQlandingpage');
    const profileUrl = request.url.includes('user/profile');

    const accessToken: string = this._storage.getAccessToken();

    this.showLoader();

    let modifiedRequest: any;

    modifiedRequest = this.addAuthorizationHeader(
      request,
      accessToken,
      profileUrl
    );
    if (!(getpiqworkflowmaster || getPIQlandingpage)) {
      return next.handle(request).pipe(
        takeUntil(cancelled$),
        catchError((error: HttpErrorResponse) => {
          this.hideLoader(); // Hide loader for unexpected errors
          return throwError(error);
        }),
        finalize(() => this.hideLoader())
      );
    }

    return next.handle(modifiedRequest).pipe(
      catchError(error => {
        
        if (error instanceof HttpErrorResponse && error.status === 401) {
        console.log(error, 'error');

          return this.handle401Error(modifiedRequest, next);
        } else if (error.status === 403) {
          this.isRefreshing = false;
          localStorage.clear();
          // this.cookieStorage = new CookieStorage();
          // this.cookieStorage.clear();
          // this.router.navigate(['']);
        }
        return throwError(() => error);
      })
      // tap(() => this.hideLoader())
    );
  }

  addAuthorizationHeader(
    request: HttpRequest<any>,
    token: string,
    type: boolean
  ): HttpRequest<any> {
    let userInfo = this._storage.checkUserDetails();
    if (type) {
      return request.clone({
        setHeaders: { Authorization: `${this.mackToken}` },
      });
    } else {
      if (token && userInfo) {
        return request.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
      }
    }
    return request;
  }

  // handleApiError(error: HttpErrorResponse): Observable<HttpEvent<any>> {
  //   console.log('test', error);

  //   if (
  //     error instanceof HttpErrorResponse &&
  //     (error.status === 401 || error.status === 403)
  //   ) {
  //     this.hideLoader();
  //     // Handle logout and redirect logic here or trigger appropriate actions
  //     this._storage.clearStorageRedirect();
  //     // Example: Navigate to the login page
  //     // this.router.navigate(['/login']);
  //   }

  //   this.hideLoader();
  //   return this._http.handleError(error, this);
  // }

  handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token = this._storage.getRefereshToken();
      if (token) {
        const requestBody = {
          reftoken: this._storage.getRefereshToken(),
        };
        return this.BudgetService.refreshToken(requestBody).pipe(
          switchMap((token: any) => {
            console.log(token, 'token');
            
            this.isRefreshing = false;
            localStorage.removeItem('accesstoken');
            localStorage.setItem('Accesstoken', token.access_token);
            localStorage.setItem('role', token.role);
            this.refreshTokenSubject.next(token.refresh_token);
            return next.handle(
              this.addAuthorizationHeader(request, token.access_token, false)
            );
          }),
          catchError((err: any) => {
            // this.isRefreshing = false;
            // localStorage.clear();
            // this.cookieStorage = new CookieStorage();
            // this.cookieStorage.clear();
            // this.router.navigate(['']);
            return throwError(() => err);
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addAuthorizationHeader(request, token, false)))
    );
  }

  showLoader() {
    this._loaderService.loaderShow();
  }

  hideLoader() {
    this._loaderService.loaderHide();
  }
}
