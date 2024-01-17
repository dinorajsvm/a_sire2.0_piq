import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  GridOptions,
  RowGroupingDisplayType,
  SideBarDef,
} from 'ag-grid-community';
import { AgGridMenuComponent } from 'src/app/core/shared/ag-grid/ag-grid-menu.component';
import { BudgetService } from '../../services/budget.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import {
  CellStatus,
  DefaultColDef,
  EFormMode,
  colorCodes,
} from 'src/app/core/constants';
import { MatDialog } from '@angular/material/dialog';
import { VesselSelectionDialogComponent } from '../vessel-selection-dialog/vessel-selection-dialog.component';
import { AgGridService } from 'src/app/core/services/utils/ag-grid.service';
import { agGridTooltipComponent } from '../renderer/ag-grid-tooltip.component';

@Component({
  selector: 'app-piq-landing-page',
  templateUrl: './piq-landing-page.component.html',
  styleUrls: ['./piq-landing-page.component.css'],
})
export class PIQLandingPageComponent implements OnInit {
  frameWorkComponent: any;
  totalRowCount = 0;
  gridApi: any;
  agGridToolbar: any = {};
  saveAsTemplateList:any= [];
  selectedTemplateIndex:number = 0;
  shipColumnDefs: any[] = [
    {
      field: 'action',
      headerName: 'Action',
      pinned: 'left',
      sortable: false,
      filter: false,
      cellRenderer: 'actionRenderer',
      cellRendererParams: {
        innerRendererFramework: AgGridMenuComponent,
      },
    },
    {
      field: 'serialNumber',
      headerName: 'S.No',
      tooltipField: 'serialNumber',
    },
    {
      field: 'referenceNumber',
      headerName: 'Ref.Id',
      tooltipField: 'referenceNumber',
    },
    {
      field: 'companyName',
      headerName: 'Company Name',
      tooltipField: 'companyName',
    },
    {
      field: 'fleetname',
      headerName: 'Fleet Name',
      tooltipField: 'fleetName',
      cellStyle: { textalign: 'left' },
    },
    {
      field: 'vesselName',
      headerName: 'Vessel Name',
      tooltipField: 'vesselName',
      cellStyle: { textalign: 'left' },
    },
    {
      field: 'vesseltype',
      headerName: 'Vessel Type',
      tooltipField: 'vesseltype',
    },
    {
      field: 'flag',
      headerName: 'Flag Name',
      tooltipField: 'flag',
    },
    {
      field: 'createdBy',
      headerName: 'Created User',
      tooltipField: 'createdBy',
    },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      tooltipField: 'createdDate',
      cellStyle: { textAlign: 'right' },
    },
    {
      field: 'updatedBy',
      headerName: 'Updated User',
      tooltipField: 'updatedBy',
    },
    {
      field: 'updatedDate',
      headerName: 'Updated Date',
      tooltipField: 'updatedDate',
      cellStyle: { textAlign: 'right' },
    },
    {
      field: 'status',
      headerName: 'Status',
      cellStyle: CellStatus,
      tooltipField: 'status',
    },
  ];

  shoreColumnDefs: any[] = [
    {
      field: 'action',
      headerName: 'Action',
      pinned: 'left',
      sortable: false,
      filter: false,
      cellRenderer: 'actionRenderer',
      cellRendererParams: {
        innerRendererFramework: AgGridMenuComponent,
      },
    },
    {
      field: 'serialNumber',
      headerName: 'S.No',
      tooltipField: 'serialNumber',
    },
    {
      field: 'referenceNumber',
      headerName: 'Ref.Id',
      tooltipField: 'referenceNumber',
    },
    {
      field: 'companyName',
      headerName: 'Company Name',
      tooltipField: 'companyName',
    },
    {
      field: 'fleetname',
      headerName: 'Fleet Name',
      tooltipField: 'fleetname',
      cellStyle: { textalign: 'left' },
    },
    {
      field: 'vesselName',
      headerName: 'Vessel Name',
      tooltipField: 'vesselName',
      cellStyle: { textalign: 'left' },
    },
    {
      field: 'vesseltype',
      headerName: 'Vessel Type',
      tooltipField: 'vesseltype',
    },
    {
      field: 'flag',
      headerName: 'Flag Name',
      tooltipField: 'flag',
    },
    {
      field: 'createdBy',
      headerName: 'Created User',
      tooltipField: 'createdBy',
    },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      tooltipField: 'createdDate',
      cellStyle: { textAlign: 'right' },
    },
    {
      field: 'updatedBy',
      headerName: 'Updated User',
      tooltipField: 'updatedBy',
    },
    {
      field: 'updatedDate',
      headerName: 'Updated Date',
      tooltipField: 'updatedDate',
      cellStyle: { textAlign: 'right' },
    },
    {
      field: 'status',
      headerName: 'Status',
      cellStyle: CellStatus,
      tooltipField: 'status',
    },
  ];
  public defaultColDef: any = {
    resizable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    enableRowGroup: true,
    sortable: true,
    tooltipComponent: agGridTooltipComponent,
    cellStyle: (params: any) => {
      const value = params.value;
      if (!isNaN(Number(value))) {
        return { textAlign: 'right' };
      } else if (value instanceof Date && !isNaN(value.getTime())) {
        return { textAlign: 'right' };
      } else if (typeof value === 'string' && !isNaN(Number(value))) {
        return { textAlign: 'left' };
      } else {
        return { textAlign: 'left' };
      }
    },
  };


  public sideBar: SideBarDef | string | string[] | boolean | null = ['columns', 'filters'];
  sideBarDef = { 
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        minWidth: 225,
        width: 225,
        maxWidth: 225,
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
        toolPanelParams: {
          suppressExpandAll: true,
          suppressFilterSearch: true,
        },
      },
    ],
    position: 'right',
    defaultToolPanel: 'none',
    hiddenByDefault: true,
  };
  

  public groupDisplayType: RowGroupingDisplayType = 'groupRows';
  public rowGroupPanelShow: any = 'always';

  public gridOptions: GridOptions = {
    sideBar: null
  };
  gridColumnApi: any;
  getSubmitterRank: any;
  showStsBar=false;

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.openToolPanel(false);
    this.gridApi.addEventListener(
      'filterChanged',
      this.onFilterChanged.bind(this)
    );
    this.agGridToolbar['exportAsCSV'] = this._agGridService.exportAsCSV.bind(
      this,
      this.gridApi,
      'PIQ'
    );
    this.agGridToolbar['exportAsExcel'] =
      this._agGridService.exportAsExcel.bind(this, this.gridApi, 'PIQ');
    this.agGridToolbar['columnFilter'] = this._agGridService.columnFilter.bind(
      this,
      this.gridApi
    );
    this.agGridToolbar['saveTemplate'] = this.updateTemplate.bind(this);

    this.agGridToolbar['saveAsTemplate'] = this.saveAsTemplate.bind(this,
       this.gridColumnApi,
       this.saveAsTemplateList);
    this.agGridToolbar['deleteTemplate'] = this.deleteTemplate.bind(this);
    this.agGridToolbar['resetTemplate'] = this.resetTemplate.bind(this);
    this.agGridToolbar['filter'] = this._agGridService.filter.bind(
      this,
      this.gridApi
    );
    this.gridOptions.sideBar = null;
  }

  rowData: any[] = [];
  getRefNo: any;
  getRefNumber: any;
  userDetails: any;
  compVslCode: any;
  showNew: boolean = true;
  getWrkFlowUser: any;
  public tooltipShowDelay = 0;

  constructor(
    private router: Router,
    private BudgetService: BudgetService,
    private _snackBarService: SnackbarService,
    private _storage: StorageService,
    public dialog: MatDialog,
    private _agGridService: AgGridService
  ) {
    this.userDetails = this._storage.getUserDetails();
    this.frameWorkComponent = {
      actionRenderer: AgGridMenuComponent,
    };
  }

  getAgGridTemplate() {
    const payload = {
      "userCode": this.userDetails.userCode,
      "gridId": "",
    }
    this._agGridService.getTemplate(payload,(res: any) => {
      this.saveAsTemplateList=res.result;
      });
  }

  updateTemplate(data:any) {
    if(this.saveAsTemplateList.length==0) {
      this.saveAsTemplate(this.gridColumnApi,this.saveAsTemplateList);
    }
    else {
    const columnOrder = this.gridColumnApi.getColumnState();
    const currentItem = this.saveAsTemplateList[this.selectedTemplateIndex]
    const payload = {
      "userCode": this.userDetails.userCode,
      "name": currentItem.name,
      "gridId": currentItem.smGridId['gridId'],
      "template": JSON.stringify(columnOrder),
    }
    this._agGridService.updateTemplate(payload,(res:any) =>{
      if(res.success) {
        this.getAgGridTemplate()
      }
    });
  }
  }

  saveAsTemplate(gridColumnApi:any,saveAsList:any) {
    this._agGridService.saveAsTemplate(event,gridColumnApi,saveAsList,(res:any) =>{
      if(res.success) {
        this.getAgGridTemplate();
        this.selectedTemplateIndex = this.saveAsTemplateList.length;
      }
    })
  }

  deleteTemplate() {
    this.removeAgTemplate(this.saveAsTemplateList[this.selectedTemplateIndex]);
  }

  resetTemplate() {
    if(this.saveAsTemplateList.length) {
      const currentItem = this.saveAsTemplateList[0];
      this.selectAgTemplate(currentItem);
    }
    else {
      this.gridColumnApi.resetColumnState();
    }
    this._agGridService.columnFilter(this.gridApi);
  }

  selectAgTemplate(chip: any): void {
    const selectedIndex = this.saveAsTemplateList.indexOf(chip);
    this._agGridService.selectChip(selectedIndex, this.saveAsTemplateList, this.gridColumnApi, (index:number) => {
      this.selectedTemplateIndex = selectedIndex;
    });
  }

  removeAgTemplate(chip: any): void {
    const payload = {
        "userCode": this.userDetails.userCode,
      }
    this._agGridService.deleteTemplate(payload,(res:any) =>{
      if(res.success) {
        this.getAgGridTemplate();
      }
    });
  }

  onCellDoubleClicked(event: any): void {
    const instanceid = event.value;
    if (event.colDef.field === 'serialNumber') {
      this.router.navigate([
        '/sire/piq-report/' + instanceid + '/' + EFormMode.VIEW,
      ]);
    }
  }

  ngOnInit(): void {
    this.getworkflowStatus();
    this.router.navigate(['/sire/piq-landing']);
    this.getCodes();
    this.getLndPgDatas();
    this.BudgetService.getDeleteAction().subscribe((res) => {
      this.getLndPgDatas();
    });
  }

  viewForm(event: any) {
    const instanceid = event.serialNumber;
    this.router.navigate([
      '/sire/piq-report/' + instanceid + '/' + EFormMode.VIEW,
    ]);
  }

  getNewRef() {
    if (
      this.getWrkFlowUser == 'anyuser' ||
      this.getWrkFlowUser == this.userDetails.userData.mdata.appInfo.rankCode
    ) {
      const payload = {
        locationcode: this.compVslCode,
        user: this.userDetails?.userCode,
      };
      this.BudgetService.getNewRefNo(payload).subscribe((res: any) => {
        if (Object.keys(res).length != 0) {
          let refNo = res;
          const getRefNumber = res.response;
          this.getRefNo = refNo;
          localStorage.removeItem('getSelectedCheckListID');
          getRefNumber != ''
            ? this.router.navigate([
                '/sire/piq-report/' + getRefNumber + '/new',
              ])
            : '';
        } else {
          this._snackBarService.loadSnackBar(
            res.error.errorMessage,
            colorCodes.ERROR
          );
        }
      });
    } else {
      this._snackBarService.loadSnackBar(
        'You Do Not Have Access to Create a New Form',
        colorCodes.ERROR
      );
    }
  }

  getCodes() {
    if (this.userDetails?.cntrlType === 'CNT001') {
      this.compVslCode = this.userDetails.companyCode;
    } else if (this.userDetails?.cntrlType === 'CNT002') {
      this.compVslCode = this.userDetails.userData.mdata.appInfo.vesselCode;
    } else {
    }
  }

  getLndPgDatas() {
    const payload = {
      usercode: this.userDetails?.userCode,
    };
    this.BudgetService.getPIQLndPgDatas(payload).subscribe((res: any) => {
      let object = res.response;
      this.rowData = [];

      object.forEach((data: any) => {
        data.isView = true;
        let submitttedCheck = false;
        if (this.userDetails?.cntrlType === 'CNT001') {
          submitttedCheck = !(
            this.getSubmitterRank === '' || this.getSubmitterRank === undefined
          );
        }
        data.isEdit =
          this.userDetails?.cntrlType === 'CNT002'
            ? // If the user's control type is 'CNT002'
              ((data.status === 'Inprogress' || data.status === 'Reassigned') &&
                data.createdin === this.userDetails?.cntrlType) ||
              !(
                data.status === 'Submitted' ||
                data.status === 'Approved' ||
                ((data.status === 'Inprogress' ||
                  data.status === 'Reassigned') &&
                  data.createdin === 'CNT001')
              )
            : // If the user's control type is not 'CNT002'
            submitttedCheck
            ? // If submitttedCheck is true
              data.status === 'Inprogress' ||
              (data.status === 'Reassigned' &&
                data.createdin === this.userDetails?.cntrlType) ||
              !(
                data.status === 'Submitted' ||
                data.status === 'Approved' ||
                (data.status === 'Reassigned' && data.createdin === 'CNT002')
              )
            : // If submitttedCheck is false
              data.status === 'Inprogress' ||
              data.status === 'Submitted' ||
              !(data.status === 'Approved' || data.status === 'Reassigned');

        data.isDelete = data.status === 'Inprogress';
      });
      this.rowData = object;
      this.totalRowCount = object && object.length > 0 ? object.length : 0;
    });
  }

  deleteRowData(event: any) {
    const instanceid = event.serialNumber;
    const payload = { instanceid: instanceid };
    this.BudgetService.deleteRow(payload).subscribe((res: any) => {
      this._snackBarService.loadSnackBar(
        'Deleted Successfully',
        colorCodes.INFO
      );
      this.getLndPgDatas();
    });
  }

  getworkflowStatus() {
    this.BudgetService.getworkFlowStatus().subscribe((res: any) => {
      let val = res.workflowmaster;
      this.getSubmitterRank =
        val && val[0] && val[0].submitters
          ? val[0].submitters.find((x: any) => x === this.userDetails?.rankCode)
          : '';
      val.forEach((item: any) => {
        this.getWrkFlowUser = item.creater;
      });
    });
  }
  stsBarToggle(){
    this.showStsBar = !this.showStsBar
  }

  navigatePiq() {
    // this.BudgetService.setEnableBtn(false);
    this.dialog.open(VesselSelectionDialogComponent, {
      panelClass: 'vesselSelection-dialog-container',
    });
  }

  onFilterChanged() {
    this.totalRowCount = this.gridApi.getDisplayedRowCount();
  }
}
