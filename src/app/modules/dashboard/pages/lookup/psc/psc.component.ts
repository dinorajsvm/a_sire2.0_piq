import { Component, Inject } from '@angular/core';
import {
  ColDef,
  GridApi,
  RowClassRules,
  RowGroupingDisplayType,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { AppService } from '../../../services/app.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ApplyRendererComponent } from '../../renderer/apply-btn.component';
import { DefaultColDef } from 'src/app/core/constants';
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
})
export class PscComponent {
  private gridApi!: GridApi;
  gridPSCApi: any;
  gridNonPSCApi: any;
  totalRowCount = 0;
  totalPSCRowCount = 0;
  totalNonPSCRowCount = 0;
  public tooltipShowDelay = 0;
  isChecked = true;
  frameworkComponents: any;
  resetBtn = false;
  columnDefs: ColDef[] = [
    {
      headerName: 'Auto Sync',
      width: 100,
      sortable: false,
      filter: false,
      hide: false,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      field: 'sid',
      headerName: 'S.No',
      tooltipField: 'sid',
      flex: 1,
      resizable: true,
      cellStyle: {
        color: '#1d3557',
        'text-decoration': 'underline',
        'font-weight': 'bold',
        cursor: 'pointer',
      },
    },
    {
      field: 'extrfid',
      headerName: 'Ref.Id',
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
      cellStyle: { textAlign: 'right' },
      tooltipField: 'q156',
      resizable: true,
      flex: 1,
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
  rowData: any[] = [];
  isViewAll = false;
  rowPscData: any[] = [];
  rowNonPscData: any[] = [];
  public multiRowSelection: 'single' | 'multiple' = 'multiple';
  apiResponse: any = [];
  defaultColDef = DefaultColDef;
  hideReqBtns: boolean = false;
  public groupDisplayType: RowGroupingDisplayType = 'groupRows';
  public rowClassRules: RowClassRules = {
    'highlighted-row': (params) => {
      return params.data.highlight;
    },
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appServices: AppService,
    private dialogRef: MatDialogRef<PscComponent>,
    public dialog: MatDialog,
    private _loaderService: LoaderService
  ) {
    this.hideReqBtns = localStorage.getItem('setEditVisible') === 'true';
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
  onFilterChanged() {
    this.totalRowCount = this.gridApi.getDisplayedRowCount();
  }
  onFilterPSCChanged() {
    this.totalPSCRowCount = this.gridPSCApi.getDisplayedRowCount();
  }
  onFilterNonPSCChanged() {
    this.totalNonPSCRowCount = this.gridNonPSCApi.getDisplayedRowCount();
  }
  changeToggle(chipType: string) {
    if (chipType === 'Suggested') {
      this.isChecked = false;
      this.isViewAll = false;
      this.rowData = this.apiResponse['PSC'];
    } else if (chipType === 'All Inspection') {
      this.isChecked = true;
      this.isViewAll = false;
      this.rowData = this.apiResponse['Non-sPSC'];
    } else if (chipType === 'ViewAll') {
      this.isViewAll = true;
      this.isChecked = true;
      this.rowPscData = this.apiResponse['Non-sPSC'];
      this.rowNonPscData = this.apiResponse['PSC'];
    }
    this.totalRowCount =
      this.rowData && this.rowData.length > 0 ? this.rowData.length : 0;
    this.totalPSCRowCount =
      this.rowPscData && this.rowPscData.length > 0
        ? this.rowPscData.length
        : 0;
    this.totalNonPSCRowCount =
      this.rowNonPscData && this.rowNonPscData.length > 0
        ? this.rowNonPscData.length
        : 0;
    const rowDataFlag =  this.rowData.find(x => x.highlight)
    const rowPscDataFlag =  this.rowPscData.find(y => y.highlight)
    const rowNonPscDataFlag =  this.rowNonPscData.find(z => z.highlight)
    this.resetBtn = rowNonPscDataFlag || rowPscDataFlag || rowDataFlag ? true : false;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.addEventListener(
      'filterChanged',
      this.onFilterChanged.bind(this)
    );
  }

  onGridPSCReady(params: any) {
    this.gridPSCApi = params.api;
    this.gridPSCApi.addEventListener(
      'filterChanged',
      this.onFilterPSCChanged.bind(this)
    );
  }
  onGridNonPSCReady(params: any) {
    this.gridNonPSCApi = params.api;
    this.gridNonPSCApi.addEventListener(
      'filterChanged',
      this.onFilterNonPSCChanged.bind(this)
    );
  }

  ngOnInit(): void {
    this.getPscDetail();
    this.columnDefs[0].hide = this.hideReqBtns;
  }

  onReset() {
    this.dialogRef.close('Reset');
  }

  getPscDetail() {
    const vesselCode = localStorage.getItem('masterVesselCode');
    this.appServices.getPscDetails(
      vesselCode,
      this.data.referenceId,
      this.data.questionId
    ).subscribe((data) => {
      this.apiResponse = data.response;
      this.changeToggle('All Inspection');
    });
  }

  onCellClicked(event: any) {
    if (event.colDef.field === 'sid') {
      mdldmsnavigatenewtab(
        'PIQ',
        event.data.mdlcode,
        event.data.sid,
        'true',
        'true'
      );
      this._loaderService.loaderShow();
      setTimeout(() => {
        this._loaderService.loaderHide();
      }, 2500);
    }
  }
}
