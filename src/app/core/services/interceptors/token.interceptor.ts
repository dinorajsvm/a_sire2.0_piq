import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { catchError, finalize } from 'rxjs/operators';
import { HttpService } from '../http/http.service';
import { LoaderService } from '../utils/loader.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  
  constructor(private _storage:StorageService, private _http: HttpService, private _loaderService:LoaderService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken:string = this._storage.getAccessToken();
    
    this._loaderService.loaderShow();
    return next.handle(this.addAuthorizationHeader(request,accessToken)).pipe(catchError(err => {
        
  
      if(err instanceof HttpErrorResponse && err.status === 401 || err.status === 403) { 
        // this._http.handleRefreshTokenExpiry(err, this);
        // logout and redirect to login page
        this._loaderService.loaderHide();
        return this.logoutAndRedirect(err);
      } 
      this._loaderService.loaderHide();
      return  this._http.handleError(err,this);
      
    }), finalize(() => 
      this._loaderService.loaderHide()
    ));
  }
   private addAuthorizationHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    let userInfo = this._storage.checkUserDetails();
    if (token && userInfo) {
       return request.clone({setHeaders: {Authorization: `Bearer ${token}`}});
    }
    return request;
  }

  private logoutAndRedirect(err: HttpErrorResponse): Observable<HttpEvent<any>> {
    this._storage.clearStorageRedirect();
    return throwError(err);
  }
}
