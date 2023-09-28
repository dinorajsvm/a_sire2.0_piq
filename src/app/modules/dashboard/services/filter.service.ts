import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  
  topBarInput:any = {
    vesselName: '',
    vesselType: 'All',
    date:''
  }
  detailPlanActive:boolean=false;
  inAdvanceSearch:boolean = false;
  disableTopBar:boolean = false;
  advanceSearchDate:any = '';
  inAdvanceSearchPayload:any = '';
  public searchTopBarEvent = new BehaviorSubject(null);
  constructor() { }
 
  setTopBarFilter() {
    this.searchTopBarEvent.next(this.topBarInput);
  }

  resetTopBarFilter() {
    this.searchTopBarEvent.next(null);
  }

}