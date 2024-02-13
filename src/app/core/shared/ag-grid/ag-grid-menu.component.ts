import { Component, NgZone } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';
import { EFormMode, colorCodes } from '../../constants';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { AppService } from '../../../modules/dashboard/services/app.service';

@Component({
  template: `
    <ng-container>
      <span class="cursor-pointer mr-2" matTooltip="View" (click)="view(id)">
        <img src="assets/icon-images/view.png" alt="" width="14" />
      </span>
      <span class="cursor-pointer mr-2" matTooltip="Edit" (click)="edit(id)" *ngIf="params.data.isEdit">
        <img src="assets/icon-images/edit.png" alt="" width="14" />
      </span>
      <span class="cursor-pointer mr-2" matTooltip="Delete" (click)="deleteRowData(id)" *ngIf="params.data.isDelete">
        <img src="assets/icon-images/delete.png" alt="" width="14" />
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
  totalRowCount = 0;
  rowData: any[] = [];
  formOrigin: any;
  constructor(
    private ngZone: NgZone,
    private _storage: StorageService,
    private appServices: AppService,
    private _snackBarService: SnackbarService,
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
    this.id = this.params.data.serialNumber;
  }


  edit(id: any) {
    localStorage.removeItem('currentVesselType');
    this.router.navigate(['/sire/piq-report/' + id]);
  }
  view(id: any) {
    localStorage.removeItem('currentVesselType');
    this.router.navigate(['/sire/piq-report/' + id + '/' + EFormMode.VIEW]);
  }
  deleteRowData(id:any) {
    const instanceid = id;
    const payload = { instanceid: instanceid };
    this.appServices.deleteRow(payload).subscribe((res: any) => {
      this._snackBarService.loadSnackBar(
        'Deleted Successfully',
        colorCodes.INFO
      );
      this.appServices.setDeleteAction(true);
    });
  }

}
