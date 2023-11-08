import { Component, Inject } from '@angular/core';
import { ColDef, GridApi, RowClassRules } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { BudgetService } from '../../../services/budget.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ButtonRendererComponent } from '../../renderer/button-renderer.component';
import { DefaultColDef } from 'src/app/core/constants';
import { StorageService } from 'src/app/core/services/storage/storage.service';
@Component({
  selector: 'app-pms-lookup',
  templateUrl: './pms-lookup.component.html',
  styleUrls: ['./pms-lookup.component.css'],
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
      tooltipField: 'pmsCode',
      flex: 1,
      resizable: true,
    },
    {
      field: 'compname',
      headerName: 'Component name',
      tooltipField: 'compname',
      flex: 1,
      resizable: true,
    },
    {
      field: 'jobname',
      headerName: 'Job Name',
      tooltipField: 'jobname',
      flex: 1,
      resizable: true,
    },
    {
      field: 'frequencytype',
      headerName: 'Frequency Type',
      tooltipField: 'frequencytype',
      flex: 1,
      resizable: true,
    },
    {
      field: 'frequency',
      headerName: 'Frequency',
      tooltipField: 'frequency',
      flex: 1,
      resizable: true,
    },
  ];
  syncData: any[] = [];
  rowData: any = [];

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
    private dialogRef: MatDialogRef<PmsLookupComponent>,
    public dialog: MatDialog,
    public _storage: StorageService
  ) {
    this.userDetails = this._storage.getUserDetails();
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
    const companyCode = this.userDetails.userData.mdata.appInfo.companyCode;
    const vesselCode = this.userDetails.userData.mdata.appInfo.vesselCode;
    this.BudgetService.getPMSLookupVisitData(
      companyCode,
      vesselCode,
      this.data.referenceId,
      this.data.questionId
    ).subscribe((data) => {
      const filterResponse = data.Response.find(
        (x: any) => x.compname === this.data.moduleName
      );
      filterResponse.jobList.forEach((res: any) => {
        res.pmsCode = filterResponse.pmscompcode;
      });
      this.rowData = [];
      this.rowData = filterResponse.jobList;
    });
  }
}
