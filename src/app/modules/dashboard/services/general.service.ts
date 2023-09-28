import { EventEmitter, Injectable, Output } from '@angular/core';
import { ApiMethod } from 'src/app/core/constants';
import { Endpoints } from 'src/app/core/mgntDBconstants';
import { HttpService } from 'src/app/core/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  @Output() emitloader = new EventEmitter<any>();
  @Output() emitData = new EventEmitter<any>();
  @Output() quicklink = new EventEmitter<any>();
  @Output() emittabledata = new EventEmitter<any>();
  @Output() vesselExpand = new EventEmitter<void>();
  @Output() fullscreenReq = new EventEmitter<void>();
  @Output() budgetLoader = new EventEmitter<any>();
  @Output() budgetData = new EventEmitter<any>();
  @Output() progressExpand = new EventEmitter<void>();
  @Output() quickExpand = new EventEmitter<void>();
  @Output() sidebar = new EventEmitter<void>();
  currentDate: any = '';
  advancedPayLoad: any;
  stateResponse: any;
  isAdvSearch: any = false;
  checkedList: any;
  advDateEnd: any;
  advDateStart: any;
  basePath: any;
  private globalUrl = document.location.protocol + '//' + document.location.hostname;
  constructor(private _http: HttpService) { }

  GetSummaryDonutInfo(payloadValue:any, successCallback:any, errorCallback:any) {
    this._http.requestCall(Endpoints.GET_SUMMARY_DONUT_INFO, ApiMethod.POST, payloadValue).subscribe((res:any)=> {
     successCallback(res);
    }, (error:any) => {
      errorCallback(error);
    });
  }

  GetSummaryBarInfo(payloadValue:any, successCallback:any, errorCallback:any) {
    this._http.requestCall(Endpoints.GET_SUMMARY_BAR_INFO, ApiMethod.POST, payloadValue).subscribe((res:any)=> {
     successCallback(res);
    }, (error:any) => {
      errorCallback(error);
    });
  }

  GetGridInfo(payloadValue:any, successCallback:any, errorCallback:any) {
    this._http.requestCall(Endpoints.GET_SUMMARY_GRID_INFO, ApiMethod.POST, payloadValue).subscribe((res:any)=> {
     successCallback(res);
    }, (error:any) => {
      errorCallback(error);
    });
  }

  GetPopupTableInfo(payloadValue:any, successCallback:any, errorCallback:any) {
    this._http.requestCall(Endpoints.GET_POPTABLE_INFO, ApiMethod.POST, payloadValue).subscribe((res:any)=> {
     successCallback(res);
    }, (error:any) => {
      errorCallback(error);
    });
  }
  GetBarChartTableInfo(payloadValue:any, successCallback:any, errorCallback:any) {
    this._http.requestCall(Endpoints.GET_BARCHART_GRID_INFO, ApiMethod.POST, payloadValue).subscribe((res:any)=> {
     successCallback(res);
    }, (error:any) => {
      errorCallback(error);
    });
  }
  GetGridTableInfo(payloadValue:any, successCallback:any, errorCallback:any) {
    this._http.requestCall(Endpoints.GET_GRIDTABLE_INFO, ApiMethod.POST, payloadValue).subscribe((res:any)=> {
     successCallback(res);
    }, (error:any) => {
      errorCallback(error);
    });
  }
  GetFilterInfo(payloadValue:any, successCallback:any, errorCallback:any) {
    this._http.requestCall(Endpoints.GET_FILTER_RESULTINFO, ApiMethod.POST, payloadValue).subscribe((res:any)=> {
     successCallback(res);
    }, (error:any) => {
      errorCallback(error);
    });
  }

  GetStateInfo(payloadValue:any, successCallback:any, errorCallback:any) {
    this._http.requestCall(Endpoints.GET_STATE_INFO, ApiMethod.POST, payloadValue).subscribe((res:any)=> {
     successCallback(res);
    }, (error:any) => {
      errorCallback(error);
    });
  }
  GetAdvancedStateInfo(payloadValue:any, successCallback:any, errorCallback:any) {
    this._http.requestCall(Endpoints.GET_ADVANCE_SEARCH_INFO, ApiMethod.POST, payloadValue).subscribe((res:any)=> {
     successCallback(res);
    }, (error:any) => {
      errorCallback(error);
    });
  }

  GetAgeingTableInfo(payloadValue:any, successCallback:any, errorCallback:any) {
    this._http.requestCall(Endpoints.GET_AGING_INFO_DETAILS, ApiMethod.POST, payloadValue).subscribe((res:any)=> {
     successCallback(res);
    }, (error:any) => {
      errorCallback(error);
    });
  }
  Getbugetwidgetapi(successCallback:any, errorCallback:any){
    this._http.requestCall(Endpoints.GET_BUDGET_WIDGET_APIKEY, ApiMethod.POST).subscribe((res:any)=> {
      successCallback(res);
     }, (error:any) => {
       errorCallback(error);
     });
  }
}
