import { Component, Inject } from '@angular/core';
import { ColDef, GridApi, RowClassRules } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { AppService } from '../../../services/app.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DefaultColDef } from 'src/app/core/constants';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { LoaderService } from 'src/app/core/services/utils/loader.service';
import { ButtonRendererComponent } from '../../renderer/button-renderer.component';

@Component({
  selector: 'app-pms-lookup',
  templateUrl: './pms-lookup.component.html',
  styleUrls: ['./pms-lookup.component.css'],
})
export class PmsLookupComponent {
  frameworkComponents: any;
  hideReqBtns: boolean = false;
  resetBtn = false;
  private gridApi!: GridApi;
  public tooltipShowDelay = 0;
  totalRowCount = 0;
  columnDefs: ColDef[] = [
    {
      headerName: 'Action',
      sortable: false,
      filter: false,
      hide: this.hideReqBtns,
      flex: 1,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onApplyBtn.bind(this),
      },
    },
    {
      field: 'compcode',
      headerName: 'PMS Component',
      tooltipField: 'compcode',
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
      field: 'dueDate',
      headerName: 'Job Date',
      tooltipField: 'dueDate',
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
  pmsCode: any;
  referenceId: any;
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
    private appServices: AppService,
    private dialogRef: MatDialogRef<PmsLookupComponent>,
    public dialog: MatDialog,
    public _storage: StorageService,
    public _loaderService: LoaderService
  ) {
    this.hideReqBtns = localStorage.getItem('setEditVisible') === 'true';
    this.userDetails = this._storage.getUserDetails();
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
  }

  onApplyBtn(e: any) {
    e.rowData.convertedFrequencyType =
      e && e.rowData && e.rowData.frequencytype === 'Month'
        ? e.rowData.frequency + ' months'
        : '';
    this.dialogRef.close(e.rowData);
  }
  onDialogClose(): void {
    this.dialogRef.close();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.addEventListener(
      'filterChanged',
      this.onFilterChanged.bind(this)
    );
  }

  ngOnInit(): void {
    this.getLookUpVisit();
    this.columnDefs[0].hide = this.hideReqBtns;
  }
  onFilterChanged() {
    this.totalRowCount = this.gridApi.getDisplayedRowCount();
  }

  getLookUpVisit() {
    const companyCode = this.userDetails.userData.mdata.appInfo.companyCode;
    const vesselCode = localStorage.getItem('masterVesselCode');
    this.appServices
      .getPMSLookupVisitData(
        companyCode,
        vesselCode,
        this.data.referenceId,
        this.data.questionId
      )
      .subscribe((data) => {
        const filterResponse = data.Response.find(
          (x: any) => x.compname === this.data.moduleName
        );
        this.rowData = [];
        this.rowData =
          filterResponse &&
          filterResponse.jobList &&
          filterResponse.jobList.length > 0
            ? filterResponse.jobList
            : [];
        this.totalRowCount =
          this.rowData && this.rowData.length > 0 ? this.rowData.length : 0;
        const rowDataFlag = this.rowData.find((x: any) => x.highlight);
        this.resetBtn = rowDataFlag ? true : false;
      });
  }

  onReset() {
    this.dialogRef.close('Reset');
  }
}
