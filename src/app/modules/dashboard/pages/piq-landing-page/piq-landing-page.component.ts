import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { AgGridMenuComponent } from 'src/app/core/shared/ag-grid/ag-grid-menu.component';
import { BudgetService } from '../../services/budget.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import {
  CellStatus,
  DefaultColDef,
  EFormMode,
  colorCodes,
} from 'src/app/core/constants';
import { MatDialog } from '@angular/material/dialog';
import { ReuseConfirmationDialogComponent } from '../reuse-confirmation-dialog/reuse-confirmation-dialog.component';
import { VesselSelectionDialogComponent } from '../vessel-selection-dialog/vessel-selection-dialog.component';

@Component({
  selector: 'app-piq-landing-page',
  templateUrl: './piq-landing-page.component.html',
  styleUrls: ['./piq-landing-page.component.css'],
})
export class PIQLandingPageComponent implements OnInit {
  frameWorkComponent: any;
  shipColumnDefs: any[] = [
    {
      field: 'action',
      headerName: 'Action',
      cellRenderer: 'actionRenderer',
      cellRendererParams: {
        innerRendererFramework: AgGridMenuComponent,
        menu: [
          {
            name: '',
            image: 'assets/icon-images/view.png',
            link: '',
            tooltip: 'View',
            onMenuAction: this.viewForm.bind(this),
          },
          {
            name: '',
            image: 'assets/icon-images/edit.png',
            link: '/sire/piq-report/',
            tooltip: 'Edit',
          },
          {
            name: '',
            image: 'assets/icon-images/delete.png',
            link: '',
            tooltip: 'Delete',
            onMenuAction: this.deleteRowData.bind(this),
          },
        ],
      },
    },
    {
      field: 'serialNumber',
      headerName: 'Serial Number',
      tooltipField: 'serialNumber',
    },
    {
      field: 'referenceNumber',
      headerName: 'Reference Number',
      tooltipField: 'referenceNumber',
    },
    {
      field: 'companyName',
      headerName: 'Company Name',
      tooltipField: 'companyName',
    },
    {
      field: 'vesselName',
      headerName: 'Vessel Name',
      tooltipField: 'vesselName',
    },
    { field: 'fleetname', headerName: 'Fleet Name', tooltipField: 'fleetName' },
    {
      field: 'createdDate',
      headerName: 'Created Date/Time',
      tooltipField: 'createdDate',
    },
    { field: 'createdBy', headerName: 'Created By', tooltipField: 'createdBy' },
    {
      field: 'updatedBy',
      headerName: 'Updated User',
      tooltipField: 'updatedBy',
    },
    {
      field: 'updatedDate',
      headerName: 'Updated Date',
      tooltipField: 'updatedDate',
    },
    {
      field: 'status',
      headerName: 'Status',
      cellStyle: CellStatus,
      tooltipField: 'status',
    },
  ];

