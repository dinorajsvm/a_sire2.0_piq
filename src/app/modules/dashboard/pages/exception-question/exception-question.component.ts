import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budget.service';
import {
  LicenseManager,
  RowGroupingDisplayType,
} from 'ag-grid-enterprise';
import { DefaultColDef } from 'src/app/core/constants';
import { ResetBtnRendererComponent } from '../renderer/resetBtn-renderer.component';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage/storage.service';
LicenseManager.setLicenseKey(
  'CompanyName=SOLVERMINDS SOLUTIONS AND TECHNOLOGIES PRIVATE LIMITED,LicensedGroup=SVM Solutions & Technologies Pte. Ltd,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=6,AssetReference=AG-033022,SupportServicesEnd=18_November_2023_[v2]_MTcwMDI2NTYwMDAwMA==55aa1a1d8528a024728210e6983fb1ea'
);
@Component({
  selector: 'app-exception-question',
  templateUrl: './exception-question.component.html',
  styleUrls: ['./exception-question.component.css'],
})
export class ExceptionQuestionComponent implements OnInit {
  public singleRowSelection: 'single' | 'multiple' = 'single';
  public userDetails: any;
  emptyRemark = '';
  public tooltipShowDelay = 0;
  getRowdataCount: any = [];
  totalRowCount = 0;
  columnDefs: any[] = [
    {
      headerName: 'Auto Sync',
      width: 100,
      field: 'autoSync',
      sortable: false,
      filter: false,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this),
      },
    },
    {
      field: 'subHeaders',
      headerName: 'Chapter',
      resizable: true,
      tooltipField: 'subHeaders',
    },
    {
      field: 'mainQuestion',
      headerName: 'Main Question',
      resizable: true,
      tooltipField: 'mainQuestion',
    },
    {
      field: 'subName',
      headerName: 'Sub Question',
      resizable: true,
      tooltipField: 'subName',
    },
    {
      field: 'presetValue',
      headerName: 'Preset Value',
      resizable: true,
      width: 150,
      tooltipField: 'presetValue',
    },
    {
      field: 'answer',
      headerName: 'Answer',
      resizable: true,
      width: 100,
      tooltipField: 'answer',
    },
    {
      field: 'remark',
      headerName: 'Remarks',
      editable: true,
      wrapText: true,
      cellEditor: 'agLargeTextCellEditor',
      cellEditorPopup: true,
      flex: 1,
      tooltipField: 'remark',
    },
  ];
  referenceNumber: any;
  frameworkComponents: any;
  rowData: any[] = [];
  private gridApi: any;
  defaultColDef = DefaultColDef;
  public groupDisplayType: RowGroupingDisplayType = 'groupRows';
  public rowGroupPanelShow: any = 'always';
  remarksCount: any;
  hideReqBtns: boolean = false;
  disableBtns: boolean = false;
  constructor(
    private BudgetService: BudgetService,
    private route: ActivatedRoute,
    private _storage: StorageService
  ) {
    this.frameworkComponents = {
      buttonRenderer: ResetBtnRendererComponent,
    };
  }

  ngOnInit(): void {
    this.userDetails = this._storage.getUserDetails();
    this.referenceNumber = this.route.snapshot.paramMap.get('id');
    if (this.route.snapshot.paramMap.get('type') == 'view') {
      this.disableBtns = true;
    }
    this.BudgetService.getEnableBtn().subscribe((res: any) => {
      this.disableBtns = res;
    });
    this.BudgetService.getEditVisible().subscribe((res: any) => {
      this.hideReqBtns = res;
    });
    this.BudgetService.getExceptionData().subscribe((data) => {
      this.rowData = data;
      this.totalRowCount =
        this.rowData && this.rowData.length > 0 ? this.rowData.length : 0;
      this.getRowdataCount =
        this.rowData && this.rowData.length > 0 ? this.rowData.length : 0;
      this.BudgetService.setExceptionGridData(this.getRowdataCount);
      if (this.rowData && this.rowData.length > 0) {
        this.BudgetService.setExceptionRowData(this.rowData);
      }
    });
    this.columnDefs[6].editable = !this.disableBtns;
    this.columnDefs[6].cellEditorPopup = !this.disableBtns;
    this.columnDefs[6].wrapText = !this.disableBtns;
    if (this.gridApi) {
      this.gridApi.setColumnDefs(this.columnDefs);
    }
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

  onCellClicked(event: any): void {
    if (
      !(event.colDef.field === 'autoSync' || event.colDef.field === 'remark')
    ) {
      event.data.tab = 1;
      this.BudgetService.setTabChangeData(event.data);
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.addEventListener(
      'filterChanged',
      this.onFilterChanged.bind(this)
    );
  }

  onFilterChanged() {
    this.totalRowCount = this.gridApi.getDisplayedRowCount();
  }
}
