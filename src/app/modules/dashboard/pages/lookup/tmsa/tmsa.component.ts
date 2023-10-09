import { Component, Inject, Input } from '@angular/core';
import 'ag-grid-enterprise';
import { BudgetService } from '../../../services/budget.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AgGridCheckboxComponent } from '../../renderer/ag-grid-checkbox.component';
import { ColDef, GridApi, LicenseManager } from 'ag-grid-enterprise';
import { ApplyRendererComponent } from '../../renderer/apply-btn.component';
import { DialogData } from 'src/app/core/modules/mack/utilities/chat-dialog/chat-dialog.component';
LicenseManager.setLicenseKey(
  'CompanyName=SOLVERMINDS SOLUTIONS AND TECHNOLOGIES PRIVATE LIMITED,LicensedGroup=SVM Solutions & Technologies Pte. Ltd,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=6,AssetReference=AG-033022,SupportServicesEnd=18_November_2023_[v2]_MTcwMDI2NTYwMDAwMA==55aa1a1d8528a024728210e6983fb1ea'
);
@Component({
  selector: 'app-tmsa',
  templateUrl: './tmsa.component.html',
  styleUrls: ['./tmsa.component.css'],
  providers: [DatePipe],
})
export class TMSAComponent {
  getSelectedCheckListID: any[] = [];
  private gridApi!: GridApi;
  isChecked = true;
  frameworkComponents: any;
  columnDefs: ColDef[] = [
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
      resizable: true,
      flex: 1,
    },
    {
      field: 'auditfromdate',
      headerName: 'Audit From Date',
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
      resizable: true,
      flex: 1,
      valueGetter: (params) => {
        return params.data.audittodate === params.data.audittodate
          ? this.datePipe.transform(params.data.audittodate, 'dd-MMM-yyyy')
          : '';
      },
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
      resizable: true,
      flex: 1,
    },
    {
      field: 'actualfromdate',
      headerName: 'Actual From Date',
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
      resizable: true,
      flex: 1,
      valueGetter: (params) => {
        return params.data.actualtodate === params.data.actualtodate
          ? this.datePipe.transform(params.data.actualtodate, 'dd-MMM-yyyy')
          : '';
      },
    },
  ];
  rowData: any[] = [];
  rowShipData: any[] = [];

  public singleRowSelection: 'single' | 'multiple' = 'single';
  public multiRowSelection: 'single' | 'multiple' = 'multiple';
  apiResponse: any = [];
  public defaultColDef: any = {
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    enableRowGroup: true,
    sortable: true,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,

    private BudgetService: BudgetService,
    private dialogRef: MatDialogRef<TMSAComponent>,
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
    this.dialogRef.close(e.rowData);
  }

  changeToggle(event: any) {
    if (this.isChecked) {
      this.rowData = this.apiResponse.Internal;
    } else {
      this.rowShipData = this.apiResponse.ShipVisit;
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
  ngOnInit(): void {
    this.getTmsaDetail();
  }

  getTmsaDetail() {
    console.log(this.data, 'data');

    this.BudgetService.get325Lookup(this.data, 'sndc').subscribe((resp) => {
      this.apiResponse = resp.response;
      this.rowData = resp.response.Internal;
      console.log(this.rowData, 'roedatra');
    });
  }
  gridOptions = {
    onGridReady: (params: any) => {
      params.api.sizeColumnsToFit();
    },
  };
}
