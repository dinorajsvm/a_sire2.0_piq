import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { BudgetService } from '../../services/budget.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ButtonRendererComponent } from '../renderer/button-renderer.component';
import { DefaultColDef } from 'src/app/core/constants';

@Component({
  selector: 'app-reuse-confirmation-dialog',
  templateUrl: './reuse-confirmation-dialog.component.html',
  styleUrls: ['./reuse-confirmation-dialog.component.css'],
})
export class ReuseConfirmationDialogComponent implements OnInit {
  private gridApi!: GridApi;
  frameworkComponents: any;
  public tooltipShowDelay = 0;
  columnDefs: ColDef[] = [
    {
      field: 'instanceid',
      headerName: 'Reference ID',
      tooltipField: 'instanceid',
      width: 300,
      resizable: true,
    },
  ];
  rowData: any = [];
  instanceId = '';
  disableBtn = true;
  public rowSelection: 'single' | 'multiple' = 'single';

  defaultColDef = DefaultColDef;

  constructor(
    private BudgetService: BudgetService,
    private dialogRef: MatDialogRef<ReuseConfirmationDialogComponent>,
    public dialog: MatDialog
  ) {
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
    this.BudgetService.getRefnImport().subscribe((data) => {
      this.rowData = data && data.response.length > 0 ? data.response : [];
    });
  }
}
