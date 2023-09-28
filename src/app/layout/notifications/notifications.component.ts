import { Component, Input, OnInit } from '@angular/core';
declare function mdldmsnavigatenewtab(params:any,params1:any,params2:any,params3:any,params4:any):any;
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})

export class NotificationsComponent implements OnInit {

  @Input() notificationData:any;
  constructor(private _layoutService:LayoutService) { 
  }

  ngOnInit(): void {
  }

  viewAllNotification() {
    mdldmsnavigatenewtab('MPI','SNM','','true','true');
  }
  
  redirectToSummary(referenceId:string) {
    this._layoutService.getRedirection(referenceId);
  }

}
