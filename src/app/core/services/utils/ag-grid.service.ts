import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Endpoints } from '../../mgntDBconstants';
import { ApiMethod, colorCodes } from '../../constants';
import { SaveAsTemplateComponent } from '../../shared/save-as-template/save-as-template.component';
import { HttpService } from '../http/http.service';
import { SnackbarService } from '../snackbar/snackbar.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AgGridService {
  dialogConfig = new MatDialogConfig();
  public userDetails: any;
  constructor(private _http: HttpService,
    public dialog: MatDialog,
    private _snackbar: SnackbarService,
    private _storage: StorageService,) {
    this.userDetails = this._storage.getUserDetails();
  }

  exportAsCSV(gridApi: any, fileName: any) {
    var api = gridApi,
      params = {
        allColumns: true,
        fileName: fileName + '.csv'
      };
    api.exportDataAsCsv(params);
  }

  exportAsExcel(gridApi: any, fileName: any) {
    var api = gridApi,
      params = {
        allColumns: true,
        fileName: fileName + '.xlsx'
      };
    api.exportDataAsCsv(params);
  }

  columnFilter(gridApi: any) {
    gridApi.aggFuncService.gridOptionsService.gridOptions.defaultColDef.filter = false;
    gridApi.aggFuncService.gridOptionsService.gridOptions.defaultColDef.floatingFilter = false;
    localStorage.setItem('gridChange', 'true');
    gridApi.refreshHeader();
  }
  filter(gridApi: any) {
    gridApi.gridOptionsWrapper.gridOptions.defaultColDef.filter = true;
    gridApi.gridOptionsWrapper.gridOptions.defaultColDef.floatingFilter = true;
    gridApi.refreshHeader();
  }

  getSidebarOption() {
    return {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressRowGroups: false,
            suppressValues: false,
          }
        }
      ],
      position: 'right',
      defaultToolPanel: 'columns',
      hiddenByDefault: true
    }
  }
  getTemplate(payloadData: any, successCallback: any) {
    this._http.requestCall(Endpoints.GET_TEMPLATE, ApiMethod.POST, payloadData).subscribe((res: any) => {
      successCallback(res);
    });
  }

  createTemplate(payloadData: any, successCallback: any) {
    this._http.requestCall(Endpoints.CREATE_TEMPLATE, ApiMethod.POST, payloadData).subscribe((res: any) => {
      this._snackbar.loadSnackBar(res.result.message, colorCodes.SUCCESS);
      successCallback(res);
    });
  }

  deleteTemplate(payloadData: any, successCallback: any) {
    this._http.requestCall(Endpoints.DELETE_TEMPLATE, ApiMethod.POST, payloadData).subscribe((res: any) => {
      this._snackbar.loadSnackBar(res.result.message, colorCodes.SUCCESS);
      successCallback(res);
    });
  }

  updateTemplate(payloadData: any, successCallback: any) {
    this._http.requestCall(Endpoints.UPDATE_TEMPLATE, ApiMethod.POST, payloadData).subscribe((res: any) => {
      this._snackbar.loadSnackBar(res.result.message, colorCodes.SUCCESS);
      successCallback(res);
    });
  }

  saveAsTemplate(gridType: any, gridColumnApi: any, saveAsTemplateList: any, closeCallback: any) {
    const columnOrder = gridColumnApi.getColumnState();
    this.dialogConfig.disableClose = false;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.width = '400px';
    this.dialogConfig.data = ''
    this.dialogConfig.panelClass= 'saveAsTemplate-dialog-container';
    const dialogRef = this.dialog.open(SaveAsTemplateComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        var saveAsItem = {
          templateName: result,
          data: columnOrder
        }
        const payload = {
          "userCode": this.userDetails?.userCode,
          "name": result,
          "gridId": "",
          "template": JSON.stringify(columnOrder),
          "gridType": gridType
        }
        this.createTemplate(payload, (res: any) => {
          if (res.success) {
            closeCallback(res);
          }
        });
      }
    });
  }

  selectChip(selectedIndex: any, saveAsTemplateList: any, gridColumnApi: any, callBack: any) {
    gridColumnApi.applyColumnState({
      state: JSON.parse(saveAsTemplateList[selectedIndex]['template']),
      applyOrder: true
    });
    callBack(selectedIndex);
  }
}
