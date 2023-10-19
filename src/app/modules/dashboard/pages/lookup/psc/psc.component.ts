import { Component, Inject, OnInit } from '@angular/core';
import { ColDef, GridApi, RowClassRules } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { BudgetService } from '../../../services/budget.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ApplyRendererComponent } from '../../renderer/apply-btn.component';

@Component({
  selector: 'app-psc',
  templateUrl: './psc.component.html',
  styleUrls: ['./psc.component.css'],
  providers: [DatePipe],
})
export class PscComponent {
  getSelectedCheckListID: any[] = [];
  private gridApi!: GridApi;
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
      resizable: true,
      flex: 1,
    },
    {
      field: 'authoritycode',
      headerName: 'Authority',
      resizable: true,
      flex: 1,
    },
    {
      field: 'q156',
      headerName: 'Date of inspection',
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
      resizable: true,
      flex: 1,
    },
    {
      field: 'placecode',
      headerName: 'Country',
      resizable: true,
      flex: 1,
    },
    {
      field: 'isnon_nc_def_obs',
      headerName: 'Detention/Rejection',
      resizable: true,
      flex: 1,
      valueGetter: (params) => {
        return params.data.isnon_nc_def_obs === 'Y' ? 'Yes' : 'No';
      },
    },
    {
      field: 'deficiencycount',
      headerName: 'Primary finding count',
      resizable: true,
      flex: 1,
      valueGetter: (params) => {
        return params.data.deficiencycount === 1;
      },
    },
  ];
  syncData: any[] = [];
  rowData: any[] = [];

  public singleRowSelection: 'single' | 'multiple' = 'single';
  public multiRowSelection: 'single' | 'multiple' = 'multiple';
  apiResponse: any = [];
  public defaultColDef: any = {
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    enableRowGroup: true,
    sortable: true,
    cellStyle: (params: any) => {
      return { textAlign: typeof params.value === 'number' ? 'right' : 'left' };
    },
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
    private dialogRef: MatDialogRef<PscComponent>,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {
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

  changeToggle(event: any) {
    if (this.isChecked) {
      this.rowData = this.apiResponse.PSC;
    } else {
      this.rowData = this.apiResponse['Non-sPSC'];
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  ngOnInit(): void {
    this.getPscDetail();
  }

  getPscDetail() {
    this.BudgetService.getPscDetails('SNDC',
      this.data.referenceId,
      this.data.questionId
    ).subscribe((data) => {
      this.apiResponse = data.response;
      this.rowData = this.apiResponse.PSC;
    });
  }
}
