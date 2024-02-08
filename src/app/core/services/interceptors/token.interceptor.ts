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
    private _loaderService: LoaderService,
    private cancellationService: CancellationService,
    private _router: Router,
    private BudgetService: BudgetService
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
          return this.handle401Error(modifiedRequest, next);
        } else if (error.status === 403) {
          this.isRefreshing = false;
          localStorage.clear();
        }
        return throwError(() => error);
      }),  finalize(() => this.hideLoader())
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
            this.isRefreshing = false;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.setItem('accessToken', token.accesstoken);
            localStorage.setItem('refreshToken', token.refreshtoken);
            // localStorage.setItem('role', token.role);
            this.refreshTokenSubject.next(token.refreshtoken);
            this.hideLoader();
            return next.handle(
              this.addAuthorizationHeader(request, token.accesstoken, false)
            );
          }),
          catchError((err: any) => {
            localStorage.clear();
            this._router.navigate(['auth']);
            this.hideLoader();
            return throwError(() => err);
          })
        );
      } else {
        localStorage.clear();
        this._router.navigate(['auth']);
        this.hideLoader();
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
