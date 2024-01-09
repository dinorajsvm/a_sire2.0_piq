import { Component, Inject, OnInit } from '@angular/core';
import { ColDef, GridApi, RowGroupingDisplayType } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { BudgetService } from '../../../services/budget.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DefaultColDef } from 'src/app/core/constants';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { LoaderService } from 'src/app/core/services/utils/loader.service';
declare function mdldmsnavigatenewtab(
  params: any,
  params1: any,
  params2: any,
  params3: any,
  param4s: any
): any;

@Component({
  selector: 'app-manual-look-up',
  templateUrl: './manual-look-up.component.html',
  styleUrls: ['./manual-look-up.component.css']
})
export class ManualLookUpComponent implements OnInit {
  private gridApi!: GridApi;
  public tooltipShowDelay = 0;
  totalRowCount = 0;
  columnDefs: ColDef[] = [
    {
      field: 'sid',
      headerName: 'S.No',
      tooltipField: 'sid',
      flex: 1,
      resizable: true,
      cellStyle: { 'color': '#1d3557', 'text-decoration':'underline','font-weight':'bold','cursor': 'pointer'},
    },
    {
      field: 'refid',
      headerName: 'Ref.Id',
      tooltipField: 'refid',
      flex: 1,
      resizable: true,
      cellRenderer: 'agGroupCellRenderer',
    },
    {
      field: 'categoryname',
      headerName: 'Category Name',
      tooltipField: 'categoryname',
      flex: 1,
      resizable: true,
    },
    {
      field: 'certificatename',
      headerName: 'Certificate Name',
      tooltipField: 'certificatename',
      flex: 1,
      resizable: true,
    },
    {
      field: 'certificatenumber',
      headerName: 'Certificate Number',
      tooltipField: 'certificatenumber',
      flex: 1,
      resizable: true,
    },
    {
      field: 'authorityname',
      headerName: 'Authority Name',
      tooltipField: 'authorityname',
      flex: 1,
      resizable: true,
    },
    {
      field: 'dateofissue',
      headerName: 'Date Of Issue',
      tooltipField: 'dateofissue',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      resizable: true,
    },
    {
      field: 'validfrom',
      headerName: 'Valid From',
      tooltipField: 'validfrom',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      resizable: true,
    },
    {
      field: 'validto',
      headerName: 'Valid To',
      tooltipField: 'validto',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      resizable: true,
    },
    {
      field: 'placeofissue',
      headerName: 'Place Of Issue',
      tooltipField: 'placeofissue',
      flex: 1,
      resizable: true,
    },
  ];

  rowData: any = [];
  userDetails: any;
  defaultColDef = DefaultColDef;
  public groupDisplayType: RowGroupingDisplayType = 'groupRows';
  // public rowGroupPanelShow:any  = 'always';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private BudgetService: BudgetService,
    private dialogRef: MatDialogRef<ManualLookUpComponent>,
    public dialog: MatDialog,
    private _storage: StorageService,
    private _loaderService: LoaderService
  ) {
    this.userDetails = this._storage.getUserDetails();
  }

  onDialogClose(): void {
    this.dialogRef.close();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.addEventListener('filterChanged', this.onFilterChanged.bind(this));
  }

  ngOnInit(): void {
    this.getVesselCertificateLookupDetail();
  }
  getVesselCertificateLookupDetail() {
    const vesselCode = localStorage.getItem('masterVesselCode');
    this.BudgetService.getVesselCertificateLookup(vesselCode).subscribe(
      (data) => {
        this.rowData =
          data && data.response && data.response.length > 0
            ? data.response
            : [];
            this.totalRowCount =
            this.rowData && this.rowData.length > 0 ? this.rowData.length : 0;
      },
      (error) => {}
    );
  }
  onFilterChanged() {
    this.totalRowCount = this.gridApi.getDisplayedRowCount();
  }
  onCellClicked(event: any) {
    if (event.colDef.field === 'sid') {      
      mdldmsnavigatenewtab('PIQ', event.data.mdlcode, event.data.sid, 'true', 'true');
      this._loaderService.loaderShow();
      setTimeout(() => {
        this._loaderService.loaderHide();
      }, 2500);
    }
  }
}
