import { Component, Input, OnInit } from '@angular/core';
import { Roles, UserRoles } from 'src/app/core/mgntDBconstants';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { environment } from 'src/environments/environment';
declare function mdldmsnavigatenewtab(params:any,params1:any,params2:any,params3:any,params4:any):any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() leftOpen:any;
  
  showAreaMenu:boolean = false;
  userDetails:any;
  isShipUser:boolean = true;
  vesselImage:any = '';
  constructor(private _storage: StorageService) {
    this.userDetails = this._storage.getUserDetails();
    this.vesselImage = this.userDetails?.vesselPicShip;
    if (environment.projectType == Roles.SHORE) {
      this.isShipUser = false;
      this.vesselImage = this.userDetails?.vesselPicShore;
    }
  }

  ngOnInit(): void {
    if(this._storage.getRoleCode() === UserRoles.NYK_MARINE_GROUP) {
      this.showAreaMenu = true;
    }
  }

  navigate(toMldId:any){
    console.log("redirection to other module");
    let fromMldId = 'MGD';
    mdldmsnavigatenewtab(fromMldId,toMldId,'','true','true');
  }
}