import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take, finalize } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';
import { AppService } from 'src/app/modules/dashboard/services/app.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorApiInterceptor implements HttpInterceptor {
  isRefreshToken = false;
  tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  constructor(
    private _storage: StorageService,
    private appServices: AppService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request?.url.includes('/refresh')) {
      request = request.clone({
        headers: new HttpHeaders({}),
      });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error?.status === 401) {
          if (error && error.url?.toString().includes('/refreshtoken')) {
            this.appServices.destroyPage();
            return throwError(error.name);
          } else {
            return this.handleRefreshToken(request, next);
          }
        } else {
          return throwError(error.name);
        }
      })
    );
  }

  handleRefreshToken(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    if (this.isRefreshToken) {
      return this.tokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => {
          return next.handle(this.injectToken(request));
        })
      );
    } else {
      this.isRefreshToken = true;
      this.tokenSubject.next(null);
      const requestBody = {
        reftoken: this._storage.getRefereshToken(),
      };
      return this.appServices.refreshToken(requestBody).pipe(
        switchMap((token) => {
          this.isRefreshToken = false;
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.setItem('accessToken', token.accesstoken);
          localStorage.setItem('refreshToken', token.refreshtoken);
          this.tokenSubject.next(token?.accesstoken);
          return next.handle(this.injectToken(request));
        }),
        catchError((error: HttpErrorResponse) => {
          this.isRefreshToken = false;
          this.appServices.destroyPage();
          return throwError(error);
        }),
        finalize(() => {
          this.isRefreshToken = false;
        })
      );
    }
  }

  injectToken(request: HttpRequest<any>) {
    const token = this._storage.getAccessToken();
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token ? token : ''}`,
      },
    });
  }
}
