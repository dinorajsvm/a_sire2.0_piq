import { Component, Inject, OnInit } from '@angular/core';
import 'ag-grid-enterprise';
import { BudgetService } from '../../../services/budget.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import {
  ColDef,
  GridApi,
  LicenseManager,
  RowClassRules,
} from 'ag-grid-enterprise';
import { ApplyRendererComponent } from '../../renderer/apply-btn.component';
import { DefaultColDef } from 'src/app/core/constants';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { LoaderService } from 'src/app/core/services/utils/loader.service';
declare function mdldmsnavigatenewtab(
  params: any,
  params1: any,
  params2: any,
  params3: any,
  param4s: any
): any;
LicenseManager.setLicenseKey(
  'CompanyName=SOLVERMINDS SOLUTIONS AND TECHNOLOGIES PRIVATE LIMITED,LicensedGroup=SVM Solutions & Technologies Pte. Ltd,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=6,AssetReference=AG-033022,SupportServicesEnd=18_November_2023_[v2]_MTcwMDI2NTYwMDAwMA==55aa1a1d8528a024728210e6983fb1ea'
);
@Component({
  selector: 'app-tmsa',
  templateUrl: './tmsa.component.html',
  styleUrls: ['./tmsa.component.css'],
  providers: [DatePipe],
})
export class TMSAComponent implements OnInit {
  private gridApi!: GridApi;
  gridInternalApi: any;
  gridExternalApi: any;
  gridShipApi: any;
  totalRowInternalCount = 0;
  totalRowExternalCount = 0;
  totalRowShipCount = 0;
  isChecked = true;
  public tooltipShowDelay = 0;
  isShowInternalShip = false;
  isShowInternalExternal = false;
  frameworkComponents: any;
  isShowShip = false;
  isShowInternal = false;
  isShowExternal = false;
  isShowView = false;
  apiResponse: any = [];
  rowShipData: any[] = [];
  rowInternalData: any[] = [];
  rowExternalData: any[] = [];
  columnInternalDefs: ColDef[] = [
    {
      headerName: 'Auto Sync',
      flex: 1,
      sortable: false,
      filter: false,
      hide: false,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      field: 'refno',
      headerName: 'Ref.Id',
      tooltipField: 'refno',
      resizable: true,
      flex: 1,
    },

    {
      field: 'companyname',
      headerName: 'Company Name',
      tooltipField: 'companyname',
      resizable: true,
      flex: 1,
    },
    {
      field: 'vesselname',
      headerName: 'Vessel Name',
      tooltipField: 'vesselname',
      resizable: true,
      flex: 1,
    },
    {
      field: 'instype',
      headerName: 'Type Of Inspection',
      tooltipField: 'instype',
      resizable: true,
      flex: 1,
    },
    {
      field: 'auditfromport',
      headerName: 'Audit From Port',
      tooltipField: 'auditfromport',
      resizable: true,
      flex: 1,
    },
    {
      field: 'audittoport',
      headerName: 'Audit To Port',
      tooltipField: 'audittoport',
      resizable: true,
      flex: 1,
    },

    {
      field: 'typeofaudit',
      headerName: 'Type Of Audit',
      tooltipField: 'typeofaudit',
      resizable: true,
      flex: 1,
    },
    {
      field: 'auditfromdate',
      headerName: 'Audit From Date',
      tooltipField: 'auditfromdate',
      cellStyle: { textAlign: 'right' },
      resizable: true,
      flex: 1,
      valueGetter: (params) => {
        return params.data.auditfromdate === params.data.auditfromdate
          ? this.datePipe.transform(params.data.auditfromdate, 'dd-MMM-yyyy')
          : '';
      },
    },
    {
      field: 'audittodate',
      headerName: 'Audit To Date',
      tooltipField: 'audittodate',
      cellStyle: { textAlign: 'right' },
      resizable: true,
      flex: 1,
      valueGetter: (params) => {
        return params.data.audittodate === params.data.audittodate
          ? this.datePipe.transform(params.data.audittodate, 'dd-MMM-yyyy')
          : '';
      },
    },
    {
      field: 'remote',
      headerName: 'Remote',
      tooltipField: 'remote',
      resizable: true,
      flex: 1,
    },
  ];
  columnShipDefs: ColDef[] = [
    {
      headerName: 'Auto Sync',
      flex: 1,
      sortable: false,
      filter: false,
      hide: false,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      field: 'refno',
      headerName: 'Ref.Id',
      tooltipField: 'refno',
      resizable: true,
      flex: 1,
    },
    {
      field: 'companyname',
      headerName: 'Company Name',
      tooltipField: 'companyname',
      resizable: true,
      flex: 1,
    },
    {
      field: 'vesselname',
      headerName: 'Vessel Name',
      tooltipField: 'vesselname',
      resizable: true,
      flex: 1,
    },
    {
      field: 'vsltype',
      headerName: 'Vessel Type',
      tooltipField: 'vsltype',
      resizable: true,
      flex: 1,
    },
    {
      field: 'typeofvisit',
      headerName: 'Type Of Visit',
      tooltipField: 'typeofvisit',
      resizable: true,
      flex: 1,
    },
    {
      field: 'fromport',
      headerName: 'From Port',
      tooltipField: 'fromport',
      resizable: true,
      flex: 1,
    },
    {
      field: 'toport',
      headerName: 'To Port',
      tooltipField: 'toport',
      resizable: true,
      flex: 1,
    },
    {
      field: 'actualfromdate',
      headerName: 'Actual From Date',
      tooltipField: 'actualfromdate',
      cellStyle: { textAlign: 'right' },
      resizable: true,
      flex: 1,
      valueGetter: (params) => {
        return params.data.actualfromdate === params.data.actualfromdate
          ? this.datePipe.transform(params.data.actualfromdate, 'dd-MMM-yyyy')
          : '';
      },
    },
    {
      field: 'actualtodate',
      headerName: 'Actual To Date',
      tooltipField: 'actualtodate',
      cellStyle: { textAlign: 'right' },
      resizable: true,
      flex: 1,
      valueGetter: (params) => {
        return params.data.actualtodate === params.data.actualtodate
          ? this.datePipe.transform(params.data.actualtodate, 'dd-MMM-yyyy')
          : '';
      },
    },
  ];
  columnExternalDefs: ColDef[] = [
    {
      headerName: 'Auto Sync',
      flex: 1,
      hide: false,
      cellRenderer: 'buttonRenderer',
      sortable: false,
      filter: false,
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      field: 'extrfid',
      headerName: 'Ref.Id',
      tooltipField: 'extrfid',
      resizable: true,
      flex: 1,
    },
    {
      field: 'inspectioncode',
      headerName: 'Type Of Inspection',
      tooltipField: 'inspectioncode',
      resizable: true,
      flex: 1,
    },
    {
      field: 'authoritycode',
      headerName: 'Authority',
      tooltipField: 'authoritycode',
      resizable: true,
      flex: 1,
    },
    {
      field: 'inspectiondate',
      headerName: 'Date Of Inspection',
      tooltipField: 'inspectiondate',
      cellStyle: { textAlign: 'right' },
      resizable: true,
      flex: 1,
    },
    {
      field: 'remote',
      headerName: 'Remote',
      tooltipField: 'remote',
      resizable: true,
      flex: 1,
    },
    {
      field: 'viqversion',
      headerName: 'VIQ Version',
      tooltipField: 'viqversion',
      resizable: true,
      flex: 1,
    },
    {
      field: 'countrycode',
      headerName: 'Country',
      tooltipField: 'countrycode',
      resizable: true,
      flex: 1,
    },
    {
      field: 'detention',
      headerName: 'Detention/Rejection',
      tooltipField: 'detention',
      resizable: true,
      flex: 1,
      valueGetter: (params) => {
        return params.data.detention === 'Y' ? 'Yes' : 'No';
      },
    },
    {
      field: 'placetype',
      headerName: 'Place Of Inspection',
      tooltipField: 'placetype',
      resizable: true,
      flex: 1,
    },
  ];
  defaultColDef = DefaultColDef;
  public rowClassRules: RowClassRules = {
    'highlighted-row': (params) => {
      return params.data.highlight;
    },
  };
  userDetails: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private BudgetService: BudgetService,
    private dialogRef: MatDialogRef<TMSAComponent>,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private _storage: StorageService,
    private _loaderService: LoaderService
  ) {
    this.hideReqBtns =  localStorage.getItem('setEditVisible') === 'true';
    this.userDetails = this._storage.getUserDetails();
    this.frameworkComponents = {
      buttonRenderer: ApplyRendererComponent,
    };
  }

  onDialogClose(): void {
    this.dialogRef.close();
  }

  onBtnClick1(e: any) {
    this.dialogRef.close(e.rowData);
  }

  changeToggle(chipType: string) {
    if (this.data) {
      if (
        this.data.qid === '3.2.1' ||
        this.data.qid === '3.2.2' ||
        this.data.qid === '3.2.5' ||
        this.data.qid === '3.2.6' ||
        this.data.qid === '3.2.7'
      ) {
        if (chipType === 'Ship Visit Report') {
          this.showShip();
        } else if (chipType === 'ViewAll') {
          this.showView();
        } else if (chipType === 'Internal Audit Report') {
          this.showInternal();
        }
        this.isShowInternalShip = true;
        this.isShowInternalExternal = false;
      } else if (this.data.qid === '3.2.3' || this.data.qid === '3.2.4') {
        if (chipType === 'External Inspection Report') {
          this.showExternal();
        } else if (chipType === 'ViewAll') {
          this.showView();
        } else if (chipType === 'Internal Audit Report') {
          this.showInternal();
        }
        this.isShowInternalShip = false;
        this.isShowInternalExternal = true;
      }
    }
  }

  onGridInternalReady(params: any) {
    this.gridInternalApi = params.api;
    this.gridInternalApi.addEventListener(
      'filterChanged',
      this.onFilterInternalChanged.bind(this)
    );
  }

  onGridShipReady(params: any) {
    this.gridShipApi = params.api;
    this.gridShipApi.addEventListener(
      'filterChanged',
      this.onFilterShipChanged.bind(this)
    );
  }

  onGridExternalReady(params: any) {
    this.gridExternalApi = params.api;
    this.gridExternalApi.addEventListener(
      'filterChanged',
      this.onFilterExternalChanged.bind(this)
    );
  }
  hideReqBtns: boolean = false;
  ngOnInit(): void {
    this.getTmsaDetail();
    this.columnExternalDefs[0].hide = this.hideReqBtns;
    this.columnInternalDefs[0].hide = this.hideReqBtns;
    this.columnShipDefs[0].hide = this.hideReqBtns;
    if (
      this.data.qid === '3.2.1' ||
      this.data.qid === '3.2.2' ||
      this.data.qid === '3.2.5' ||
      this.data.qid === '3.2.6' ||
      this.data.qid === '3.2.7'
    ) {
      this.isShowInternalShip = true;
      this.isShowInternalExternal = false;
    } else {
      this.isShowInternalShip = false;
      this.isShowInternalExternal = true;
    }
  }

  getTmsaDetail() {
    const vesselCode = localStorage.getItem('masterVesselCode');
    this.BudgetService.getLookupDetail(
      this.data.qid,
      vesselCode,
      this.data.questionId,
      this.data.referenceId
    ).subscribe((resp) => {
      this.apiResponse = resp.response;
      this.showInternal();
    });
  }

  showInternal() {
    this.isShowView = false;
    this.isShowShip = false;
    this.isShowExternal = false;
    this.isShowInternal = true;
    this.rowInternalData = this.apiResponse.Internal;
    this.totalRowInternalCount =
    this.rowInternalData && this.rowInternalData.length > 0
    ? this.rowInternalData.length
    : 0;
  }

  showShip() {
    this.isShowView = false;
    this.isShowExternal = false;
    this.isShowInternal = false;
    this.isShowShip = true;
    this.rowShipData = this.apiResponse.ShipVisit;
    this.totalRowShipCount =
    this.rowShipData && this.rowShipData.length > 0
    ? this.rowShipData.length
    : 0;
  }
  showExternal() {
    this.isShowView = false;
    this.isShowInternal = false;
    this.isShowShip = false;
    this.isShowExternal = true;
    this.rowExternalData = this.apiResponse.External;
    this.totalRowExternalCount =
      this.rowExternalData && this.rowExternalData.length > 0
        ? this.rowExternalData.length
        : 0;
  }
  showView() {
    this.isShowView = true;
    this.isShowInternal = false;
    this.isShowShip = false;
    this.isShowExternal = false;
    this.rowExternalData = this.apiResponse.External;
    this.rowInternalData = this.apiResponse.Internal;
    this.rowShipData = this.apiResponse.ShipVisit;
    this.totalRowInternalCount =
    this.rowInternalData && this.rowInternalData.length > 0
    ? this.rowInternalData.length
    : 0;
    this.totalRowExternalCount =
    this.rowExternalData && this.rowExternalData.length > 0
    ? this.rowExternalData.length
    : 0;
    this.totalRowShipCount =
    this.rowShipData && this.rowShipData.length > 0
    ? this.rowShipData.length
    : 0;
  }

  onReset() {
    this.dialogRef.close('Reset');
  }

  onCellClicked(event: any) {
    if (event.colDef.field === 'refno') {
      mdldmsnavigatenewtab('PIQ', 'MOC', event.data.refno, 'true', 'true');
      this._loaderService.loaderShow();
      setTimeout(() => {
        this._loaderService.loaderHide();
      }, 2500);
    } else if (event.colDef.field === 'extrfid') {
      mdldmsnavigatenewtab('PIQ', 'MOC', event.data.extrfid, 'true', 'true');
      this._loaderService.loaderShow();
      setTimeout(() => {
        this._loaderService.loaderHide();
      }, 2500);
    }
  }

  onFilterInternalChanged() {
    this.totalRowInternalCount = this.gridInternalApi.getDisplayedRowCount();
  }

  onFilterExternalChanged() {
    this.totalRowExternalCount = this.gridExternalApi.getDisplayedRowCount();
  }

  onFilterShipChanged() {
    this.totalRowShipCount = this.gridShipApi.getDisplayedRowCount();
  }
}
