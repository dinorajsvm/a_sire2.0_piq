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
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      field: 'refno',
      headerName: 'Reference ID',
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
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      field: 'refno',
      headerName: 'Reference ID',
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
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      field: 'extrfid',
      headerName: 'Reference ID',
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
  public singleRowSelection: 'single' | 'multiple' = 'single';
  public multiRowSelection: 'single' | 'multiple' = 'multiple';
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
    private _storage: StorageService
  ) {
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
        } else {
          this.showInternal();
        }
      } else if (this.data.qid === '3.2.3' || this.data.qid === '3.2.4') {
        if (chipType === 'External Audit Report') {
          this.showExternal();
        } else if (chipType === 'ViewAll') {
          this.showView();
        } else {
          this.showInternal();
        }
      }
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
  ngOnInit(): void {
    this.getTmsaDetail();

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
  gridOptions = {
    onGridReady: (params: any) => {
      params.api.sizeColumnsToFit();
    },
  };

  showInternal() {
    this.isShowView = false;
    this.isShowShip = false;
    this.isShowExternal = false;
    this.isShowInternal = true;
    this.rowInternalData = this.apiResponse.Internal;
  }

  showShip() {
    this.isShowView = false;
    this.isShowExternal = false;
    this.isShowInternal = false;
    this.isShowShip = true;
    this.rowShipData = this.apiResponse.ShipVisit;
  }
  showExternal() {
    this.isShowView = false;
    this.isShowInternal = false;
    this.isShowShip = false;
    this.isShowExternal = true;
    this.rowExternalData = this.apiResponse.External;
  }
  showView() {
    this.isShowView = true;
    this.isShowInternal = false;
    this.isShowShip = false;
    this.isShowExternal = false;
    this.rowExternalData = this.apiResponse.External;
    this.rowInternalData = this.apiResponse.Internal;
    this.rowShipData = this.apiResponse.ShipVisit;
  }

  onReset() {
    this.dialogRef.close('Reset');
  }

}
