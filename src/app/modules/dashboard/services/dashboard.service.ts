import { Injectable } from '@angular/core';
import { ApiMethod } from 'src/app/core/constants';
import { Endpoints } from 'src/app/core/mgntDBconstants';
import { HttpService } from 'src/app/core/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private _http: HttpService) { }


  getCommonWidget(payloadValue:any, successCallback:any, errorCallback:any) {
    this._http.requestCall(Endpoints.GET_DASHBOARD_COMMON_WIDGET, ApiMethod.POST, payloadValue).subscribe((res:any)=> {
     successCallback(res);
    }, (error:any) => {
      errorCallback(error);
    });
  }

  getCommonGridtDetail(payloadValue:any, successCallback:any, errorCallback:any) {
    this._http.requestCall(Endpoints.GET_DASHBOARD_COMMON_GRID_DETAIL, ApiMethod.POST, payloadValue).subscribe((res:any)=> {
     successCallback(res);
    }, (error:any) => {
      errorCallback(error);
    });
  }

  getexternalwidget(payloadValue:any, successCallback:any, errorCallback:any) {
    this._http.requestCall(Endpoints.GET_DASHBOARD_EXTERNAL_WIDGET, ApiMethod.POST, payloadValue).subscribe((res:any)=> {
     successCallback(res);
    }, (error:any) => {
      errorCallback(error);
    });
  }

  getVessels(payloadValue:any,successCallback:any) {
    this._http.requestCall(Endpoints.GET_VESSEL, ApiMethod.POST, payloadValue).subscribe((res:any)=> {
      successCallback(res);
    });
  }
}
