import { Component, Inject, OnInit } from '@angular/core';
import {
  ColDef,
  GridApi,
  RowClassRules,
  RowGroupingDisplayType,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { AppService } from '../../../services/app.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ButtonRendererComponent } from '../../renderer/button-renderer.component';
import { ActivatedRoute } from '@angular/router';
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
@Component({
  selector: 'app-lookup-dialog',
  templateUrl: './lookup-dialog.component.html',
  styleUrls: ['./lookup-dialog.component.css'],
})
export class LookupDialogComponent implements OnInit {
  getSelectedCheckListID: any[] = [];
  hideReqBtns: boolean = false;
  private gridApi!: GridApi;
  private gridTSFApi!: GridApi;
  gridInternalApi: any;
  gridInternalROFApi: any;
  isChecked = false;
  isViewAll = false;
  frameworkComponents: any;
  public tooltipShowDelay = 0;
  referenceId: any = '';
  columnDefs: ColDef[] = [
    {
      headerName: 'Auto Sync',
      sortable: false,
      filter: false,
      hide: this.hideReqBtns,
      flex: 1,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onShipBtnClick.bind(this),
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
      flex: 1,
      resizable: true,
    },
    {
      field: 'companyname',
      headerName: 'Company Name',
      tooltipField: 'companyname',
      flex: 1,
      resizable: true,
    },
    {
      field: 'vesselname',
      headerName: 'Vessel Name',
      tooltipField: 'vesselname',
      flex: 1,
      resizable: true,
    },
    {
      field: 'vsltype',
      headerName: 'Vessel Type',
      tooltipField: 'vsltype',
      flex: 1,
      resizable: true,
    },
    {
      field: 'typeofvisit',
      headerName: 'Type Of Visit',
      tooltipField: 'typeofvisit',
      flex: 1,
      resizable: true,
    },
    {
      field: 'actualfromdate',
      headerName: 'Actual From Date',
      cellStyle: { textAlign: 'right' },
      tooltipField: 'actualfromdate',
      flex: 1,
      resizable: true,
    },
    {
      field: 'actualtodate',
      headerName: 'Actual To Date',
      cellStyle: { textAlign: 'right' },
      tooltipField: 'actualtodate',
      flex: 1,
      resizable: true,
    },
    {
      field: 'fromport',
      headerName: 'From Port',
      tooltipField: 'fromport',
      flex: 1,
      resizable: true,
    },
    {
      field: 'toport',
      headerName: 'To Port',
      tooltipField: 'toport',
      flex: 1,
      resizable: true,
    },
  ];

  internalColumnDefs: ColDef[] = [
    {
      headerName: 'Auto Sync',
      flex: 1,
      sortable: false,
      hide: this.hideReqBtns,
      filter: false,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onInternalBtnClick.bind(this),
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
      flex: 1,
      resizable: true,
    },
    {
      field: 'companyname',
      headerName: 'Company Name',
      tooltipField: 'companyname',
      flex: 1,
      resizable: true,
    },
    {
      field: 'vesselname',
      headerName: 'Vessel Name',
      tooltipField: 'vesselname',
      flex: 1,
      resizable: true,
    },
    {
      field: 'instype',
      headerName: 'Inspection Type',
      tooltipField: 'instype',
      flex: 1,
      resizable: true,
    },
    {
      field: 'typeofaudit',
      headerName: 'Type Of Audit',
      tooltipField: 'typeofaudit',
      flex: 1,
      resizable: true,
    },
    {
      field: 'auditfromdate',
      headerName: 'Audit From Date',
      cellStyle: { textAlign: 'right' },
      tooltipField: 'auditfromdate',
      flex: 1,
      resizable: true,
    },
    {
      field: 'audittodate',
      headerName: 'Audit To Date',
      cellStyle: { textAlign: 'right' },
      tooltipField: 'audittodate',
      flex: 1,
      resizable: true,
    },
    {
      field: 'auditfromport',
      headerName: 'From Port',
      tooltipField: 'auditfromport',
      flex: 1,
      resizable: true,
    },
    {
      field: 'audittoport',
      headerName: 'To Port',
      tooltipField: 'audittoport',
      flex: 1,
      resizable: true,
    },
  ];
  totalRowCount = 0;
  totalRowInternalData = 0;
  totalRowTSFCount = 0;
  totalRowInternalROFData = 0;
  rowShipData: any = [];
  rowInternalData: any = [];
  rowShipTSFData: any = [];
  rowInternalROFData: any = [];
  resetBtn = false;
  getRowDatas: any = [];
  isShowToggle = false;
  isOnlyShipVisit = false;
  isOnlyInterVisit = false;
  enableDiv: boolean = false;
  userDetails: any;
  suppressRowHoverHighlight = false;
  defaultColDef = DefaultColDef;
  public groupDisplayType: RowGroupingDisplayType = 'groupRows';
  public rowClassRules: RowClassRules = {
    'highlighted-row': (params) => {
      return params.data.highlight;
    },
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appServices: AppService,
    private dialogRef: MatDialogRef<LookupDialogComponent>,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private _storage: StorageService,
    private _loaderService: LoaderService
  ) {
    this.hideReqBtns = localStorage.getItem('setEditVisible') === 'true';
    this.userDetails = this._storage.getUserDetails();
    this.referenceId = this.route.snapshot.paramMap.get('id');
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
  }

  onDialogClose(): void {
    this.dialogRef.close();
  }

  onInternalBtnClick(e: any) {
    this.dialogRef.close(e.rowData);
  }

  onShipBtnClick(e: any) {
    this.dialogRef.close(e.rowData);
  }

  onReset() {
    this.dialogRef.close('Reset');
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.addEventListener(
      'filterChanged',
      this.onFilterChanged.bind(this)
    );
  }

  onGridTSFReady(params: any) {
    this.gridTSFApi = params.api;
    this.gridTSFApi.addEventListener(
      'filterChanged',
      this.onFilterChanged.bind(this)
    );
  }

  onGridReadyInternal(params: any) {
    this.gridInternalApi = params.api;
    this.gridInternalApi.addEventListener(
      'filterChanged',
      this.onFilterInternalChanged.bind(this)
    );
  }

  onGridROFReadyInternal(params: any) {
    this.gridInternalROFApi = params.api;
    this.gridInternalROFApi.addEventListener(
      'filterChanged',
      this.onFilterInternalChanged.bind(this)
    );
  }

  ngOnInit(): void {
    this.getLookUpVisit();
    this.columnDefs[0].hide = this.hideReqBtns;
    this.internalColumnDefs[0].hide = this.hideReqBtns;
  }

  getLookUpVisit() {
    const vesselCode = localStorage.getItem('masterVesselCode');
    this.appServices
      .getLookupVisitData(
        vesselCode,
        this.data.referenceId,
        this.data.questionId
      )
      .subscribe((data) => {
        this.getRowDatas = data.response;
        if (this.data.qid === 'MQ6') {
          this.isShowToggle = false;
          this.isOnlyShipVisit = true;
          this.isOnlyInterVisit = false;
          this.enableDiv = true;
          this.rowShipData = this.getRowDatas.ShipVisit;
          this.rowShipTSFData = this.getRowDatas.TSF;
        } else if (this.data.qid === 'MQ20') {
          this.isOnlyShipVisit = false;
          this.isOnlyInterVisit = true;
          this.isShowToggle = true;
          this.isChecked = false;
          this.rowInternalData = this.getRowDatas.Internal;
          this.rowInternalROFData = this.getRowDatas.ROF;
        }
        this.updateTotalCount();
      });
  }
  onFilterChanged() {
    this.totalRowCount = this.gridApi.getDisplayedRowCount();
  }

  onFilterTSFChanged() {
    this.totalRowTSFCount = this.gridTSFApi.getDisplayedRowCount();
  }

  onFilterInternalChanged() {
    this.totalRowInternalData = this.gridInternalApi.getDisplayedRowCount();
  }

  onFilterInternalROFChanged() {
    this.totalRowInternalROFData =
      this.gridInternalROFApi.getDisplayedRowCount();
  }
  changeToggle(chipType: string) {
    if (chipType === 'InternalAudit') {
      this.isChecked = false;
      this.isViewAll = false;
      this.isOnlyInterVisit = true;
      this.isOnlyShipVisit = false;
      this.rowInternalData = this.getRowDatas.Internal;
      this.rowInternalROFData = this.getRowDatas.ROF;
    } else if (chipType === 'ShipVisit') {
      this.isChecked = true;
      this.isViewAll = false;
      this.isOnlyShipVisit = true;
      this.isOnlyInterVisit = false;
      this.rowShipData = this.getRowDatas.ShipVisit;
      this.rowShipTSFData = this.getRowDatas.TSF;
    } else if (chipType === 'ViewAll') {
      this.isViewAll = true;
      this.isChecked = true;
      this.isOnlyInterVisit = true;
      this.isOnlyShipVisit = true;
      this.rowShipData = this.getRowDatas.ShipVisit;
      this.rowShipTSFData = this.getRowDatas.TSF;
      this.rowInternalData = this.getRowDatas.Internal;
      this.rowInternalROFData = this.getRowDatas.ROF;
    }
    this.updateTotalCount();
  }

  updateTotalCount() {
    this.totalRowCount =
      this.rowShipData && this.rowShipData.length > 0
        ? this.rowShipData.length
        : 0;
    this.totalRowTSFCount =
      this.rowShipTSFData && this.rowShipTSFData.length > 0
        ? this.rowShipTSFData.length
        : 0;
    this.totalRowInternalData =
      this.rowInternalData && this.rowInternalData.length > 0
        ? this.rowInternalData.length
        : 0;

    this.totalRowInternalROFData =
      this.rowInternalROFData && this.rowInternalROFData.length > 0
        ? this.rowInternalROFData.length
        : 0;
    const rowInternalROFDataFlag = this.rowInternalROFData.find(
      (w: any) => w.highlight
    );
    const rowDataFlag = this.rowShipData.find((x: any) => x.highlight);
    const rowPscDataFlag = this.rowShipTSFData.find((y: any) => y.highlight);
    const rowNonPscDataFlag = this.rowInternalData.find(
      (z: any) => z.highlight
    );
    this.resetBtn =
      rowNonPscDataFlag ||
      rowPscDataFlag ||
      rowDataFlag ||
      rowInternalROFDataFlag
        ? true
        : false;
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
}
