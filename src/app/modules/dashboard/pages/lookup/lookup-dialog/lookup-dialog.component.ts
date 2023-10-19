import { Component, Inject, OnInit } from '@angular/core';
import { ColDef, GridApi, RowClassRules } from 'ag-grid-community';
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
  frameworkComponents: any;
  referenceId: any = '';
  columnDefs: ColDef[] = [
    {
      headerName: 'Auto Sync',
      floatingFilter: false,
      flex: 1,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      field: 'refno',
      headerName: 'Reference ID',
      flex: 1,
      resizable: true,
    },
    {
      field: 'companyname',
      headerName: 'Company Name',
      flex: 1,
      resizable: true,
    },
    {
      field: 'vesselname',
      headerName: 'Vessel Name',
      flex: 1,
      resizable: true,
    },
    {
      field: 'vsltype',
      headerName: 'Vessel Type',
      flex: 1,
      resizable: true,
    },
    {
      field: 'typeofvisit',
      headerName: 'Type Of Visit',
      flex: 1,
      resizable: true,
    },
    {
      field: 'actualfromdate',
      headerName: 'Actual From Date',
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
      flex: 1,
      resizable: true,
    },
    {
      field: 'toport',
      headerName: 'To Port',
      flex: 1,
      resizable: true,
    },
  ];
  internalColumnDefs: ColDef[] = [
    {
      headerName: 'Auto Sync',
      floatingFilter: false,
      flex: 1,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      field: 'refno',
      headerName: 'Reference ID',
      flex: 1,
      resizable: true,
    },
    {
      field: 'companyname',
      headerName: 'Company Name',
      flex: 1,
      resizable: true,
    },
    {
      field: 'vesselname',
      headerName: 'Vessel Name',
      flex: 1,
      resizable: true,
    },
    {
      field: 'instype',
      headerName: 'Inspection Type',
      flex: 1,
      resizable: true,
    },
    {
      field: 'typeofaudit',
      headerName: 'Type Of Audit',
      flex: 1,
      resizable: true,
    },
    {
      field: 'auditfromdate',
      headerName: 'Audit From Date',
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
      flex: 1,
      resizable: true,
    },
    {
      field: 'audittoport',
      headerName: 'To Port',
      flex: 1,
      resizable: true,
    },
  ];
  syncData: any[] = [];
  rowData: any = [];
  getRowDatas: any = [];
  isShowToggle = false;
  isOnlyShipVisit = false;
  public singleRowSelection: 'single' | 'multiple' = 'single';

  public defaultColDef: any = {
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    sortable: true,
    enableRowGroup: true,
    cellStyle: (params: any) => {
      return { textAlign: typeof params.value === 'number' ? 'right' : 'left' };
    }
  };
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
    private route: ActivatedRoute
  ) {
    this.referenceId = this.route.snapshot.paramMap.get('id');
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
  }

  onDialogClose(): void {
    this.dialogRef.close();
  }

  onBtnClick1(e: any) {
    this.syncData = e.rowData;
    this.dialogRef.close(e.rowData);
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  ngOnInit(): void {
    this.getLookUpVisit();
  }

  getLookUpVisit() {
    const locationCode = localStorage.getItem('locationCode');
    this.BudgetService.getLookupVisitData(
      'SNDC',
      this.data.referenceId,
      this.data.questionId
    ).subscribe((data) => {
      this.getRowDatas = data.response;
      if (this.data.qid === 'MQ6') {
        this.isShowToggle = false;
        this.isOnlyShipVisit = true;
        this.rowData = this.getRowDatas.ShipVisit;
      } else if (this.data.qid === 'MQ20') {
        this.isOnlyShipVisit = false;
        this.isShowToggle = true;
        this.isChecked = false;
        this.rowData = this.getRowDatas.Internal;
      }
    });
  }

  changeToggle(event: any) {
    if (this.isChecked) {
      this.isOnlyShipVisit = true;
      this.rowData = this.getRowDatas.ShipVisit;
    } else {
      this.isOnlyShipVisit = false;
      this.rowData = this.getRowDatas.Internal;
    }
  }
}
