import { Component, OnInit, Inject } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { BudgetService } from '../../../services/budget.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ButtonRendererComponent } from '../../renderer/button-renderer.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pms-lookup',
  templateUrl: './pms-lookup.component.html',
  styleUrls: ['./pms-lookup.component.css'],
  providers: [DatePipe],
})
export class PmsLookupComponent {
  private gridApi!: GridApi;

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
      field: 'pmsCode',
      headerName: 'PMS Component',
      flex: 1,
      resizable: true,
    },
    {
      field: 'jobname',
      headerName: 'Job Name',
      flex: 1,
      resizable: true,
    },
    {
      field: 'frequencytype',
      headerName: 'Frequency Type',
      flex: 1,
      resizable: true,
    },
    {
      field: 'frequency',
      headerName: 'Frequency',
      flex: 1,
      resizable: true,
    },
  ];
  syncData: any[] = [];
  rowData: any = [];

  public singleRowSelection: 'single' | 'multiple' = 'single';
  public multiRowSelection: 'single' | 'multiple' = 'multiple';

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private BudgetService: BudgetService,
    private dialogRef: MatDialogRef<PmsLookupComponent>,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {
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
  pmsCode: any;
  getLookUpVisit() {
    const locationCode = localStorage.getItem('locationCode');
    this.BudgetService.getPMSLookupVisitData('nyksg').subscribe((data) => {
      const filterResponse = data.Response.find(
        (x: any) => x.compname === this.data
      );
      filterResponse.jobList.forEach((res: any) => {
        res.pmsCode = filterResponse.pmscompcode;
      });
      this.rowData = filterResponse.jobList;
    });
  }
}
