import { Component, Inject, OnInit } from '@angular/core';
import { ColDef, GridApi, RowClassRules, StatusPanelDef } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { BudgetService } from '../../../services/budget.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
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
@Component({
  selector: 'app-psc',
  templateUrl: './psc.component.html',
  styleUrls: ['./psc.component.css'],
  providers: [DatePipe],
})
export class PscComponent {
  getSelectedCheckListID: any[] = [];
  private gridApi!: GridApi;
  public tooltipShowDelay = 0;
  isChecked = true;
  frameworkComponents: any;
  columnDefs: ColDef[] = [
    {
      headerName: 'Auto Sync',
      width: 100,
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
      field: 'authoritycode',
      headerName: 'Authority',
      tooltipField: 'authoritycode',
      resizable: true,
      flex: 1,
    },
    {
      field: 'q156',
      headerName: 'Date of inspection',
      tooltipField: 'q156',
      resizable: true,
      flex: 1,
      valueGetter: (params) => {
        return params.data.q156 === params.data.q156
          ? this.datePipe.transform(params.data.q156, 'dd-MMM-yyyy')
          : '';
      },
    },
    {
      field: 'inspectioncode',
      headerName: 'Type of inspection',
      tooltipField: 'inspectioncode',
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
      field: 'q160',
      headerName: 'Detention/Rejection',
      tooltipField: 'q160',
      resizable: true,
      flex: 1,
    },
    {
      field: 'primaryfinding',
      headerName: 'Primary finding count',
      tooltipField: 'primaryfinding',
      resizable: true,
      flex: 1,
    },
  ];
  public statusBar: {
    statusPanels: StatusPanelDef[];
  } = {
    statusPanels: [
      { statusPanel: 'agTotalRowCountComponent', align: 'right' },
      { statusPanel: 'agFilteredRowCountComponent' },
      { statusPanel: 'agSelectedRowCountComponent' },
      { statusPanel: 'agAggregationComponent' },
    ],
  };
  syncData: any[] = [];
  rowData: any[] = [];
  isViewAll = false;
  rowPscData: any[] = [];
  rowNonPscData: any[] = [];
  public singleRowSelection: 'single' | 'multiple' = 'single';
  public multiRowSelection: 'single' | 'multiple' = 'multiple';
  apiResponse: any = [];
  defaultColDef = DefaultColDef;
  public rowGroupPanelShow:any  = 'always';
  public rowClassRules: RowClassRules = {
    'highlighted-row': (params) => {
      return params.data.highlight;
    },
  };
  userDetails: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private BudgetService: BudgetService,
    private dialogRef: MatDialogRef<PscComponent>,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private _storage: StorageService,
    private _loaderService: LoaderService
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
    this.syncData = e.rowData;
    this.dialogRef.close(e.rowData);
  }

  changeToggle(chipType: string) {
    if (chipType === 'Suggested') {
      this.isChecked = false;
      this.isViewAll = false;
      this.rowData = this.apiResponse['Non-sPSC'];
    } else if (chipType === 'All Inspection') {
      this.isChecked = true;
      this.isViewAll = false;
      this.rowData = this.apiResponse.PSC;
    } else if (chipType === 'ViewAll') {
      this.isViewAll = true;
      this.isChecked = true;
      this.rowPscData = this.apiResponse.PSC;
      this.rowNonPscData = this.apiResponse['Non-sPSC'];
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  ngOnInit(): void {
    this.getPscDetail();
  }

  onReset() {
    this.dialogRef.close('Reset');
  }

  getPscDetail() {
    const vesselCode = localStorage.getItem('masterVesselCode');
    this.BudgetService.getPscDetails(
      vesselCode,
      this.data.referenceId,
      this.data.questionId
    ).subscribe((data) => {
      this.apiResponse = data.response;
      this.rowData = this.apiResponse.PSC;
    });
  }

  onCellClicked(event: any) {
    if (event.colDef.field === 'extrfid') {
      mdldmsnavigatenewtab('PIQ', 'EXT', event.data.extrfid, 'true', 'true');
      this._loaderService.loaderShow();
      setTimeout(() => {
        this._loaderService.loaderHide();
      }, 2500);
    }
  }
}
