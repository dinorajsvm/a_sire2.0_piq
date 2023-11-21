import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import { GridOptions, LicenseManager } from 'ag-grid-enterprise';
import { DefaultColDef, colorCodes } from 'src/app/core/constants';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { ResetBtnRendererComponent } from '../renderer/resetBtn-renderer.component';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { DatePipe } from '@angular/common';
LicenseManager.setLicenseKey(
  'CompanyName=SOLVERMINDS SOLUTIONS AND TECHNOLOGIES PRIVATE LIMITED,LicensedGroup=SVM Solutions & Technologies Pte. Ltd,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=6,AssetReference=AG-033022,SupportServicesEnd=18_November_2023_[v2]_MTcwMDI2NTYwMDAwMA==55aa1a1d8528a024728210e6983fb1ea'
);
@Component({
  selector: 'app-exception-question',
  templateUrl: './exception-question.component.html',
  styleUrls: ['./exception-question.component.css'],
  providers: [DatePipe],
})
export class ExceptionQuestionComponent implements OnInit {
  public singleRowSelection: 'single' | 'multiple' = 'single';
  public userDetails: any;
  emptyRemark = '';
  public tooltipShowDelay = 0;
  getRowdataCount: any = [];
  columnDefs: any[] = [
    {
      headerName: 'Auto Sync',
      width: 100,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    { field: 'subHeaders', headerName: 'Chapter', resizable: true },
    {
      field: 'mainQuestion',
      headerName: 'Main Question',
      resizable: true,
    },
    { field: 'subName', headerName: 'Sub Question', resizable: true },
    {
      field: 'presetValue',
      headerName: 'Preset Value',
      resizable: true,
      width: 150,
    },
    {
      field: 'answer',
      headerName: 'Answer',
      resizable: true,
      width: 100,
    },
    {
      field: 'remark',
      headerName: 'Remarks',
      editable: true,
      wrapText: true,
      cellEditor: 'agLargeTextCellEditor',
      cellEditorPopup: true,
   flex:1
    },
  ];
  referenceNumber: any;
  frameworkComponents: any;
  rowData: any[] = [];
  private gridApi: any;
  private gridColumnApi: any;
  defaultColDef = DefaultColDef;
  public rowGroupPanelShow:any  = 'always';
  remarksCount: any;
  constructor(
    private BudgetService: BudgetService,
    private _snackBarService: SnackbarService,
    private route: ActivatedRoute,
    private _storage: StorageService,
    private datePipe: DatePipe
  ) {
    this.frameworkComponents = {
      buttonRenderer: ResetBtnRendererComponent,
    };
  }

  ngOnInit(): void {
    this.userDetails = this._storage.getUserDetails();
    this.referenceNumber = this.route.snapshot.paramMap.get('id');
    this.BudgetService.getExceptionData().subscribe((data) => {
      this.rowData = data;
      this.getRowdataCount =
        this.rowData && this.rowData.length > 0 ? this.rowData.length : 0;
      this.BudgetService.setExceptionGridData(this.getRowdataCount);
      this.gridApi!.setRowData(this.rowData);
      if (this.rowData && this.rowData.length != 0) {
        this.BudgetService.setExceptionRowData(this.rowData);
          
      }
    });
  }

  onBtnClick1(e: any) {
    this.BudgetService.setExceptionResetData(e.rowData.qid);
    const objWithIdIndex = this.rowData.findIndex(
      (obj) => obj.qid === e.rowData.qid
    );
    if (objWithIdIndex > -1) {
      this.rowData.splice(objWithIdIndex, 1);
      this.gridApi!.setRowData(this.rowData);
    }
  }
  // onRowSelected(event: any) {
  //   const tab=1;
  //   this.BudgetService.setTabChangeData(tab);
  // }

  onCellClicked(event: any): void {
    // Assuming you have a unique identifier in your rowData
    const selectedItemId = event.data.subHeaders;
    const targetColumnName = 'subHeaders';
    console.log("event",selectedItemId);
    console.log("event1",event);
    if(event.colDef.field === targetColumnName){
      const tab=1;
      this.BudgetService.setTabChangeData(tab);
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onSubmit() {
    this.emptyRemark = this.rowData.find((x) => x.remark === '');
    if (this.emptyRemark) {
      this._snackBarService.loadSnackBar('Remark Mandatory', colorCodes.ERROR);
      return;
    }
    const payload = {
      instanceid: this.referenceNumber,
      user: this.userDetails?.userCode,
      exceptionjson: {
        response: this.rowData,
      },
    };
    this.BudgetService.setExceptionRowData(this.rowData);
    this.BudgetService.saveExceptionList(payload).subscribe((res) => {
      this._snackBarService.loadSnackBar('Saved Successfully', colorCodes.INFO);
    });
  }
}
