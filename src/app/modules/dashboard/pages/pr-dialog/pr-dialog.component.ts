import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, SelectionChangedEvent } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { BudgetService } from '../../services/budget.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImageConfirmationDialogComponent } from '../image-confirmation-dialog/image-confirmation-dialog.component';

@Component({
  selector: 'app-pr-dialog',
  templateUrl: './pr-dialog.component.html',
  styleUrls: ['./pr-dialog.component.css'],
})
export class PrDialogComponent implements OnInit {
  getSelectedCheckListID: any[] = [];
  private gridApi!: GridApi;

  columnDefs: ColDef[] = [
    { field: 'chkid', headerName: 'CheckList ID' },
    { field: 'checklistname', headerName: 'CheckList Name' },
    { field: 'createduser', headerName: 'CheckList User' },
    { field: 'lastupdatedate', headerName: 'CheckList Date' },
  ];
  rowData: any = [];
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
    private dialogRef: MatDialogRef<PrDialogComponent>,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCheckListGridDatas();
  }
  onDialogClose(): void {
    this.dialogRef.close();
  }

  getCheckListGridDatas() {
    const payload = {
      chklisttype: 'SAF',
      chklistname: 'PIQ',
    };
    this.BudgetService.getPhotoRepGridList(payload).subscribe((res: any) => {
      let obj = res.response;
      this.rowData = obj;
      this.highlightRow();
    });
  }

  highlightRow() {
    setTimeout(() => {
      this.gridApi.forEachNode(function (node: any) {
        if (localStorage.getItem('getSelectedCheckListID')) {
          const getSelectedCheckList = localStorage.getItem(
            'getSelectedCheckListID'
          );
          const getSelectedChecked =
            getSelectedCheckList && getSelectedCheckList.length > 0
              ? JSON.parse(getSelectedCheckList)
              : [];

          if (getSelectedChecked && getSelectedChecked.length > 0) {
            getSelectedChecked.forEach((resp: any) => {
              if (node.data.chkid === resp) {
                node.setSelected(true);
              }
            });
          }
        }
      });
    }, 10);
  }

  onSelectedRowData(event: SelectionChangedEvent) {
    const getdata = event.api.getSelectedNodes();
    this.getSelectedCheckListID = getdata.map((node) => node.data.chkid);
    localStorage.setItem(
      'getSelectedCheckListID',
      JSON.stringify(this.getSelectedCheckListID)
    );
  }

  onCloseMarkClick(selectedChckID: any): void {
    const dialogRef = this.dialog.open(ImageConfirmationDialogComponent, {
      panelClass: 'confirm-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.getSelectedCheckListID.findIndex(
          (x: any) => x === selectedChckID
        );
        if (index !== -1) {
          this.getSelectedCheckListID.splice(index, 1);
          localStorage.setItem(
            'getSelectedCheckListID',
            JSON.stringify(this.getSelectedCheckListID)
          );
          this.gridApi.forEachNode((node: any) => {
            if (node.data.chkid === selectedChckID) {
              node.setSelected(false);
            }
          });
          this.highlightRow();
        }
      }
    });
  }

  ShowSelectedDatas() {
    this.dialogRef.close({
      getSelectedCheckListIDValue: this.getSelectedCheckListID,
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
}