  shoreColumnDefs: any[] = [
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      filter: false,
      cellRenderer: 'actionRenderer',
      cellRendererParams: {
        innerRendererFramework: AgGridMenuComponent,
        menu: [
          {
            name: '',
            image: 'assets/icon-images/view.png',
            link: '',
            tooltip: 'View',
            onMenuAction: this.viewForm.bind(this),
          },
          {
            name: '',
            image: 'assets/icon-images/edit.png',
            link: '/sire/piq-report/',
            tooltip: 'Edit',
          },
          {
            name: '',
            image: 'assets/icon-images/delete.png',
            link: '',
            tooltip: 'Delete',
            onMenuAction: this.deleteRowData.bind(this),
          },
        ],
        
      },
    },
    {
      field: 'serialNumber',
      headerName: 'Serial Number',
      tooltipField: 'serialNumber',
    },
    {
      field: 'referenceNumber',
      headerName: 'Reference Number',
      tooltipField: 'referenceNumber',
    },
    {
      field: 'createdDate',
      headerName: 'Created Date/Time',
      tooltipField: 'createdDate',
    },
    { field: 'createdBy', headerName: 'Created By', tooltipField: 'createdBy' },
    {
      field: 'updatedBy',
      headerName: 'Updated User',
      tooltipField: 'updatedBy',
    },
    {
      field: 'updatedDate',
      headerName: 'Updated Date',
      tooltipField: 'updatedDate',
    },
    {
      field: 'status',
      headerName: 'Status',
      cellStyle: CellStatus,
      tooltipField: 'status',
    },
  ];
  defaultColDef = DefaultColDef;

  public gridOptions: GridOptions = {};

  rowData: any[] = [];
  getRefNo: any;
  getRefNumber: any;
  userDetails: any;
  compVslCode: any;
  showNew: boolean = true;
  getWrkFlowUser: any;
  public tooltipShowDelay = 0;

  constructor(
    private router: Router,
    private BudgetService: BudgetService,
    private _storage: StorageService,
    private _snackBarService: SnackbarService,
    public dialog: MatDialog
  ) {
    this.userDetails = this._storage.getUserDetails();
    this.frameWorkComponent = {
      actionRenderer: AgGridMenuComponent,
    };
  }

  ngOnInit(): void {
    this.getCodes();
    // this.getNewRef();
    this.getLndPgDatas();
    this.getworkflowStatus();
  }

  viewForm(event: any) {
    const instanceid = event.serialNumber;
    this.router.navigate([
      '/sire/piq-report/' + instanceid + '/' + EFormMode.VIEW,
    ]);
  }

  getNewRef() {
    if (
      this.getWrkFlowUser == 'anyuser' ||
      this.getWrkFlowUser == this.userDetails.userData.mdata.appInfo.rankCode
    ) {
      const payload = {
        locationcode: this.compVslCode,
        user: this.userDetails?.userCode,
      };
      this.BudgetService.getNewRefNo(payload).subscribe((res: any) => {
        if (Object.keys(res).length != 0) {
          let refNo = res;
          const getRefNumber = res.response;
          this.getRefNo = refNo;
          getRefNumber != ''
            ? this.router.navigate([
                '/sire/piq-report/' + getRefNumber + '/new',
              ])
            : '';
          localStorage.removeItem('getSelectedCheckListID');
        } else {
          this._snackBarService.loadSnackBar(
            res.error.errorMessage,
            colorCodes.ERROR
          );
        }
      });
    } else {
      this._snackBarService.loadSnackBar(
        'You Do Not Have Access to Create a New Form',
        colorCodes.ERROR
      );
    }
  }

  getCodes() {
    if (this.userDetails?.cntrlType === 'CNT001') {
      this.compVslCode = this.userDetails.companyCode;
    } else if (this.userDetails?.cntrlType === 'CNT002') {
      this.compVslCode = this.userDetails.userData.mdata.appInfo.vesselCode;
    } else {
    }
  }

  getLndPgDatas() {
    const payload = {
      usercode: this.userDetails?.userCode,
    };
    this.BudgetService.getPIQLndPgDatas(payload).subscribe((res: any) => {
      let object = res.response;
      this.rowData = object;
    });
  }

  deleteRowData(event: any) {
    const instanceid = event.serialNumber;
    const payload = { instanceid: instanceid };
    this.BudgetService.deleteRow(payload).subscribe((res: any) => {
      this._snackBarService.loadSnackBar('Form Deleted', colorCodes.INFO);
      this.getLndPgDatas();
    });
  }

  getworkflowStatus() {
    this.BudgetService.getworkFlowStatus().subscribe((res: any) => {
      let val = res.workflowmaster;
      val.forEach((item: any) => {
        this.getWrkFlowUser = item.creater;
      });
    });
  }

  navigatePiq() {
      this.dialog.open(VesselSelectionDialogComponent, {
        panelClass: 'vesselSelection-dialog-container',
      });
  }
}
