import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  public dataObject :any = new Object();
  public filterObject :any = new Object();
  public originalObject :any; //= new Object();
  public originalFullyObject :any;// = new Object();
  public combineVessels :any;
  public selectedVessels: any;
  constructor() {
  }
  public setScope(scope: any): void {
    this.dataObject = scope;
  }
  public getScope(): Array<any> {
    return this.dataObject;
  }

  public setFilterValues(scope: any): void {
    this.filterObject = scope;
  }

  public getFilterValues(): Array<any> {
    return this.filterObject;
  }

  public setOriginalValues(scope: any): void {
    this.originalObject = scope;
  }

  public getOriginalValues(): Array<any> {
    return this.originalObject;
  }

  public setFullyOriginalValues(scope: any): void {
    this.originalFullyObject = scope;
  }

  public getFullyOriginalValues(): Array<any> {
    return this.originalFullyObject;
  }

  public setCombineVessels(scope: any): void {
    this.combineVessels = scope;
  }

  public getCombineVessels(): Array<any> {
    return this.combineVessels;
  }
  public setDropdownVessel(scope: any): void {
    this.selectedVessels = scope;
  }
  public getDropdownVessel(){
    return this.selectedVessels;
  }
}
