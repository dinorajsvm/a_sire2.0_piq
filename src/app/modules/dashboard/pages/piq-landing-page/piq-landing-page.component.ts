import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions, RowGroupingDisplayType } from 'ag-grid-community';
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
import { VesselSelectionDialogComponent } from '../vessel-selection-dialog/vessel-selection-dialog.component';
import { AgGridMenuShoreComponent } from 'src/app/core/shared/ag-grid/ag-grid-menu-shore.component';
import { DatePipe } from '@angular/common';
import { AgGridService } from 'src/app/core/services/utils/ag-grid.service';

@Component({
  selector: 'app-piq-landing-page',
  templateUrl: './piq-landing-page.component.html',
  styleUrls: ['./piq-landing-page.component.css'],
  providers: [DatePipe],
})
export class PIQLandingPageComponent implements OnInit {
  frameWorkComponent: any;
  frameWorkShoreComponent: any; 
  totalRowCount = 0;
  gridApi: any;
  agGridToolbar: any = {};
  shipColumnDefs: any[] = [
    {
      field: 'action',
      headerName: 'Action',
      pinned: 'left',
      cellRenderer: 'actionRenderer',
      cellRendererParams: {
        innerRendererFramework: AgGridMenuComponent,
        menu: [
          {
            name: 'View',
            image: 'assets/icon-images/view.png',
            link: '',
            tooltip: 'View',
            onMenuAction: this.viewForm.bind(this),
          },
          {
            name: 'Edit',
            image: 'assets/icon-images/edit.png',
            link: '/sire/piq-report/',
            tooltip: 'Edit',
          },
          {
            name: 'Delete',
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
      headerName: 'S.No',
      tooltipField: 'serialNumber',
    },
    {
      field: 'referenceNumber',
      headerName: 'Ref.Id',
      tooltipField: 'referenceNumber',
    },
    {
      field: 'companyName',
      headerName: 'Company Name',
      tooltipField: 'companyName',
    },
    { field: 'fleetname', headerName: 'Fleet Name', tooltipField: 'fleetName',cellStyle: { textalign: 'left' }, },
    {
      field: 'vesselName',
      headerName: 'Vessel Name',
      tooltipField: 'vesselName',
      cellStyle: { textalign: 'left' },
    },
    {
      field: 'vesseltype',
      headerName: 'Vessel Type',
      tooltipField: 'vesseltype',

    },
    {
      field: 'flag',
      headerName: 'Flag Name',
      tooltipField: 'flag',
    },
    { field: 'createdBy', headerName: 'Created User', tooltipField: 'createdBy' },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      tooltipField: 'createdDate',
      cellStyle: { textAlign: 'right' },
      valueGetter: (params: any) => {
        return params.data.createdDate
          ? this.datePipe.transform(params.data.createdDate, 'dd-MMM-yyyy HH:mm')
          : '';
      },
    },
    {
      field: 'updatedBy',
      headerName: 'Updated User',
      tooltipField: 'updatedBy',
    },
    {
      field: 'updatedDate',
      headerName: 'Updated Date',
      tooltipField: 'updatedDate',
      cellStyle: { textAlign: 'right' },
      valueGetter: (params: any) => {
        return params.data.updatedDate
          ? this.datePipe.transform(params.data.updatedDate, 'dd-MMM-yyyy HH:mm')
          : '';
      },
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
      pinned: 'left',
      sortable: false,
      filter: false,
      cellRenderer: 'actionRenderer',
      cellRendererParams: {
        innerRendererFramework: AgGridMenuShoreComponent,
        menu: [
          {
            name: 'View',
            image: 'assets/icon-images/view.png',
            link: '',
            tooltip: 'View',
            onMenuAction: this.viewForm.bind(this),
          },
          {
            name: 'Edit',
            image: 'assets/icon-images/edit.png',
            link: '/sire/piq-report/',
            tooltip: 'Edit',
          },
          {
            name: 'Delete',
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
      headerName: 'S.No',
      tooltipField: 'serialNumber',
    },
    {
      field: 'referenceNumber',
      headerName: 'Ref.Id',
      tooltipField: 'referenceNumber',
    },{
      field: 'companyName',
      headerName: 'Company Name',
      tooltipField: 'companyName',
    },
    {
      field: 'fleetname',
      headerName: 'Fleet Name',
      tooltipField: 'fleetname',
      cellStyle: { textalign: 'left' },
    },
    {
      field: 'vesselName',
      headerName: 'Vessel Name',
      tooltipField: 'vesselName',
      cellStyle: { textalign: 'left' },
    },
    {
      field: 'vesseltype',
      headerName: 'Vessel Type',
      tooltipField: 'vesseltype',
    },
    {
      field: 'flag',
      headerName: 'Flag Name',
      tooltipField: 'flag',
    },
    {
      field: 'createdBy',
      headerName: 'Created User',
      tooltipField: 'createdBy',
    },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      tooltipField: 'createdDate',
      cellStyle: { textAlign: 'right' },
      valueGetter: (params: any) => {
        return params.data.createdDate
          ? this.datePipe.transform(params.data.createdDate, 'dd-MMM-yyyy HH:mm')
          : '';
      },
    },
    {
      field: 'updatedBy',
      headerName: 'Updated User',
      tooltipField: 'updatedBy',
    },
    {
      field: 'updatedDate',
      headerName: 'Updated Date',
      tooltipField: 'updatedDate',
      cellStyle: { textAlign: 'right' },
      valueGetter: (params: any) => {
        return params.data.updatedDate
          ? this.datePipe.transform(params.data.updatedDate, 'dd-MMM-yyyy HH:mm')
          : '';
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      cellStyle: CellStatus,
      tooltipField: 'status',
    },
  ];
  defaultColDef = DefaultColDef;
  public groupDisplayType: RowGroupingDisplayType = 'groupRows';
  public rowGroupPanelShow: any = 'always';

  public gridOptions: GridOptions = {};
  gridColumnApi: any;

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.addEventListener('filterChanged', this.onFilterChanged.bind(this));
    this.agGridToolbar['exportAsCSV'] = this._agGridService.exportAsCSV.bind(
      this,
      this.gridApi,
      'PIQ'
    );
    this.agGridToolbar['exportAsExcel'] = this._agGridService.exportAsExcel.bind(
      this,
      this.gridApi,
      'PIQ'
    );
    this.agGridToolbar['columnFilter'] = this._agGridService.columnFilter.bind(
      this,
      this.gridApi
    );
    this.agGridToolbar['filter'] = this._agGridService.filter.bind(
      this,
      this.gridApi
    );
    // this.agGridToolbar['saveTemplate'] = this.updateTemplate.bind(this);

    // this.agGridToolbar['saveAsTemplate'] = this.saveAsTemplate.bind(this,this.gridColumnApi,this.saveAsTemplateList);
    // this.agGridToolbar['deleteTemplate'] = this.deleteTemplate.bind(this);
    // this.agGridToolbar['resetTemplate'] = this.resetTemplate.bind(this);
    // this._utils.autosizeColumnsIfNeeded(this.gridApi);
    // this.gridApi.setSideBarVisible(true);
  }

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
    public dialog: MatDialog,
    public datePipe: DatePipe,private _agGridService:AgGridService,
  ) {
    this.userDetails = this._storage.getUserDetails();
    this.frameWorkComponent = {
      actionRenderer: AgGridMenuComponent,
    };
    this.frameWorkShoreComponent = {
      actionRenderer: AgGridMenuShoreComponent,
    };
  }

  onCellDoubleClicked(event: any): void {
    const instanceid=event.value
    if (event.colDef.field === 'serialNumber') {
      this.router.navigate([
        '/sire/piq-report/' + instanceid + '/' + EFormMode.VIEW,
      ]);
    }
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
      this.totalRowCount =
      this.rowData && this.rowData.length > 0 ? this.rowData.length : 0;
    });
  }

  deleteRowData(event: any) {
    const instanceid = event.serialNumber;
    const payload = { instanceid: instanceid };
    this.BudgetService.deleteRow(payload).subscribe((res: any) => {
      this._snackBarService.loadSnackBar(
        'Form Deleted Successfully',
        colorCodes.INFO
      );
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

  onFilterChanged() {
    this.totalRowCount = this.gridApi.getDisplayedRowCount();
  }
}
