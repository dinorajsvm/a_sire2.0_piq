import { Component, Input, OnInit } from '@angular/core';
declare function mdldmsnavigatenewtab(params:any,params1:any,params2:any,params3:any,params4:any):any;
import { LayoutService } from '../services/layout.service';
@Component({
  selector: 'app-alerts-notification',
  templateUrl: './alerts-notification.component.html',
  styleUrls: ['./alerts-notification.component.css']
})
export class AlertsNotificationComponent implements OnInit {
  @Input() notificationData:any;
  constructor(private _layoutService:LayoutService) { 
  }

  ngOnInit(): void {
  }

  viewAllAlerts() {
    mdldmsnavigatenewtab('MPI','MYT','','true','true');
  }

  redirectToSummary(referenceId:string) {
    this._layoutService.getRedirection(referenceId);
  }
}
