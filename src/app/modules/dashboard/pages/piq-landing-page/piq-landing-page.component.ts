import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  GridOptions,
  RowGroupingDisplayType,
  SideBarDef,
} from 'ag-grid-community';
import { AgGridMenuComponent } from 'src/app/core/shared/ag-grid/ag-grid-menu.component';
import { AppService } from '../../services/app.service';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { CellStatus, EFormMode, colorCodes } from 'src/app/core/constants';
import { MatDialog } from '@angular/material/dialog';
import { VesselSelectionDialogComponent } from '../vessel-selection-dialog/vessel-selection-dialog.component';
import { AgGridService } from 'src/app/core/services/utils/ag-grid.service';
import { agGridTooltipComponent } from '../renderer/ag-grid-tooltip.component';
import { DOCUMENT, DatePipe } from '@angular/common';
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
  isFullScreen = false;
  startDate: any;
  endDate: any;
  dateRangePicker!: FormGroup;
  documentElem: any;
  frameWorkComponent: any;
  totalRowCount = 0;
  gridApi: any;
  agGridToolbar: any = {};
  isCustomFilterApplied = false;
  saveAsTemplateList: any[] = [];
  selectedTemplateIndex = 0;
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
      comparotor: this.dateComparator.bind(this),
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
      comparotor: this.dateComparator.bind(this),
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
      comparotor: this.dateComparator.bind(this),
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
      comparotor: this.dateComparator.bind(this),
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
  Object: any;

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
    this.agGridToolbar['saveTemplate'] = this.updateTemplate.bind(this);

    this.agGridToolbar['saveAsTemplate'] = this.saveAsTemplate.bind(
      this,
      this.gridColumnApi,
      this.saveAsTemplateList
    );
    this.agGridToolbar['deleteTemplate'] = this.deleteTemplate.bind(this);
    this.agGridToolbar['filter'] = this._agGridService.filter.bind(
      this,
      this.gridApi
    );
    this.gridOptions.sideBar = null;
    this.getAgGridTemplate();
  }

  rowData: any[] = [];
  getRefNo: any;
  getRefNumber: any;
  userDetails: any;
  showNew: boolean = true;
  getWrkFlowUser: any;
  public tooltipShowDelay = 0;
  removable = true;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private appServices: AppService,
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
    this._agGridService.getTemplate((res: any) => {
      const saveAs = res.response;
      const keysArray = Object.keys(saveAs);
      let newArray: any = [];
      keysArray.forEach((key) => {
        const payLoadData = {
          [key]: saveAs[key],
        };
        newArray.push(payLoadData);
      });
      this.saveAsTemplateList = newArray && newArray.length > 0 ? newArray : [];
      this.selectedTemplateIndex =
        this.saveAsTemplateList.length < 2
          ? 0
          : this.saveAsTemplateList.length - 1;
      this.selectAgTemplate(
        this.saveAsTemplateList[this.selectedTemplateIndex]
      );
    });
  }

  updateTemplate(data: any) {
    if (this.saveAsTemplateList && this.saveAsTemplateList.length == 0) {
      this.saveAsTemplate(this.gridColumnApi, 1);
    } else {
      let payloadTemplate: any = {};

      const selectedCols = this.gridColumnApi.getColumnState();
      this.saveAsTemplateList[this.selectedTemplateIndex][
        this.selectedChip
      ].view = selectedCols;
      this.saveAsTemplateList.forEach((element: any) => {
        payloadTemplate[Object.keys(element)[0]] =
          element[Object.keys(element)[0]];
      });
      const payload = {
        usercode: this.userDetails.userCode,
        status: 'A',
        gridid: 'PIQ_SAMPLEGRID',
        template: payloadTemplate,
      };
      this._agGridService.updateTemplate(payload, (res: any) => {
        this.getAgGridTemplate();
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

  saveAsTemplate(gridColumnApi: any, id: any) {
    this._agGridService.saveAsTemplate(
      event,
      gridColumnApi,
      this.saveAsTemplateList,
      (res: any) => {
        this.getAgGridTemplate();
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
    'Last 365 days': [moment().subtract(365, 'days'), moment()],
    'Last 6 Months': [moment().subtract(6, 'month'), moment()],
    'Last 3 Months': [moment().subtract(3, 'month'), moment()],
    'Last 2 Months': [moment().subtract(2, 'month'), moment()],
    'Last Month': [moment().subtract(1, 'month'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last 30 Days': [moment().subtract(30, 'days'), moment()],
    'Last 7 Days': [moment().subtract(7, 'days'), moment()],
    Yesterday: [
      moment()
        .subtract(1, 'days')
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
      moment()
        .subtract(1, 'days')
        .set({ hour: 23, minute: 59, second: 59, millisecond: 999 }),
    ],
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

  dateRangeChanged(): void {
    this.startDate = this.datePipe.transform(
      this.selected.startDate,
      'dd-MMM-yyyy HH:mm'
    );

    this.endDate = this.datePipe.transform(
      this.selected.endDate,
      'dd-MMM-yyyy HH:mm'
    );

    this.startDate = this.startDate.split(' ')[0] + ' ' + '00:00';
    let givenDate = new Date(this.endDate);
    givenDate.setDate(givenDate.getDate() - 1);
    givenDate.setHours(23, 59, 0, 0);
    this.endDate = this.datePipe.transform(givenDate, 'dd-MMM-yyyy HH:mm');
  }

  deleteTemplate(chip: any) {
    chip = this.getFirstKey(chip);
    const index = this.saveAsTemplateList.findIndex((x: any) => {
      const findData = this.getFirstKey(x);
      return findData === chip;
    });
    this.saveAsTemplateList.splice(index, 1);
    let payloadTemplate: any = {};
    this.saveAsTemplateList.forEach((element: any) => {
      payloadTemplate[Object.keys(element)[0]] =
        element[Object.keys(element)[0]];
    });
    const payload = {
      usercode: this.userDetails.userCode,
      gridid: 'PIQ_SAMPLEGRID',
      template: payloadTemplate,
      status: 'A',
    };
    this._agGridService.deleteTemplate(payload, (res: any) => {
      this.getAgGridTemplate();
    });
  }

  getFirstKey(obj: any): string {
    if (obj) {
      return Object.keys(obj)[0];
    } else {
      return '';
    }
  }
  selectedChip = '';
  selectAgTemplate(chip: any): void {
    chip = this.getFirstKey(chip);
    this.selectedChip = chip;
    const selectedIndex = this.findIndexByIdentifier(chip);
    this.selectedTemplateIndex = selectedIndex;
    if (this.saveAsTemplateList && this.saveAsTemplateList.length > 0) {
      this.gridColumnApi.applyColumnState({
        state: this.saveAsTemplateList[selectedIndex][chip].view,
        applyOrder: true,
      });
    }
  }

  findIndexByIdentifier(identifier: string): number {
    for (let i = 0; i < this.saveAsTemplateList.length; i++) {
      const obj = this.saveAsTemplateList[i];
      if (identifier in obj) {
        return i;
      }
    }
    return -1;
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
    this.appServices.getDeleteAction().subscribe((res) => {
      this.getLndPgDatas();
    });
  }

  viewForm(event: any) {
    const instanceid = event.serialNumber;
    this.router.navigate([
      '/sire/piq-report/' + instanceid + '/' + EFormMode.VIEW,
    ]);
  }

  getLndPgDatas() {
    const payload = {
      usercode: this.userDetails?.userCode,
      from: this.startDate,
      to: this.endDate,
    };
    this.appServices.getPIQLndPgDatas(payload).subscribe((res: any) => {
      let object: any[] = res.response;
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
    this.appServices.deleteRow(payload).subscribe((res: any) => {
      this._snackBarService.loadSnackBar(
        'Deleted Successfully',
        colorCodes.INFO
      );
      this.getLndPgDatas();
    });
  }

  getworkflowStatus() {
    this.appServices.getworkFlowStatus().subscribe((res: any) => {
      let val = res && res.workflowmaster ? res.workflowmaster : [];
      this.getSubmitterRank =
        val && val[0] && val[0].submitters
          ? val[0].submitters.find((x: any) => x === this.userDetails?.rankCode)
          : '';
      val.forEach((item: any) => {
        this.getWrkFlowUser = item.creater;
      });
      this.getLndPgDatas();
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
    const newShoreColumnDefs = this.shoreColumnDefs.map((columnDef, index) => {
      return {
        ...columnDef,
        filter: 'agTextColumnFilter',
        floatingFilter: index ? true : false,
      };
    });

    const newShipColumnDefs = this.shipColumnDefs.map((columnDef, index) => {
      return {
        ...columnDef,
        filter: 'agTextColumnFilter',
        floatingFilter: index ? true : false,
      };
    });
    this.gridOpt.api.setColumnDefs(newShipColumnDefs);
    this.gridOpt.api.setColumnDefs(newShoreColumnDefs);
    this.gridOpt.api.refreshHeader();
  }

  reset() {
    const originalShoreColumnDefs = this.shoreColumnDefs;
    const originalShipColumnDefs = this.shipColumnDefs;
    originalShoreColumnDefs.forEach((shore: any, index: any) => {
      shore.hide = false;
      shore.pivot = false;
      shore.rowGroup = false;
      if (index) {
        shore.sortable = true;
        shore.floatingFilter = true;
      } else {
        shore.pinned = 'left';
        shore.sortable = false;
        shore.floatingFilter = false;
      }
    });
    originalShipColumnDefs.forEach((ship: any, index: any) => {
      ship.hide = false;
      ship.pivot = false;
      ship.rowGroup = false;
      if (index) {
        ship.sortable = true;
        ship.floatingFilter = true;
      } else {
        ship.pinned = 'left';
        ship.sortable = false;
        ship.floatingFilter = false;
      }
    });
    this.gridOpt.api.setColumnDefs(originalShoreColumnDefs);
    this.gridOpt.api.setColumnDefs(originalShipColumnDefs);
    this.gridOpt.api.refreshHeader();

    const payload = {
      usercode: this.userDetails.userCode,
      gridid: 'PIQ_SAMPLEGRID',
      template: {},
      status: 'A',
    };
    this._agGridService.resetTemplate(payload, (res: any) => {
      this.getAgGridTemplate();
    });
  }

  dateComparator(date1: string, date2: string): number {
    const date1Number = this.parseDate(date1);
    const date2Number = this.parseDate(date2);
    if (date1Number === null && date2Number === null) {
      return 0;
    }
    if (date1Number === null) {
      return -1;
    }
    if (date2Number === null) {
      return 1;
    }
    return date1Number - date2Number;
  }

  parseDate(dateStr: string) {
    const parsedDate = this.tryParseDate(
      dateStr,
      this.userDetails.dateFormat.split(' ')[0]
    );
    if (parsedDate) {
      return parsedDate;
    }
    return null;
  }

  tryParseDate(dateStr: string, format: string) {
    const parts = format.split(/[\.\-\/]/);
    const dateParts = dateStr.split(/[\.\-\/]/);
    const yearIndex = parts.findIndex((part) => part.toLowerCase() === 'yyyy');
    const monthIndex = parts.findIndex((part) => part.toLowerCase() === 'mm');
    const dayIndex = parts.findIndex((part) => part.toLowerCase() === 'dd');
    if (yearIndex === -1 || monthIndex === -1 || dayIndex === -1) {
      return null;
    }
    const year = parseInt(dateParts[yearIndex], 10);
    const month = parseInt(dateParts[monthIndex], 10) - 1; // Months are 0-based
    const day = parseInt(dateParts[dayIndex], 10);
    return year * 10000 + month * 100 + day;
  }
}
