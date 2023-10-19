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
  selector: 'app-manual-look-up',
  templateUrl: './manual-look-up.component.html',
  styleUrls: ['./manual-look-up.component.css'],
  providers: [DatePipe],
})
export class ManualLookUpComponent {
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    {
      field: 'refid',
      headerName: 'Reference ID',
      flex: 1,
      resizable: true,
    },
    {
      field: 'categoryname',
      headerName: 'Category Name',
      flex: 1,
      resizable: true,
    },
    {
      field: 'certificatename',
      headerName: 'Certificate Name',
      flex: 1,
      resizable: true,
    },
    {
      field: 'certificatenumber',
      headerName: 'Certificate Number',
      flex: 1,
      resizable: true,
    },
    {
      field: 'authorityname',
      headerName: 'Authority Name',
      flex: 1,
      resizable: true,
    },
    {
      field: 'dateofissue',
      headerName: 'Date Of Issue',
      flex: 1,
      resizable: true,
      valueGetter: (params) => {
        return params.data.dateofissue
          ? this.datePipe.transform(params.data.dateofissue, 'dd-MMM-yyyy')
          : '';
      },
    },
    {
      field: 'validfrom',
      headerName: 'Valid From',
      flex: 1,
      resizable: true,
      valueGetter: (params) => {
        return params.data.validfrom
          ? this.datePipe.transform(params.data.validfrom, 'dd-MMM-yyyy')
          : '';
      },
    },
    {
      field: 'validto',
      headerName: 'Valid To',
      flex: 1,
      resizable: true,
      valueGetter: (params) => {
        return params.data.validto
          ? this.datePipe.transform(params.data.validto, 'dd-MMM-yyyy')
          : '';
      },
    },
    {
      field: 'placeofissue',
      headerName: 'Place Of Issue',
      flex: 1,
      resizable: true,
    },
  ];
  rowData: any = [];

  public defaultColDef: any = {
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    sortable: true,
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private BudgetService: BudgetService,
    private dialogRef: MatDialogRef<ManualLookUpComponent>,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  onDialogClose(): void {
    this.dialogRef.close();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  ngOnInit(): void {
    this.getVesselCertificateLookupDetail();
  }
  getVesselCertificateLookupDetail() {
    this.BudgetService.getVesselCertificateLookup('sndc').subscribe(
      (data) => {
        this.rowData = data && data.response.length > 0 ? data.response : [];
      },
      (error) => {}
    );
  }
}