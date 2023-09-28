import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Roles, UserRoles } from '../../mgntDBconstants';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private portAreaToggle = new BehaviorSubject(false);
  areaStatus = this.portAreaToggle.asObservable();
  constructor(private _storage: StorageService) { }

  togglePortArea(status: boolean) {
    this.portAreaToggle.next(status);
  }

  getRatingColorDiv(ratingVal:any) {
    let ratingColor = ratingVal > 2 ? 'text-success' : ratingVal < 1 ? 'text-danger' : 'text-warning';
    return "<span class='font-weight-bold "+ ratingColor +"'>"+ ratingVal +"<i class='material-icons' style='vertical-align:text-bottom;font-size:16px;'>star_border</i></span>"
  }

  getUserAction() {
    let currentRole = this._storage.getRoleCode();
    let permissionGroup:any;
    switch (currentRole) {
      case UserRoles.NYK_MARINE_GROUP:
        permissionGroup = this.getNYKPermission();
        break;
      
      case UserRoles.MASTER:
        permissionGroup = this.getMasterPermission();
        break;
      case UserRoles.DECK_OFFICER:
        permissionGroup = this.getDeckOfficerPermission();
        break;
      case UserRoles.CREW_MEMBER:
        permissionGroup = this.getCrewPermission();
        break;
      case UserRoles.VESSEL_MANAGER:
        permissionGroup = this.getCrewPermission();
        break;
    
      default:
        break;
    }

    return permissionGroup;
  }
  getNYKPermission() {
    return {'isCreate': true,'isVerify': true, 'isEdit': true, 'isSubmit': false}
  }
  getMasterPermission() { 
    let projectType = environment.projectType;
    if(projectType == Roles.SHORE) { 
      return {'isCreate': true,'isSubmit': false, 'isEdit': false, 'isVerify': false}
    }
    return {'isCreate': true,'isSubmit': true, 'isVerify': false, 'isEdit': true}
  }
  getCrewPermission() {
    return {'isCreate': false, 'isSubmit': false, 'isEdit': false, 'isVerify': false }
  }
  getDeckOfficerPermission(){
    return {'isCreate': true,'isSubmit': false, 'isEdit': false, 'isVerify': false}
  }
  getPermission(roleCode:any,projectType:any) {
    return {}
  }
  getSizeFormat(bytes:any, decimals = 2) {
    if (bytes === 0 || !bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  dmsToDecimal(degree:any, minutes:any=0, seconds:any=0, direction:any){
    return  (direction === 'S' || direction === 'W')?-(degree+(minutes/60)+(seconds/3600)):degree+(minutes/60)+(seconds/3600);
  }
  formattedDate(date:any){
    date = new Date(date);
    return date.getFullYear()+'/'+(date.getMonth() + 1)+'/'+date.getDate()+' '+ date.getHours()+":"+ date.getMinutes()+":"+ date.getSeconds();
  }

  roundToDecimal(value:any) {
    return (Math.round(value * 10)/10).toFixed(1);
  }

  getDepartmentWidth(whole:number, part:number) {
    return ((part*100)/whole) + '%';
  }

  autosizeColumnsIfNeeded(gridApi:any) {
    let availableWidth = gridApi['gridPanel'].eBodyViewport.clientWidth;
    let columns = gridApi['gridPanel'][
      'columnController'
    ].getAllDisplayedColumns();
    let usedWidth = gridApi['gridPanel'][
      'columnController'
    ].getWidthOfColsInList(columns);

    if (usedWidth < availableWidth) {
      gridApi.sizeColumnsToFit();
    }
  }
}
