import { Component, NgZone } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  template: `<ng-container *ngFor="let menu of params.menu">
    <span
      class="cursor-pointer mr-2"
      *ngIf="
        menu.link &&
        menu.image &&
        !(
          (menu.name == 'Edit' &&
            params.data.status &&
            (params.data.status == 'Submitted' ||
              params.data.status == 'Approved')) ||
          ((params.data.status == 'Inprogress' ||
            params.data.status == 'Submitted' ||
            params.data.status == 'Reassigned' ||
            params.data.status == 'Approved') &&
            formOrigin == 'CNT001')
        )
      "
      (click)="navigate(menu.link, menu.id ? params.data[menu.id] : id)"
      [matTooltip]="menu.tooltip"
    >
      <img src="{{ menu.image }}" alt="" width="14" *ngIf="menu.image" />
      <!-- <span *ngIf="menu.name">{{menu.name}}</span> -->
    </span>
    
    <span
      class="cursor-pointer mr-2"
      *ngIf="
        !menu.link &&
        menu.image &&
        !menu.workflowIndication &&
        !(
          menu.name == 'Delete' &&
          params.data.status &&
          formOrigin &&
          ((params.data.status != 'Inprogress' && formOrigin === 'CNT002') ||
            (params.data.status === 'Submitted' && formOrigin === 'CNT001') ||
              (params.data.status === 'Inprogress' &&
                formOrigin === 'CNT001') ||
              (params.data.status === 'Reassigned' &&
                formOrigin === 'CNT001') ||
              (params.data.status === 'Approved' && formOrigin === 'CNT001'))
        )
      "
      (click)="menu.onMenuAction(params.data)"
      [matTooltip]="menu.tooltip"
    >
      <img src="{{ menu.image }}" alt="" width="14" *ngIf="menu.image" />
      <!-- <span *ngIf="menu.name">{{menu.name}}</span> -->
    </span>
    
    <span
      class="cursor-pointer mr-2"
      *ngIf="!menu.link && menu.toggleImageFill && toShowLikeDisLike"
      (click)="menu.onMenuAction(params.data)"
      [matTooltip]="menu.tooltip"
    >
      <img
        src="{{
          params.data[menu.paramkey] !== null
            ? params.data[menu.paramkey]
              ? menu.toggleImageFill
              : menu.toggleImageOutLine
            : menu.defaultImageState
        }}"
        alt=""
        width="14"
        *ngIf="menu.toggleImageFill"
      />
      <!-- <span *ngIf="menu.name">{{menu.name}}</span> -->
    </span>
    <span
      class="cursor-pointer mr-2"
      *ngIf="!menu.link && menu.image && menu.workflowIndication && toShow"
      (click)="menu.onMenuAction(params.data)"
      [matTooltip]="menu.tooltip"
    >
      <img src="{{ menu.image }}" alt="" width="14" *ngIf="menu.image" />
      <!-- <span *ngIf="menu.name">{{menu.name}}</span> -->
    </span>
  </ng-container>`,
  styles: ['.mat-menu-item { line-height: 30px;height: 30px;}'],
})
export class AgGridMenuComponent implements AgRendererComponent {
  params: any;
  public id: any;
  userDetails: any;
  toShow: boolean = false;
  toShowLikeDisLike: boolean = true;
  formOrigin: any;
  constructor(
    private ngZone: NgZone,
    private _storage: StorageService,
    private router: Router
  ) {
    this.userDetails = this._storage.getUserDetails();
  }

  filteredMenu: any[] = [];

  refresh(params: any): boolean {
    return false;
  }
  agInit(params: import('ag-grid-community').ICellRendererParams): void {
    this.params = params;
    this.formOrigin = this.params.data.createdin;
    this.params.menu.forEach((value: any, index: any) => {
      if (value.hasOwnProperty('workflowIndication')) {
        this.toShow = value.isVisible(params.data);
      }
      if (value.hasOwnProperty('displayLikeDislike')) {
        this.toShowLikeDisLike = value.isVisible();
      }
    });
    this.id = this.params.navigateId
      ? this.params.data[this.params.navigateId]
      : this.params.data.serialNumber;
    this.filteredMenu = this.filterMenuItems();
  }

  filterMenuItems() {
    console.log('111');

    // Check the 'Status' value in params.data.status and decide whether to show the "Delete" menu item
    const status = this.params.data.status;

    if (status === 'Submitted' && this.formOrigin === 'CNT001') {
      // If the status is 'Submitted' and formOrigin is 'CNT001', hide the "Delete" menu item
      return this.params.menu.filter(
        (menuItem: any) => menuItem.name !== 'Delete'
      );
    }

    // Return all menu items by default
    return this.params.menu;
  }

  navigate(link: any, id: any) {
    this.ngZone.run(() => {
      this.router.navigate([link, id]);
      // this.router.navigate([link]);
    });
  }
}
