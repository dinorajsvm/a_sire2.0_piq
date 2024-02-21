import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {  Observable, throwError } from 'rxjs';
import {
  catchError,
  finalize,
  takeUntil
} from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';
import { LoaderService } from '../utils/loader.service';
import { CancellationService } from 'src/app/modules/dashboard/services/cancellation.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  public mackToken: any;
  constructor(
    private _storage: StorageService,
    private _loaderService: LoaderService,
    private cancellationService: CancellationService,
    private _router: Router
  ) {
    const navigationUrl = this._router.getCurrentNavigation();
    this.mackToken = navigationUrl?.extractedUrl.queryParams['token'];
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const cancelled$ = this.cancellationService.cancelSignal;
    const getpiqworkflowmaster = request.url.includes('getpiqworkflowmaster');
    const getPIQlandingpage = request.url.includes('getPIQlandingpage');
    const profileUrl = request.url.includes('user/profile');
    const accessToken: string = this._storage.getAccessToken();
    // this.showLoader();
    let modifiedRequest: any;
    modifiedRequest = this.addAuthorizationHeader(
      request,
      accessToken,
      profileUrl
    );
    if (!(getpiqworkflowmaster || getPIQlandingpage)) {
      return next.handle(modifiedRequest).pipe(
        takeUntil(cancelled$),
        catchError((error: HttpErrorResponse) => {
          // this.hideLoader(); // Hide loader for unexpected errors
          return throwError(error);
        }),
        // finalize(() => this.hideLoader())
      );
    }
    return next.handle(modifiedRequest).pipe(
      catchError((error) => {
        return throwError(() => error);
      }),
      // finalize(() => this.hideLoader())
    );
  }

  addAuthorizationHeader(
    request: HttpRequest<any>,
    token: string,
    type: boolean
  ): HttpRequest<any> {
    let userInfo = this._storage.checkUserDetails();
    let headers = {};
    if (type) {
      headers = { Authorization: `${this.mackToken}` };
    } else if (token && userInfo) {
      headers = { Authorization: `Bearer ${token}` };
    }
    return request.clone({
      setHeaders: headers,
    });
  }

  showLoader() {
    this._loaderService.loaderShow();
  }

  hideLoader() {
    this._loaderService.loaderHide();
  }
}
