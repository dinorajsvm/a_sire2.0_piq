import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { ApiMethod } from 'src/app/core/constants';
import { Endpoints } from 'src/app/core/mgntDBconstants';
import { HttpService } from 'src/app/core/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class AdvancedSearchService {
  private advanceSearch = new BehaviorSubject(null);
  summaryFilter = this.advanceSearch.asObservable();
  constructor(private _http: HttpService,) { }

  categoryCompanyList(payloadValue:any,successCallback:any,errorCallback:any) {

    console.log('payloadValue',payloadValue)
    let companyEndpoint = this._http.requestCall(Endpoints.GET_COMPANY, ApiMethod.POST, payloadValue);
    // let categoryEndpoint = this._http.requestCall(Endpoints.GET_CATEGORY, ApiMethod.POST, {});
    // let departmentEndpoint = this._http.requestCall(Endpoints.GET_DEPARTMENT, ApiMethod.POST, {});
    forkJoin([companyEndpoint]).subscribe((res:any)=> {
      console.log('res',res)
      successCallback(res);
     }, (error:any) => {
       errorCallback(error);
     });
  }

  setSearchFilters(filter:any) {
    this.advanceSearch.next(filter);
  }
  clearSearchFilter() {
    this.advanceSearch.next(null);
  }

}
