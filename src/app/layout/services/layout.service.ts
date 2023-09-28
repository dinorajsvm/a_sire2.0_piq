import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiMethod } from 'src/app/core/constants';
import { Endpoints } from 'src/app/core/mgntDBconstants';
import { HttpService } from 'src/app/core/services/http/http.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(
    private _http: HttpService,
    private _router:Router) { }

    getNotification(userCode:any, companyCode:any, successCallback:any) {
      let notificationEndpoint:any =  Endpoints.GET_GETNOTIFICATION + '/' + userCode;
      let alertsNotificationEndpoint:any =  Endpoints.GET_ALERTS_NOTIFICATION + '/' + userCode + '/' + companyCode;
       let notification = this._http.requestCall(notificationEndpoint, ApiMethod.GET) 
       let alertNotification = this._http.requestCall(alertsNotificationEndpoint, ApiMethod.GET)
       forkJoin([notification, alertNotification]).subscribe((res:any)=> { 
         successCallback(res);
        });
     }

     updateNotificationstatus(successCallback:any) {
      this._http.requestCall(Endpoints.UPDATE_READ_STATUS, ApiMethod.POST).subscribe((res:any) => {
        successCallback(res);
      });
    }

    getRedirection(referenceId:string) {
      this._http.requestCall(Endpoints.NOTIFICATION_REDIRECT, ApiMethod.POST, {
        "refId": referenceId
      }).subscribe((res:any) => {
        let routerLink = res.result.reportTypeId == 2 ? '/cmb/summary/area/view' : '/cmb/summary/port/view';
        this._router.navigate([routerLink, res.result.areaPortCode, res.result.reportId])
      });
    }

}