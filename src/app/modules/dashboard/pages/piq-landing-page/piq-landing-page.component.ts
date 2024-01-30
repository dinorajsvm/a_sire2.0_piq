import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
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
import { DOCUMENT, DatePipe } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { IFilterParams, ColDef, ISetFilterParams } from 'ag-grid-community';
import * as moment from 'moment';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from '@angular/material/core';
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: ['l'],
  },
  display: {
    dateInput: 'DD-MMM-YYYY', // Change the date input format
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-piq-landing-page',
  templateUrl: './piq-landing-page.component.html',
  styleUrls: ['./piq-landing-page.component.css'],
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class PIQLandingPageComponent implements OnInit {
  @ViewChild(DaterangepickerDirective, { static: false })
  pickerDirective!: DaterangepickerDirective;
  propsFormGroup!: FormGroup;

  startDate: any;
  endDate: any;
  dateRangePicker!: FormGroup;
  documentElem: any;
  frameWorkComponent: any;
  totalRowCount = 0;
  gridApi: any;
  agGridToolbar: any = {};
  isCustomFilterApplied = false;
  saveAsTemplateList: any = [];
  selectedTemplateIndex: number = 0;
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

  public sideBar: SideBarDef | string | string[] | boolean | null = [
    'columns',
    'filters',
  ];
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
    sideBar: null,
  };
  gridColumnApi: any;
  getSubmitterRank: any;
  showStsBar = false;
  currentStatusFilter: any;
  datas: any;
  submittedCount: any;
  approvedCount: any;
  inprogressCount: any;
  reassignedCount: any;
  actionCount: any;
  gridOpt: any;

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridOpt = this.gridOptions;
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
    // this.agGridToolbar['columnFilter'] = this._agGridService.columnFilter.bind(
    //   this,
    //   this.gridApi
    // );
    this.agGridToolbar['saveTemplate'] = this.updateTemplate.bind(this);

    this.agGridToolbar['saveAsTemplate'] = this.saveAsTemplate.bind(
      this,
      this.gridColumnApi,
      this.saveAsTemplateList
    );
    this.agGridToolbar['deleteTemplate'] = this.deleteTemplate.bind(this);
    // this.agGridToolbar['resetTemplate'] = this.resetTemplate.bind(this);
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
    private fb: FormBuilder,
    private router: Router,
    private BudgetService: BudgetService,
    private _snackBarService: SnackbarService,
    private _storage: StorageService,
    public dialog: MatDialog,
    private _agGridService: AgGridService,
    private datePipe: DatePipe,
    @Inject(DOCUMENT) private document: any
  ) {
    this.userDetails = this._storage.getUserDetails();
    this.frameWorkComponent = {
      actionRenderer: AgGridMenuComponent,
    };

    this.documentElem = document.documentElement;
    this.alwaysShowCalendars = true;
  }

  getAgGridTemplate() {
    const payload = {
      userCode: this.userDetails.userCode,
      gridId: '',
    };
    this._agGridService.getTemplate(payload, (res: any) => {
      this.saveAsTemplateList = res.result;
    });
  }

  updateTemplate(data: any) {
    if (this.saveAsTemplateList.length == 0) {
      this.saveAsTemplate(this.gridColumnApi, this.saveAsTemplateList);
    } else {
      const columnOrder = this.gridColumnApi.getColumnState();
      const currentItem = this.saveAsTemplateList[this.selectedTemplateIndex];
      const payload = {
        userCode: this.userDetails.userCode,
        name: currentItem.name,
        gridId: currentItem.smGridId['gridId'],
        template: JSON.stringify(columnOrder),
      };
      this._agGridService.updateTemplate(payload, (res: any) => {
        if (res.success) {
          this.getAgGridTemplate();
        }
      });
    }
  }

  updateStatusFilter(status: string): void {
    let action = document.getElementById('actionFilter');
    let chats = document.getElementById('chatsFilter');
    let notification = document.getElementById('notificationFilter');
    let inprogress = document.getElementById('inprogressFilter');
    let submitted = document.getElementById('submittedFilter');
    let reassign = document.getElementById('reassignedFilter');
    let approved = document.getElementById('approvedFilter');
    const currentFilterModel = this.gridApi.getFilterModel();
    const isFilterActive =
      currentFilterModel &&
      currentFilterModel.status &&
      currentFilterModel.status.type === 'contains';

    if (isFilterActive) {
      // if the filter has some value and changed to another value
      if (currentFilterModel.status.filter !== status) {
        const customFilterParams = {
          type: 'contains',
          filter: status,
        };
        this.gridApi.setFilterModel({ status: customFilterParams });
        if (status === 'My Actions') {
          action?.classList.add('showFilter');
          chats?.classList.remove('showFilter');
          notification?.classList.remove('showFilter');
          inprogress?.classList.remove('showFilter');
          submitted?.classList.remove('showFilter');
          reassign?.classList.remove('showFilter');
          approved?.classList.remove('showFilter');
        } else if (status === 'My Chats') {
          chats?.classList.add('showFilter');
          action?.classList.remove('showFilter');
          notification?.classList.remove('showFilter');
          inprogress?.classList.remove('showFilter');
          submitted?.classList.remove('showFilter');
          reassign?.classList.remove('showFilter');
          approved?.classList.remove('showFilter');
        } else if (status === 'My Notification') {
          notification?.classList.add('showFilter');
          chats?.classList.remove('showFilter');
          action?.classList.remove('showFilter');
          inprogress?.classList.remove('showFilter');
          submitted?.classList.remove('showFilter');
          reassign?.classList.remove('showFilter');
          approved?.classList.remove('showFilter');
        } else if (status === 'Inprogress') {
          inprogress?.classList.add('showFilter');
          chats?.classList.remove('showFilter');
          notification?.classList.remove('showFilter');
          action?.classList.remove('showFilter');
          submitted?.classList.remove('showFilter');
          reassign?.classList.remove('showFilter');
          approved?.classList.remove('showFilter');
        } else if (status === 'Submitted') {
          submitted?.classList.add('showFilter');
          chats?.classList.remove('showFilter');
          notification?.classList.remove('showFilter');
          action?.classList.remove('showFilter');
          inprogress?.classList.remove('showFilter');
          reassign?.classList.remove('showFilter');
          approved?.classList.remove('showFilter');
        } else if (status === 'Reassigned') {
          reassign?.classList.add('showFilter');
          chats?.classList.remove('showFilter');
          notification?.classList.remove('showFilter');
          inprogress?.classList.remove('showFilter');
          action?.classList.remove('showFilter');
          submitted?.classList.remove('showFilter');
          approved?.classList.remove('showFilter');
        } else if (status === 'Approved') {
          approved?.classList.add('showFilter');
          chats?.classList.remove('showFilter');
          notification?.classList.remove('showFilter');
          inprogress?.classList.remove('showFilter');
          submitted?.classList.remove('showFilter');
          action?.classList.remove('showFilter');
          reassign?.classList.remove('showFilter');
        } else {
          approved?.classList.remove('showFilter');
          chats?.classList.remove('showFilter');
          notification?.classList.remove('showFilter');
          inprogress?.classList.remove('showFilter');
          submitted?.classList.remove('showFilter');
          reassign?.classList.remove('showFilter');
          action?.classList.remove('showFilter');
        }
      } else {
        // if the filter has same value
        this.gridApi.setFilterModel(null);
        approved?.classList.remove('showFilter');
        chats?.classList.remove('showFilter');
        notification?.classList.remove('showFilter');
        inprogress?.classList.remove('showFilter');
        submitted?.classList.remove('showFilter');
        reassign?.classList.remove('showFilter');
        action?.classList.remove('showFilter');
      }
    } else {
      // if the filter has no value
      const customFilterParams = {
        type: 'contains',
        filter: status,
      };
      this.gridApi.setFilterModel({ status: customFilterParams });
      if (status === 'My Actions') {
        action?.classList.add('showFilter');
        chats?.classList.remove('showFilter');
        notification?.classList.remove('showFilter');
        inprogress?.classList.remove('showFilter');
        submitted?.classList.remove('showFilter');
        reassign?.classList.remove('showFilter');
        approved?.classList.remove('showFilter');
      } else if (status === 'My Chats') {
        chats?.classList.add('showFilter');
        action?.classList.remove('showFilter');
        notification?.classList.remove('showFilter');
        inprogress?.classList.remove('showFilter');
        submitted?.classList.remove('showFilter');
        reassign?.classList.remove('showFilter');
        approved?.classList.remove('showFilter');
      } else if (status === 'My Notification') {
        notification?.classList.add('showFilter');
        chats?.classList.remove('showFilter');
        action?.classList.remove('showFilter');
        inprogress?.classList.remove('showFilter');
        submitted?.classList.remove('showFilter');
        reassign?.classList.remove('showFilter');
        approved?.classList.remove('showFilter');
      } else if (status === 'Inprogress') {
        inprogress?.classList.add('showFilter');
        chats?.classList.remove('showFilter');
        notification?.classList.remove('showFilter');
        action?.classList.remove('showFilter');
        submitted?.classList.remove('showFilter');
        reassign?.classList.remove('showFilter');
        approved?.classList.remove('showFilter');
      } else if (status === 'Submitted') {
        submitted?.classList.add('showFilter');
        chats?.classList.remove('showFilter');
        notification?.classList.remove('showFilter');
        action?.classList.remove('showFilter');
        inprogress?.classList.remove('showFilter');
        reassign?.classList.remove('showFilter');
        approved?.classList.remove('showFilter');
      } else if (status === 'Reassigned') {
        reassign?.classList.add('showFilter');
        chats?.classList.remove('showFilter');
        notification?.classList.remove('showFilter');
        inprogress?.classList.remove('showFilter');
        action?.classList.remove('showFilter');
        submitted?.classList.remove('showFilter');
        approved?.classList.remove('showFilter');
      } else if (status === 'Approved') {
        approved?.classList.add('showFilter');
        chats?.classList.remove('showFilter');
        notification?.classList.remove('showFilter');
        inprogress?.classList.remove('showFilter');
        submitted?.classList.remove('showFilter');
        action?.classList.remove('showFilter');
        reassign?.classList.remove('showFilter');
      } else {
        approved?.classList.remove('showFilter');
        chats?.classList.remove('showFilter');
        notification?.classList.remove('showFilter');
        inprogress?.classList.remove('showFilter');
        submitted?.classList.remove('showFilter');
        reassign?.classList.remove('showFilter');
        action?.classList.remove('showFilter');
      }
    }
    this.gridApi.onFilterChanged();
  }

  saveAsTemplate(gridColumnApi: any, saveAsList: any) {
    this._agGridService.saveAsTemplate(
      event,
      gridColumnApi,
      saveAsList,
      (res: any) => {
        if (res.success) {
          this.getAgGridTemplate();
          this.selectedTemplateIndex = this.saveAsTemplateList.length;
        }
      }
    );
  }

  // dateRangePicker start

  propsFormControlName!: string;
  isOptional = false;
  isIconCalendar = false;
  required = false;
  disabled = false;
  selected: any;
  outline = false;
  alwaysShowCalendars!: boolean;
  ranges: any = {
    'Last 6 years': [moment().subtract(6, 'year'), moment()],
    'Last 3 years': [moment().subtract(3, 'year'), moment()],
    'Last year': [moment().subtract(1, 'year'), moment()],
    'Last 365 days': [moment().subtract(364, 'days'), moment()],
    'Last 6 Months': [moment().subtract(6, 'month'), moment()],
    'Last 3 Months': [moment().subtract(3, 'month'), moment()],
    'Last 2 Months': [moment().subtract(2, 'month'), moment()],
    'Last Month': [moment().subtract(1, 'month'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last 30 Days': [moment().subtract(30, 'days'), moment()],
    'Last 7 Days': [moment().subtract(7, 'days'), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    Today: [moment(), moment()],
  };
  invalidDates: moment.Moment[] = [
    moment().add(2, 'days'),
    moment().add(3, 'days'),
    moment().add(5, 'days'),
  ];
  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some((d) => d.isSame(m, 'day'));
  };

  onResetDate(): void {
    this.propsFormGroup.patchValue({
      [this.propsFormControlName]: null,
    });
  }

  openDatepicker() {
    this.pickerDirective.open();
  }

  dateRangeChanged(event: any): void {
    this.startDate = this.datePipe.transform(
      this.selected.startDate,
      'dd-MMM-yyyy HH:mm'
    );
    this.endDate = this.datePipe.transform(
      this.selected.endDate,
      'dd-MMM-yyyy HH:mm'
    );
  }

  // dateRangePicker End

  deleteTemplate() {
    this.removeAgTemplate(this.saveAsTemplateList[this.selectedTemplateIndex]);
  }

  // resetTemplate() {
  //   if (this.saveAsTemplateList.length) {
  //     const currentItem = this.saveAsTemplateList[0];
  //     this.selectAgTemplate(currentItem);
  //   } else {
  //     this.gridColumnApi.resetColumnState();
  //   }
  //   this._agGridService.columnFilter(this.gridApi);
  // }

  selectAgTemplate(chip: any): void {
    const selectedIndex = this.saveAsTemplateList.indexOf(chip);
    this._agGridService.selectChip(
      selectedIndex,
      this.saveAsTemplateList,
      this.gridColumnApi,
      (index: number) => {
        this.selectedTemplateIndex = selectedIndex;
      }
    );
  }

  removeAgTemplate(chip: any): void {
    const payload = {
      userCode: this.userDetails.userCode,
    };
    this._agGridService.deleteTemplate(payload, (res: any) => {
      if (res.success) {
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
    this.dateRangePicker = this.fb.group({
      dateRangeField: [''],
    });
    this.selected = {
      startDate: moment().subtract(2, 'years'),
      endDate: moment(),
    };
    this.dateRangePicker.patchValue({
      dateRangeField: this.selected,
    });
    this.startDate = this.datePipe.transform(
      this.selected.startDate,
      'dd-MMM-yyyy HH:mm'
    );
    this.endDate = this.datePipe.transform(
      this.selected.endDate,
      'dd-MMM-yyyy HH:mm'
    );
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

  getCodes() {
    if (this.userDetails?.cntrlType === 'CNT001') {
      this.compVslCode = this.userDetails.companyCode;
    } else if (this.userDetails?.cntrlType === 'CNT002') {
      this.compVslCode = this.userDetails.userData.mdata.appInfo.vesselCode;
    }
  }

  getLndPgDatas() {
    const payload = {
      usercode: this.userDetails?.userCode,
      from: this.startDate,
      to: this.endDate,
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
      const submitted: any = object.filter((item: any) => {
        return item.status === 'Submitted';
      });
      this.submittedCount = submitted.length;

      const approved: any = object.filter((item: any) => {
        return item.status === 'Approved';
      });
      this.approvedCount = approved.length;

      const inprogress: any = object.filter((item: any) => {
        return item.status === 'Inprogress';
      });
      this.inprogressCount = inprogress.length;

      const reassigned: any = object.filter((item: any) => {
        return item.status === 'Reassigned';
      });
      this.reassignedCount = reassigned.length;

      const action: any = object.filter((item: any) => {
        return (
          item.isView === true && item.isEdit === true && item.isDelete === true
        );
      });
      this.actionCount = action.length;
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
  stsBarToggle() {
    this.showStsBar = !this.showStsBar;
  }

  navigatePiq() {
    this.dialog.open(VesselSelectionDialogComponent, {
      panelClass: 'vesselSelection-dialog-container',
    });
  }

  onFilterChanged() {
    this.totalRowCount = this.gridApi.getDisplayedRowCount();
  }

  columnFilter() {
    const newShoreColumnDefs = this.shoreColumnDefs.map((columnDef) => {
      return {
        ...columnDef,
        filter: false,
        floatingFilter: false,
      };
    });
    const newShipColumnDefs = this.shipColumnDefs.map((columnDef) => {
      return {
        ...columnDef,
        filter: false,
        floatingFilter: false,
      };
    });
    this.gridOpt.api.setColumnDefs(newShoreColumnDefs);
    this.gridOpt.api.setColumnDefs(newShipColumnDefs);
    this.gridOpt.api.refreshHeader();
  }

  filter() {
    const newShoreColumnDefs = this.shoreColumnDefs.map((columnDef) => {
      return {
        ...columnDef,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
      };
    });

    const newShipColumnDefs = this.shipColumnDefs.map((columnDef) => {
      return {
        ...columnDef,
        filter: 'agTextColumnFilter',
        floatingFilter: true,
      };
    });
    this.gridOpt.api.setColumnDefs(newShipColumnDefs);
    this.gridOpt.api.setColumnDefs(newShoreColumnDefs);
    this.gridOpt.api.refreshHeader();
  }

  reset() {
    const originalShoreColumnDefs = this.shoreColumnDefs;
    const originalShipColumnDefs = this.shipColumnDefs;
    this.gridOpt.api.setColumnDefs(originalShoreColumnDefs);
    this.gridOpt.api.setColumnDefs(originalShipColumnDefs);
    this.gridOpt.api.refreshHeader();
  }
}
