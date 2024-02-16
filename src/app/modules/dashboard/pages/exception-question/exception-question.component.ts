import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppService } from '../../services/app.service';
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
  @Output() countEmit = new EventEmitter<any>();
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
      field: 'savedAnswer',
      headerName: 'Lookup Value',
      resizable: true,
      width: 150,
      tooltipField: 'savedAnswer',
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
  remarksCount: any;
  hideReqBtns: boolean = false;
  disableBtns: boolean = false;
  gridColumnApi: any;
  constructor(
    private appServices: AppService,
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
      localStorage.setItem('setDisable', 'true');
    } else {
      this.disableBtns = false;
    }
    this.appServices.getEnableBtn().subscribe((res: any) => {
      this.disableBtns = res;

      if (res && res == 'false') {
        localStorage.setItem('setDisable', res);
      }
    });
    this.appServices.getEditVisible().subscribe((res: any) => {
      this.disableBtns = res;
    });
    this.appServices.getExceptionData().subscribe((data) => {
      // data.forEach((response: any) => {
      //   // response.savedAnswer = response && response.presetValue ? '' : response.lookUpPresetValue;
      // })
      this.rowData = data;
      this.totalRowCount =
        this.rowData && this.rowData.length > 0 ? this.rowData.length : 0;
        this.countEmit.emit(this.rowData.length);
        this.gridApi!.setRowData(this.rowData);
      if (this.rowData && this.rowData.length > 0) {
        this.appServices.setExceptionRowData(this.rowData);
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
    this.appServices.setExceptionResetData(e.rowData);
    const objWithIdIndex = this.rowData.findIndex(
      (obj) => obj.guid.value === e.rowData.guid.value
    );
    if (objWithIdIndex > -1) {
      this.rowData.splice(objWithIdIndex, 1);
      this.countEmit.emit(this.rowData.length);
      this.gridApi!.setRowData(this.rowData);
      this.appServices.setExceptionData(this.rowData);
    }
  }
  onCellValueChanged(event: any) {
    this.appServices.setExceptionData(this.rowData);
  }
  onCellEditingStopped(event: any) {
    this.appServices.setExceptionData(this.rowData);
  }
  onCellClicked(event: any): void {
    if (
      !(event.colDef.field === 'autoSync' || event.colDef.field === 'remark')
    ) {
      event.data.tab = 1;
      this.appServices.setTabChangeData(event.data);
    }
  }

  onGridReady(params: any) {
    this.gridColumnApi = params.columnApi;
    this.appServices.getStatus().subscribe((res: any) => {
      const status = res;
      const rank = localStorage.getItem('AppRank');
      const origin = localStorage.getItem('Origination');
      if (
        this.gridColumnApi &&
        this.gridColumnApi.getColumn('remark') &&
        this.gridColumnApi.getColumn('remark').getColDef()
      ) {
        if (status != null || rank != null || origin != null) {
          if (
            this.route.snapshot.paramMap.get('type') == 'view' ||
            (this.userDetails?.cntrlType === 'CNT002' &&
              origin == 'CNT002' &&
              (status === 'Submitted' || status === 'Approved')) ||
            (this.userDetails?.cntrlType === 'CNT002' && origin == 'CNT001') ||
            (this.userDetails?.cntrlType === 'CNT001' &&
              origin == 'CNT001' &&
              this.userDetails.rankCode == rank &&
              (status === 'ReAssigned' || status === 'Approved')) ||
            (this.userDetails?.cntrlType === 'CNT001' &&
              origin == 'CNT001' &&
              this.userDetails.rankCode != rank &&
              (status === 'Submitted' || status === 'Approved')) ||
            (this.userDetails?.cntrlType === 'CNT001' &&
              origin == 'CNT002' &&
              this.userDetails.rankCode == rank &&
              (status === 'Approved' || status === 'ReAssigned'))
          ) {
            this.gridColumnApi.getColumn('remark').getColDef().editable = false;
          } else {
            this.gridColumnApi.getColumn('remark').getColDef().editable = true;
          }
        }
      }
    });

    this.gridApi = params.api;
    this.gridApi.addEventListener(
      'filterChanged',
      this.onFilterChanged.bind(this)
    );
  }

  onFilterChanged() {
    this.totalRowCount = this.gridApi.getDisplayedRowCount();
    this.countEmit.emit(this.rowData.length);
  }
}
