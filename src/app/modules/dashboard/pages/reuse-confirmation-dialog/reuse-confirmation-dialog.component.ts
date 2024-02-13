import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, RowGroupingDisplayType } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { AppService } from '../../services/app.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ButtonRendererComponent } from '../renderer/button-renderer.component';
import { CellStatus, DefaultColDef } from 'src/app/core/constants';
import { StorageService } from 'src/app/core/services/storage/storage.service';

@Component({
  selector: 'app-reuse-confirmation-dialog',
  templateUrl: './reuse-confirmation-dialog.component.html',
  styleUrls: ['./reuse-confirmation-dialog.component.css'],
})
export class ReuseConfirmationDialogComponent implements OnInit {
  private gridApi!: GridApi;
  frameworkComponents: any;
  userDetails: any;
  public tooltipShowDelay = 0;
  totalRowCount = 0;
  columnDefs: ColDef[] = [
    {
      field: 'instanceid',
      headerName: 'S.No',
      tooltipField: 'instanceid',
      flex: 1,
      resizable: true,
    },
    {
      field: 'refno',
      headerName: 'Ref.Id',
      tooltipField: 'refno',
      flex: 1,
      resizable: true,
    },
    {
      field: 'vessel',
      headerName: 'Vessel Name',
      tooltipField: 'vessel',
      flex: 1,
      resizable: true,
    },
    {
      field: 'cruser',
      headerName: 'Created User',
      tooltipField: 'cruser',
      flex: 1,
      resizable: true,
    },


    {
      field: 'crtime',
      headerName: 'Created Date',
      tooltipField: 'crtime',
      flex: 1,
      resizable: true,
    },

    {
      field: 'upuser',
      headerName: 'Updated User',
      tooltipField: 'upuser',
      flex: 1,
      resizable: true,
    },

    {
      field: 'uptime',
      headerName: 'Updated Date',
      tooltipField: 'uptime',
      flex: 1,
      resizable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      tooltipField: 'status',
      flex: 1,
      cellStyle: CellStatus,
      resizable: true,
    },
  ];
  rowData: any = [];
  instanceId = '';
  disableBtn = true;
  public rowSelection: 'single' | 'multiple' = 'single';

  defaultColDef = DefaultColDef;
  public groupDisplayType: RowGroupingDisplayType = 'groupRows';
  // public rowGroupPanelShow: any = 'always';

  constructor(
    private appServices: AppService,
    private dialogRef: MatDialogRef<ReuseConfirmationDialogComponent>,
    public dialog: MatDialog,
    private _storage: StorageService
  ) {
    this.userDetails = this._storage.getUserDetails();
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
  }

  onDialogClose(): void {
    this.dialogRef.close();
  }

  onSelectionChanged(event: any) {
    var selectedRows = this.gridApi.getSelectedRows();
    this.instanceId = selectedRows[0].instanceid;
    if (this.instanceId) {
      this.disableBtn = false;
    } else {
      this.disableBtn = true;
    }
  }
  onFilterChanged() {
    this.totalRowCount = this.gridApi.getDisplayedRowCount();
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  ngOnInit(): void {
    this.getReuseReferenceList();
  }

  onSubmit() {
    this.dialogRef.close(this.instanceId);
  }

  getReuseReferenceList() {
    this.appServices.getRefnImport(this.userDetails.userCode).subscribe(
      (data) => {
        this.rowData = data && data.response.length > 0 ? data.response : [];
        this.totalRowCount =
          this.rowData && this.rowData.length > 0 ? this.rowData.length : 0;
      }
    );
  }
}
