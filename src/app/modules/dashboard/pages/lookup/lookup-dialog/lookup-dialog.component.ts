import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { BudgetService } from '../../../services/budget.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ButtonRendererComponent } from '../../renderer/button-renderer.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-lookup-dialog',
  templateUrl: './lookup-dialog.component.html',
  styleUrls: ['./lookup-dialog.component.css'],
  providers: [DatePipe],
})
export class LookupDialogComponent implements OnInit {
  getSelectedCheckListID: any[] = [];
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
      field: 'tse_visitid',
      headerName: 'Reference ID',
      width: 100,
      resizable: true,
    },
    {
      field: 'visitorname',
      headerName: 'Visitor Name',
      width: 100,
      resizable: true,
    },
    {
      field: 'visittypename',
      headerName: 'Visit Type',
      width: 100,
      resizable: true,
    },
    {
      field: 'visitfromdate',
      headerName: 'Visit From Date',
      width: 100,
      resizable: true,
    },
    {
      field: 'visittodate',
      headerName: 'Visit To Date',
      width: 100,
      resizable: true,
    },
    { field: 'rankname', headerName: 'Rank Name', width: 100, resizable: true },
    {
      field: 'plannedfromport',
      headerName: 'From Port',
      width: 100,
      resizable: true,
    },
    {
      field: 'plannedtoport',
      headerName: 'To Port',
      width: 100,
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
  };

  constructor(
    private BudgetService: BudgetService,
    private dialogRef: MatDialogRef<LookupDialogComponent>,
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

  getCheckListGridDatas() {
    const payload = {
      chklisttype: 'SAF',
      chklistname: 'PIQ',
    };
    this.BudgetService.getPhotoRepGridList(payload).subscribe((res: any) => {
      let obj = res.response;
      this.rowData = obj;
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  ngOnInit(): void {
    this.getLookUpVisit();
  }

  getLookUpVisit() {
    const locationCode = localStorage.getItem('locationCode');
    this.BudgetService.getLookupVisitData('SNDC').subscribe((data) => {
      const response = JSON.parse(data.response);
      response.forEach((res: any) => {
        res.visitfromdate = this.datePipe.transform(res.visitfromdate, 'dd-MMM-yyyy');
        res.visittodate = this.datePipe.transform(res.visittodate, 'dd-MMM-yyyy');
      });
      this.rowData = response;
    });
  }
}
