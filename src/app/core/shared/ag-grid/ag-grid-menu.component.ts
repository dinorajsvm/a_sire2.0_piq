import { Component, NgZone } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { Router } from '@angular/router';

@Component({
  template: `<ng-container *ngFor="let menu of params.menu">
                <span class="cursor-pointer mr-2" *ngIf = "menu.link && menu.image" (click)="navigate(menu.link, menu.id ?  params.data[menu.id] : id)" [matTooltip]="menu.tooltip">
                    <img src="{{ menu.image }}" alt="" width="14" *ngIf="menu.image"/>
                    <span *ngIf="menu.name">{{menu.name}}</span>
                </span>
                <span class="cursor-pointer mr-2" *ngIf = "!menu.link && menu.image && !menu.workflowIndication && !(menu.name == 'Delete' && params.data.formstatus && params.data.formstatus =='Synced') " (click)="menu.onMenuAction(params.data)" [matTooltip]="menu.tooltip">
                    <img src="{{ menu.image }}" alt="" width="14" *ngIf="menu.image"/>
                    <!-- <span *ngIf="menu.name">{{menu.name}}</span> -->
                </span>
                <span class="cursor-pointer mr-2" *ngIf = "!menu.link && menu.toggleImageFill && toShowLikeDisLike" (click)="menu.onMenuAction(params.data)" [matTooltip]="menu.tooltip">                  
                  <img src="{{ params.data[menu.paramkey] !== null  ? params.data[menu.paramkey] ? menu.toggleImageFill: menu.toggleImageOutLine : menu.defaultImageState}}" alt="" width="14" *ngIf="menu.toggleImageFill"/>
                  <span *ngIf="menu.name">{{menu.name}}</span>
                </span>
                <span class="cursor-pointer mr-2" *ngIf = "!menu.link && menu.image && menu.workflowIndication && toShow" (click)="menu.onMenuAction(params.data)" [matTooltip]="menu.tooltip">
                  <img src="{{ menu.image }}" alt="" width="14" *ngIf="menu.image"/>
                  <span *ngIf="menu.name">{{menu.name}}</span>
                </span>
                </ng-container>`,
  styles: ['.mat-menu-item { line-height: 30px;height: 30px;}']
})

export class AgGridMenuComponent implements AgRendererComponent {
  params: any;
  public id: any;
  toShow:boolean = false;
  toShowLikeDisLike:boolean = true;
  constructor(private ngZone: NgZone,
    private router: Router) { }

    filteredMenu: any[] = [];

  refresh(params: any): boolean {
   return false
  }
  agInit(params: import("ag-grid-community").ICellRendererParams): void {
    this.params = params;
    console.log("Status Value: ", this.params.data);
    this.params.menu.forEach((value: any, index: any) => {
      if (value.hasOwnProperty("workflowIndication")) {
        this.toShow = value.isVisible(params.data);
      }
      if (value.hasOwnProperty("displayLikeDislike")) {
        this.toShowLikeDisLike = value.isVisible();
      }

    });
    this.id = this.params.navigateId ? this.params.data[this.params.navigateId]  :  this.params.data.serialNumber ;
    this.filteredMenu = this.filterMenuItems();
  }

  filterMenuItems() {
    // Check the 'Status' value in params.data.status and decide whether to show the "Delete" menu item
    const status = this.params.data.formstatus;
    console.log("Filtering Menu Items for Status: ", this.params.data);
    
    if (status === 'Synced') {
      // Hide the "Delete" menu item if the 'Status' is 'synced'
      return this.params.menu.filter((menuItem:any) => menuItem.name !== 'Delete');
    }

    // Return all menu items by default
    return this.params.menu;
  }

  navigate(link: any, id: any) {
    
    this.ngZone.run(() => {
        this.router.navigate([link,id]);
        // this.router.navigate([link]);
    });
  }
}
