import { Component, Inject } from '@angular/core';
import 'ag-grid-enterprise';
import { BudgetService } from '../../../services/budget.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AgGridCheckboxComponent } from '../../renderer/ag-grid-checkbox.component';
import { ColDef, LicenseManager, RowGroupingDisplayType, StatusPanelDef } from 'ag-grid-enterprise';
import { DefaultColDef } from 'src/app/core/constants';
import { StorageService } from 'src/app/core/services/storage/storage.service';
LicenseManager.setLicenseKey(
  'CompanyName=SOLVERMINDS SOLUTIONS AND TECHNOLOGIES PRIVATE LIMITED,LicensedGroup=SVM Solutions & Technologies Pte. Ltd,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=6,AssetReference=AG-033022,SupportServicesEnd=18_November_2023_[v2]_MTcwMDI2NTYwMDAwMA==55aa1a1d8528a024728210e6983fb1ea'
);
import { LoaderService } from 'src/app/core/services/utils/loader.service';
declare function mdldmsnavigatenewtab(
  params: any,
  params1: any,
  params2: any,
  params3: any,
  param4s: any
): any;
@Component({
  selector: 'app-moc',
  templateUrl: './moc.component.html',
  styleUrls: ['./moc.component.css'],
})
export class MocComponent {
  frameworkComponents: any;
  userDetails: any;
  public tooltipShowDelay = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private BudgetService: BudgetService,
    private dialogRef: MatDialogRef<MocComponent>,
    public dialog: MatDialog,
    public _storage: StorageService,
    private _loaderService: LoaderService
  ) {
    this.userDetails = this._storage.getUserDetails();
    this.frameworkComponents = {
      checkboxRenderer: AgGridCheckboxComponent,
    };
  }
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
  columnDefs: ColDef[] = [
    {
      headerName: 'Ref Id',
      field: 'mgcreferenceid',
      tooltipField: 'mgcreferenceid',
      flex: 1,
    },
    {
      headerName: 'Category Of Change',
      field: 'categoryofchange',
      tooltipField: 'categoryofchange',
      flex: 1,
    },
    { headerName: 'Rank', field: 'rank', tooltipField: 'rank', flex: 1 },
    {
      headerName: 'Orgianted By',
      field: 'orgiantedby',
      tooltipField: 'orgiantedby',
      flex: 1,
    },
    {
      headerName: '2.5.1.1',
      field: 'q136',
      flex: 1,
      cellRenderer: 'checkboxRenderer',
    },
    {
      headerName: '2.5.1.2',
      field: 'q139',
      flex: 1,
      cellRenderer: 'checkboxRenderer',
    },
    {
      headerName: '2.5.1.3',
      field: 'q142',
      flex: 1,
      cellRenderer: 'checkboxRenderer',
    },
    {
      headerName: '2.5.1.4',
      field: 'q145',
      flex: 1,
      cellRenderer: 'checkboxRenderer',
    },
  ];

  defaultColDef = DefaultColDef;
  public groupDisplayType: RowGroupingDisplayType = 'groupRows';
  public rowGroupPanelShow:any  = 'always';

  rowData = [];

  gridOptions = {
    onGridReady: (params: any) => {
      params.api.sizeColumnsToFit();
    },
  };

  applyMocDetails() {
    const response: any = [
      {
        qid: 'Q136',
        value: this.rowData.find((data: any) => data.q136 === true)?.['q136']
          ? true
          : false,
      },
      {
        qid: 'Q139',
        value: this.rowData.find((data: any) => data.q139 === true)?.['q139']
          ? true
          : false,
      },
      {
        qid: 'Q142',
        value: this.rowData.find((data: any) => data.q142 === true)?.['q142']
          ? true
          : false,
      },
      {
        qid: 'Q145',
        value: this.rowData.find((data: any) => data.q145 === true)?.['q145']
          ? true
          : false,
      },
    ];
    const responseDetails = {
      data: response,
      rowData: this.rowData,
    };
    this.dialogRef.close(responseDetails);
  }
  ngOnInit() {
    this.mocDetails();
  }

  mocDetails() {
    const vesselCode = localStorage.getItem('masterVesselCode');
    this.BudgetService.getMocDetails(
      vesselCode,
      this.data.referenceId,
      this.data.questionId
    ).subscribe((data) => {
      this.rowData = data.response;
    });
  }
  onDialogClose(): void {
    this.dialogRef.close();
  }

  onCellClicked(event: any) {
    if (event.colDef.field === 'mgcreferenceid') {
      mdldmsnavigatenewtab('PIQ', 'MOC', event.data.mgcreferenceid, 'true', 'true');
      this._loaderService.loaderShow();
      setTimeout(() => {
        this._loaderService.loaderHide();
      }, 2500);
    }
  }
}
