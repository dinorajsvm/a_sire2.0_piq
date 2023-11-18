import { Component, Inject, OnInit } from '@angular/core';
import {
  ColDef,
  GridApi,
  RowClassRules,
  StatusPanelDef,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { BudgetService } from '../../../services/budget.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ButtonRendererComponent } from '../../renderer/button-renderer.component';
import { DatePipe } from '@angular/common';
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
  providers: [DatePipe],
})
export class LookupDialogComponent implements OnInit {
  getSelectedCheckListID: any[] = [];
  private gridApi!: GridApi;
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
      flex: 1,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onShipBtnClick.bind(this),
      },
    },
    {
      field: 'refno',
      headerName: 'Reference ID',
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
      tooltipField: 'actualfromdate',
      flex: 1,
      resizable: true,
      valueGetter: (params) => {
        return params.data.actualfromdate
          ? this.datePipe.transform(params.data.actualfromdate, 'dd-MMM-yyyy')
          : '';
      },
    },
    {
      field: 'actualtodate',
      headerName: 'Actual To Date',
      tooltipField: 'actualtodate',
      flex: 1,
      resizable: true,
      valueGetter: (params) => {
        return params.data.actualtodate
          ? this.datePipe.transform(params.data.actualtodate, 'dd-MMM-yyyy')
          : '';
      },
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
      filter: false,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onInternalBtnClick.bind(this),
      },
    },
    {
      field: 'refno',
      headerName: 'Reference ID',
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
      tooltipField: 'auditfromdate',
      flex: 1,
      resizable: true,
      valueGetter: (params) => {
        return params.data.auditfromdate
          ? this.datePipe.transform(params.data.auditfromdate, 'dd-MMM-yyyy')
          : '';
      },
    },
    {
      field: 'audittodate',
      headerName: 'Audit To Date',
      tooltipField: 'audittodate',
      flex: 1,
      resizable: true,
      valueGetter: (params) => {
        return params.data.audittodate
          ? this.datePipe.transform(params.data.audittodate, 'dd-MMM-yyyy')
          : '';
      },
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
  rowShipData: any = [];
  rowInternalData: any = [];
  getRowDatas: any = [];
  isShowToggle = false;
  isOnlyShipVisit = false;
  isOnlyInterVisit = false;
  enableDiv: boolean = false;
  userDetails: any;
  public singleRowSelection: 'single' | 'multiple' = 'single';

  defaultColDef = DefaultColDef;
  public rowGroupPanelShow: any = 'always';
  public rowClassRules: RowClassRules = {
    // row style function
    'highlighted-row': (params) => {
      return params.data.highlight;
    },
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private BudgetService: BudgetService,
    private dialogRef: MatDialogRef<LookupDialogComponent>,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private _storage: StorageService,
    private _loaderService: LoaderService
  ) {
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
  }

  ngOnInit(): void {
    this.getLookUpVisit();
  }

  getLookUpVisit() {
    const vesselCode = localStorage.getItem('masterVesselCode');
    this.BudgetService.getLookupVisitData(
      vesselCode,
      this.data.referenceId,
      this.data.questionId
    ).subscribe((data) => {
      this.getRowDatas = data.response;
      if (this.data.qid === 'MQ6') {
        this.isShowToggle = false;
        this.isOnlyShipVisit = true;
        this.isOnlyInterVisit = false;
        this.enableDiv = true;
        this.rowShipData = this.getRowDatas.ShipVisit;
      } else if (this.data.qid === 'MQ20') {
        this.isOnlyShipVisit = false;
        this.isOnlyInterVisit = true;
        this.isShowToggle = true;
        this.isChecked = false;
        this.rowInternalData = this.getRowDatas.Internal;
      }
    });
  }

  changeToggle(chipType: string) {
    if (chipType === 'InternalAudit') {
      this.isChecked = false;
      this.isViewAll = false;
      this.isOnlyInterVisit = true;
      this.isOnlyShipVisit = false;
      this.rowInternalData = this.getRowDatas.Internal;
    } else if (chipType === 'ShipVisit') {
      this.isChecked = true;
      this.isViewAll = false;
      this.isOnlyShipVisit = true;
      this.isOnlyInterVisit = false;
      this.rowShipData = this.getRowDatas.ShipVisit;
    } else if (chipType === 'ViewAll') {
      this.isViewAll = true;
      this.isChecked = true;
      this.isOnlyInterVisit = true;
      this.isOnlyShipVisit = true;
      this.rowShipData = this.getRowDatas.ShipVisit;
      this.rowInternalData = this.getRowDatas.Internal;
    }
  }


  onCellClicked(event: any) {
    if (event.colDef.field === 'refno') {
      mdldmsnavigatenewtab('PIQ', 'MOC', event.data.refno, 'true', 'true');
      this._loaderService.loaderShow();
      setTimeout(() => {
        this._loaderService.loaderHide();
      }, 2500);
    }
  }
}
