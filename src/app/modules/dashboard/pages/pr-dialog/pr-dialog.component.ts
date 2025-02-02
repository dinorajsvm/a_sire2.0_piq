import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, RowGroupingDisplayType, SelectionChangedEvent } from 'ag-grid-community';
import 'ag-grid-enterprise';
import { AppService } from '../../services/app.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImageConfirmationDialogComponent } from '../image-confirmation-dialog/image-confirmation-dialog.component';
import { DefaultColDef } from 'src/app/core/constants';

@Component({
  selector: 'app-pr-dialog',
  templateUrl: './pr-dialog.component.html',
  styleUrls: ['./pr-dialog.component.css'],
})
export class PrDialogComponent implements OnInit {
  getSelectedCheckListID: any[] = [];
  private gridApi!: GridApi;
  public tooltipShowDelay = 0;
  totalRowCount = 0;
  columnDefs: ColDef[] = [
    { field: 'chkid', headerName: 'Checklist ID', tooltipField: 'chkid' },
    {
      field: 'checklistname',
      headerName: 'Checklist Name',
      tooltipField: 'checklistname',
    },
    {
      field: 'createduser',
      headerName: 'Checklist User',
      tooltipField: 'createduser',
    },
    {
      field: 'lastupdatedate',
      headerName: 'Checklist Date',
      cellStyle: { textAlign: 'right' },
      tooltipField: 'lastupdatedate',
    },
  ];
  rowData: any = [];
  public multiRowSelection: 'single' | 'multiple' = 'multiple';
  defaultColDef = DefaultColDef;
  public groupDisplayType: RowGroupingDisplayType = 'groupRows';

  constructor(
    private appServices: AppService,
    private dialogRef: MatDialogRef<PrDialogComponent>,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCheckListGridDatas();
  }
  onDialogClose(): void {
    this.dialogRef.close();
  }
  
  closeDialog(event:any){
    event.preventDefault();
    event.stopPropagation();
    this.dialogRef.close();
  }
  getCheckListGridDatas() {
    const vesselCode = localStorage.getItem('masterVesselCode');
    const payload = {
      chklisttype: 'SAF',
      chklistname: 'PIQ',
      vesselcode:vesselCode
    };
    this.appServices.getPhotoRepGridList(payload).subscribe((res: any) => {
      let obj = res.response;
      this.rowData = obj;
      this.totalRowCount =
      this.rowData && this.rowData.length > 0 ? this.rowData.length : 0;
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
    if (this.getSelectedCheckListID && this.getSelectedCheckListID.length > 0) {
      this.dialogRef.close({
        getSelectedCheckListIDValue: this.getSelectedCheckListID,
      });
    } else {
      localStorage.removeItem('getSelectedCheckListID')
      this.dialogRef.close(false)
    }
  }
  onFilterChanged() {
    this.totalRowCount = this.gridApi.getDisplayedRowCount();
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
  }
}
