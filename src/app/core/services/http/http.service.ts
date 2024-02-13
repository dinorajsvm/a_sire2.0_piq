import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import {
  ApiMethod,
  colorCodes,
  ErrorCodes,
  ErrorMessage,
} from '../../constants';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SnackbarService } from '../snackbar/snackbar.service';
import { StorageService } from '../storage/storage.service';
import { environment } from 'src/environments/environment';
import { Endpoints } from 'src/app/core/mgntDBconstants';
import { AppService } from 'src/app/modules/dashboard/services/app.service';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private http: HttpClient,
    private _snackBar: SnackbarService,
    private _storage: StorageService,
    private appServices: AppService
  ) {}

  requestCall(
    api: string,
    method: ApiMethod,
    data?: any,
    definedApiUrl?: string
  ) {
    let response: any;
    let apiUrl = definedApiUrl ? definedApiUrl : environment.apiUrl;

    switch (method) {
      case ApiMethod.GET:
        response = this.http
          .get(`${apiUrl}${api}`)
          .pipe(catchError((err) => this.handleError(err, this)));
        break;

      case ApiMethod.GETPARAMS:
        let reqParams = this.getParams(data);
        response = this.http
          .get(`${environment.apiUrl}${api}`, { params: reqParams })
          .pipe(catchError((err) => this.handleError(err, this)));
        break;

      case ApiMethod.POST:
        response = this.http
          .post(`${apiUrl}${api}`, data)
          .pipe(catchError((err) => this.handleError(err, this)));
        break;

      case ApiMethod.POST_WITH_HEADER:
        response = this.http
          .post(`${apiUrl}${api}`, data, {
            headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }),
          })
          .pipe(catchError((err) => this.handleError(err, this)));
        break;

      case ApiMethod.GET_WITH_HEADER:
        response = this.http
          .get(`${apiUrl}${api}`, {
            headers: new HttpHeaders({
              authorization: this._storage.getAccessToken(),
            }),
          })
          .pipe(catchError((err) => this.handleError(err, this)));
        break;

      case ApiMethod.PUT:
        response = this.http
          .put(`${apiUrl}${api}`, data)
          .pipe(catchError((err) => this.handleError(err, this)));
        break;

      case ApiMethod.DELETE:
        response = this.http
          .delete(`${apiUrl}${api}`)
          .pipe(catchError((err) => this.handleError(err, this)));
        break;

      case ApiMethod.DOWNLOAD_BLOB:
        response = this.http
          .post(`${environment.apiUrl}${api}`, data, {
            headers: new HttpHeaders({}),
            responseType: 'blob',
          })
          .pipe(catchError((err) => this.handleError(err, this)));
        break;

      default:
        break;
    }
    return response;
  }

  handleError(error: HttpErrorResponse, self: any) {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      this._snackBar.loadSnackBar(
        'Failed to fetch the User Details',
        colorCodes.ERROR
      );

      this.appServices.destroyPage();
    }
    if (error.error instanceof ErrorEvent) {
      console.error('Error occured', error.error.message);
      return throwError({ error: error.message, status: error.status });
    } else {
      if (!error.status) {
        this.whichError(error.status);
      } else {
        this.whichError(error.status, error.error.error.errorMessage);
      }
      return throwError({ error: error.message, status: error.status });
    }
  }

  whichError(errorCode: number, errorMessage: string = '') {
    switch (errorCode) {
      case ErrorCodes.HTTP_400_BAD_REQUEST:
        this._snackBar.loadSnackBar(errorMessage, colorCodes.ERROR);
        break;

      case ErrorCodes.HTTP_403_FORBIDDEN:
        this._snackBar.loadSnackBar(errorMessage, colorCodes.ERROR);
        break;

      case ErrorCodes.HTTP_401_UNAUTHORIZED:
        this._snackBar.loadSnackBar(errorMessage, colorCodes.ERROR);
        break;

      case ErrorCodes.HTTP_404_NOT_FOUND:
        this._snackBar.loadSnackBar(errorMessage, colorCodes.ERROR);
        break;

      case ErrorCodes.HTTP_500_ERROR:
        this._snackBar.loadSnackBar(
          ErrorMessage.INTERNAL_SERVER_ERROR,
          colorCodes.ERROR
        );
        break;

      case ErrorCodes.HTTP_CONN_REFUSED:
        this._snackBar.loadSnackBar(
          ErrorMessage.NETWORK_ERROR,
          colorCodes.ERROR
        );
        break;

      default:
        this._snackBar.loadSnackBar(
          ErrorMessage.UNKNOWN_ERROR_CODE,
          colorCodes.ERROR
        );
    }
  }

  getParams(params: any) {
    let httpParams = new HttpParams();
    let paramKeys = Object.keys(params);
    for (let i = 0; i < paramKeys.length; i++) {
      let key = paramKeys[i];
      let value = params[key];
      httpParams = httpParams.append(key, value);
    }
    return httpParams;
  }
}
