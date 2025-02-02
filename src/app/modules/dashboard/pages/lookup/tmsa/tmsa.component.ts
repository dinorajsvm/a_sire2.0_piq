import { Component, Inject, OnInit } from '@angular/core';
import 'ag-grid-enterprise';
import { AppService } from '../../../services/app.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
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
})
export class TMSAComponent implements OnInit {
  private gridApi!: GridApi;
  gridInternalApi: any;
  gridExternalApi: any;
  gridShipApi: any;
  gridInternalROFApi: any;
  gridShipTSFApi: any;
  totalRowInternalCount = 0;
  totalRowExternalCount = 0;
  totalRowShipCount = 0;
  totalRowInternalROFCount = 0;
  totalRowShipTSFCount = 0;
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
  rowShipTSFData: any[] = [];
  rowInternalROFData: any[] = [];
  rowExternalData: any[] = [];
  resetBtn = false;
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
      field: 'sid',
      headerName: 'S.No',
      tooltipField: 'sid',
      flex: 1,
      resizable: true,
      cellStyle: {
        color: '#1d3557',
        'text-decoration': 'underline',
        'font-weight': 'bold',
        cursor: 'pointer',
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
    },
    {
      field: 'audittodate',
      headerName: 'Audit To Date',
      tooltipField: 'audittodate',
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
      field: 'sid',
      headerName: 'S.No',
      tooltipField: 'sid',
      flex: 1,
      resizable: true,
      cellStyle: {
        color: '#1d3557',
        'text-decoration': 'underline',
        'font-weight': 'bold',
        cursor: 'pointer',
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
    },
    {
      field: 'actualtodate',
      headerName: 'Actual To Date',
      tooltipField: 'actualtodate',
      cellStyle: { textAlign: 'right' },
      resizable: true,
      flex: 1,
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
      field: 'sid',
      headerName: 'S.No',
      tooltipField: 'sid',
      flex: 1,
      resizable: true,
      cellStyle: {
        color: '#1d3557',
        'text-decoration': 'underline',
        'font-weight': 'bold',
        cursor: 'pointer',
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
    private appServices: AppService,
    private dialogRef: MatDialogRef<TMSAComponent>,
    public dialog: MatDialog,
    private _storage: StorageService,
    private _loaderService: LoaderService
  ) {
    this.hideReqBtns = localStorage.getItem('setEditVisible') === 'true';
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
        if (chipType === 'External Inspection') {
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

  resetBtnEnable() {
    const rowShipDataFlag = this.rowShipData.find((x) => x.highlight);
    const rowInternalDataFlag = this.rowInternalData.find((y) => y.highlight);
    const rowShipTSFDataFlag = this.rowShipTSFData.find((x) => x.highlight);
    const rowInternalROFDataFlag = this.rowInternalROFData.find(
      (y) => y.highlight
    );
    const rowExternalDataFlag = this.rowExternalData.find((z) => z.highlight);
    this.resetBtn =
      rowExternalDataFlag ||
      rowInternalDataFlag ||
      rowShipDataFlag ||
      rowShipTSFDataFlag ||
      rowInternalROFDataFlag
        ? true
        : false;
  }

  onGridInternalReady(params: any) {
    this.gridInternalApi = params.api;
    this.gridInternalApi.addEventListener(
      'filterChanged',
      this.onFilterInternalChanged.bind(this)
    );
  }

  onGridShipTSFReady(params: any) {
    this.gridShipTSFApi = params.api;
    this.gridShipTSFApi.addEventListener(
      'filterChanged',
      this.onFilterShipTSFChanged.bind(this)
    );
  }

  onGridInternalROFReady(params: any) {
    this.gridInternalROFApi = params.api;
    this.gridInternalROFApi.addEventListener(
      'filterChanged',
      this.onFilterInternalROFChanged.bind(this)
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
    this.appServices
      .getLookupDetail(
        this.data.qid,
        vesselCode,
        this.data.questionId,
        this.data.referenceId
      )
      .subscribe((resp) => {
        this.apiResponse = resp.response;
        this.changeToggle('Internal Audit Report');
      });
  }

  showInternal() {
    this.isShowView = false;
    this.isShowShip = false;
    this.isShowExternal = false;
    this.isShowInternal = true;
    this.rowInternalData =
      this.apiResponse && this.apiResponse.Internal
        ? this.apiResponse.Internal
        : [];
    this.totalRowInternalCount =
      this.rowInternalData && this.rowInternalData.length > 0
        ? this.rowInternalData.length
        : 0;

    this.rowInternalROFData =
      this.apiResponse && this.apiResponse.ROF ? this.apiResponse.ROF : [];
    this.totalRowInternalROFCount =
      this.rowInternalROFData && this.rowInternalROFData.length > 0
        ? this.rowInternalROFData.length
        : 0;
    this.resetBtnEnable();
  }

  showShip() {
    this.isShowView = false;
    this.isShowExternal = false;
    this.isShowInternal = false;
    this.isShowShip = true;
    this.rowShipData =
      this.apiResponse && this.apiResponse.ShipVisit
        ? this.apiResponse.ShipVisit
        : [];
    this.totalRowShipCount =
      this.rowShipData && this.rowShipData.length > 0
        ? this.rowShipData.length
        : 0;
    this.rowShipTSFData =
      this.apiResponse && this.apiResponse.TSF ? this.apiResponse.TSF : [];
    this.totalRowShipTSFCount =
      this.rowShipTSFData && this.rowShipTSFData.length > 0
        ? this.rowShipTSFData.length
        : 0;
    this.resetBtnEnable();
  }
  showExternal() {
    this.isShowView = false;
    this.isShowInternal = false;
    this.isShowShip = false;
    this.isShowExternal = true;
    this.rowExternalData =
      this.apiResponse && this.apiResponse.External
        ? this.apiResponse.External
        : [];
    this.totalRowExternalCount =
      this.rowExternalData && this.rowExternalData.length > 0
        ? this.rowExternalData.length
        : 0;
    this.resetBtnEnable();
  }
  showView() {
    this.isShowView = true;
    this.isShowInternal = false;
    this.isShowShip = false;
    this.isShowExternal = false;
    this.rowExternalData =
      this.apiResponse && this.apiResponse.External
        ? this.apiResponse.External
        : [];
    this.rowInternalData =
      this.apiResponse && this.apiResponse.Internal
        ? this.apiResponse.Internal
        : [];

    this.rowInternalROFData =
      this.apiResponse && this.apiResponse.ROF ? this.apiResponse.ROF : [];

    this.rowShipData =
      this.apiResponse && this.apiResponse.ShipVisit
        ? this.apiResponse.ShipVisit
        : [];
    this.rowShipTSFData =
      this.apiResponse && this.apiResponse.TSF ? this.apiResponse.TSF : [];

    this.totalRowInternalCount =
      this.rowInternalData && this.rowInternalData.length > 0
        ? this.rowInternalData.length
        : 0;
    this.totalRowInternalROFCount =
      this.rowInternalROFData && this.rowInternalROFData.length > 0
        ? this.rowInternalROFData.length
        : 0;
    this.totalRowExternalCount =
      this.rowExternalData && this.rowExternalData.length > 0
        ? this.rowExternalData.length
        : 0;
    this.totalRowShipCount =
      this.rowShipData && this.rowShipData.length > 0
        ? this.rowShipData.length
        : 0;
    this.totalRowShipTSFCount =
      this.rowShipTSFData && this.rowShipTSFData.length > 0
        ? this.rowShipTSFData.length
        : 0;
    this.resetBtnEnable();
  }

  onReset() {
    this.dialogRef.close('Reset');
  }

  onCellClicked(event: any) {
    if (event.colDef.field === 'sid') {
      mdldmsnavigatenewtab(
        'PIQ',
        event.data.mdlcode,
        event.data.sid,
        'true',
        'true'
      );
      this._loaderService.loaderShow();
      setTimeout(() => {
        this._loaderService.loaderHide();
      }, 2500);
    }
  }

  onFilterInternalROFChanged() {
    this.totalRowInternalROFCount =
      this.gridInternalROFApi.getDisplayedRowCount();
  }

  onFilterInternalChanged() {
    this.totalRowInternalCount = this.gridInternalApi.getDisplayedRowCount();
  }

  onFilterExternalChanged() {
    this.totalRowExternalCount = this.gridExternalApi.getDisplayedRowCount();
  }

  onFilterShipTSFChanged() {
    this.totalRowShipTSFCount = this.gridShipTSFApi.getDisplayedRowCount();
  }

  onFilterShipChanged() {
    this.totalRowShipCount = this.gridShipApi.getDisplayedRowCount();
  }
}
