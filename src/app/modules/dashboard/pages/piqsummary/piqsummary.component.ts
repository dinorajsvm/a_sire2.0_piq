import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ColDef, GridApi, RowGroupingDisplayType } from 'ag-grid-community';
import { BudgetService } from '../../services/budget.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { DefaultColDef, colorCodes } from 'src/app/core/constants';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ReuseConfirmationDialogComponent } from '../reuse-confirmation-dialog/reuse-confirmation-dialog.component';
import { DatePipe } from '@angular/common';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
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
  selector: 'app-piqsummary',
  templateUrl: './piqsummary.component.html',
  styleUrls: ['./piqsummary.component.css'],
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
export class PIQSummaryComponent implements OnInit {
  autoSaveForm!: FormGroup;
  @Input() pendingQuestCount: any;
  @Input() totalQuestCount: any;
  @Input() presetQuestCounts: any;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  getExceptionGrid: any;
  emptyRemark: any;
  quickNotesInput = '';
  remarks = '';
  instanceId = '';
  checkboxBoolean: any[] = [];
  pendingCount = 0;
  photoRowData: any[] = [];
  private gridApi!: GridApi;
  defaultColDef = DefaultColDef;
  public groupDisplayType: RowGroupingDisplayType = 'groupRows';
  enableViewMode: boolean = true;
  hideReqBtns: boolean = false;
  public tooltipShowDelay = 0;
  columnDefs: ColDef[] = [
    {
      field: 'topics',
      headerName: 'Header Topics',
      tooltipField: 'topics',
      width: 300,
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'totalQuestion',
      headerName: 'Total Sub Questions',
      tooltipField: 'totalQuestion',
      width: 160,
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'filledQuestion',
      headerName: 'Filled Sub Question',
      tooltipField: 'filledQuestion',
      width: 160,
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'pendingQuestion',
      headerName: 'Pending Sub Question',
      tooltipField: 'pendingQuestion',
      width: 160,
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      tooltipField: 'status',
      floatingFilter: false,
    },
    {
      field: 'lastModified',
      headerName: 'Last Modified',
      tooltipField: 'lastModified',
      cellStyle: { textAlign: 'right' },
      width: 160,
      flex: 1,
      floatingFilter: false,
    },
  ];
  photoColumnDefs: ColDef[] = [
    {
      field: 'topic',
      headerName: 'Sub Topic Title',
      tooltipField: 'topic',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'image',
      headerName: 'Photo Available',
      tooltipField: 'image',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'nameMismatch',
      headerName: 'Is Not Matching',
      tooltipField: 'nameMismatch',
      flex: 1,
      floatingFilter: false,
    },
  ];
  expectedColumnDefs: ColDef[] = [
    {
      field: 'username',
      headerName: 'User Name',
      tooltipField: 'username',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'rankname',
      headerName: 'User Rank',
      tooltipField: 'rankname',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'crdate',
      headerName: 'Last Update',
      tooltipField: 'crdate',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      floatingFilter: false,
      valueGetter: this.dateFormat.bind(this),
    },
    {
      field: 'sync',
      headerName: 'Type',
      tooltipField: 'sync',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      tooltipField: 'status',
      flex: 1,
      floatingFilter: false,
    },
  ];
  plannedSubDate: any;
  getWorkFlowAction: any;
  getWrkFlowId: any;
  getSubWrkFlowRank: any;
  getResAprWrkFlowRank: any;
  setFlowAction: any;
  getRank: any;
  submitData: any;
  dateSelected: any;
  quickNotes: any;
  getVesselCode: any;
  photoRepImgCounts: any;
  getPlannedSubDate: any;
  getOriginator: any;
  getApproverRanks: any;
  getSubmitterRanks: any;

  dateFormat(params: any) {
    const crdate = params.data.crdate;
    return crdate
      ? this.datePipe.transform(params.data.crdate, 'dd-MMM-yyyy HH:mm')
      : '';
  }
  modifiedColumns: ColDef[] = [
    {
      field: 'mainQuestion',
      headerName: 'Main Question',
      tooltipField: 'mainQuestion',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'subQuestion',
      headerName: 'Sub Question',
      tooltipField: 'subQuestion',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'userName',
      headerName: 'User Name',
      tooltipField: 'userName',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'modifiedDateTime',
      headerName: 'Modified Date',
      tooltipField: 'modifiedDateTime',
      cellStyle: { textAlign: 'right' },
      flex: 1,
      floatingFilter: false,
    },
  ];
  certificateColumns: ColDef[] = [
    {
      field: 'certifiactetype',
      headerName: 'OCIMF Certificate Type',
      tooltipField: 'certifiactetype',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'mackcertificatename',
      headerName: 'System Certificate Name',
      tooltipField: 'mackcertificatename',
      flex: 1,
      floatingFilter: false,
    },
    {
      field: 'certificateAvailable',
      headerName: 'Certificate Available',
      tooltipField: 'certificateAvailable',
      flex: 1,
      floatingFilter: false,
      valueGetter: this.customCrUserValueGetter.bind(this),
    },
  ];

  tabChange(tabRef: any) {
    if (tabRef == 'PIQ') {
      const tab = 1;
      this.BudgetService.setTabChangeData(tab);
    } else if (tabRef == 'PR') {
      const tab = 2;
      this.BudgetService.setTabChangeData(tab);
    } else if (tabRef == 'E') {
      const tab = 4;
      this.BudgetService.setTabChangeData(tab);
    } else if (tabRef == 'C') {
      const tab = 3;
      this.BudgetService.setTabChangeData(tab);
    }
  }

  rowData: any[] = [];
  certificateRowData: any[] = [];
  modifiedrowData: any[] = [];
  referenceNumber: any = '';
  userDetails: any;
  locationCode: any;
  getMainQuestCounts: any[] = [];
  getAllDatas: any[] = [];
  certificateCounts: any;
  exceptionCounts: any;
  remarksCounts: any;
  remarksGridData: any = [];
  photoRepCounts: any;
  mappedCertificateCounts: any;
  lastModifiedData: any;
  syncedData: any[] = [];
  expectedRowData: any[] = [];
  disableSubFlowBtn: boolean = false;
  disableResAprFlowBtn: boolean = false;
  disableSyncBtn = true;
  hideEdit: boolean = true;
  hideBtns: boolean = false;
  viewMode?: boolean;
  constructor(
    public dialog: MatDialog,
    private BudgetService: BudgetService,
    private route: ActivatedRoute,
    private _storage: StorageService,
    private _snackBarService: SnackbarService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.referenceNumber = this.route.snapshot.paramMap.get('id');
    this.userDetails = this._storage.getUserDetails();
    this.locationCode = localStorage.getItem('locationCode');
    this.getworkflowStatus();
    this.getRank = this.userDetails.userData.mdata.appInfo.rankCode;

    if (
      this.pendingQuestCount == undefined ||
      this.totalQuestCount == undefined
    ) {
      this.pendingQuestCount = 0;
      this.totalQuestCount = 0;
    }
    if (this.route.snapshot.paramMap.get('type') == 'view') {
      this.disableSubFlowBtn = true;
      this.disableResAprFlowBtn = true;
      this.viewMode = true;

      this.BudgetService.getEnableBtn().subscribe((res: any) => {
        if (res == false) {
          this.disableSyncBtn = res;
          this.viewMode = res;
        } else {
          this.disableSyncBtn = true;
          this.viewMode = true;
        }
      });
    } else {
      this.disableSyncBtn = false;
    }
    this.getAnswerValue();
    this.userDetails = this._storage.getUserDetails();
    this.locationCode = localStorage.getItem('locationCode');
    this.getRank = this.userDetails.userData.mdata.appInfo.rankCode;
    this.BudgetService.getPiqQuestionData().subscribe((res: any) => {
      this.submitData = res;
    });
    this.BudgetService.getGridSummary().subscribe((res: any) => {
      this.rowData = res;
    });
    this.BudgetService.getCertificateGridData().subscribe((res: any) => {
      this.certificateCounts = res;
    });
    this.BudgetService.getMappedCertificateData().subscribe((res: any) => {
      this.mappedCertificateCounts = res;
    });
    this.BudgetService.getExceptionGridData().subscribe((res: any) => {
      this.exceptionCounts = res;
    });
    this.BudgetService.getExceptionRowData().subscribe((res: any) => {
      this.getExceptionGrid = [];
      this.getExceptionGrid = res && res.length > 0 ? res : [];
    });
    this.BudgetService.getRemarksCountsData().subscribe((res: any) => {
      this.remarksGridData = res;
      if (res === 0) {
        this.remarksCounts = 0;
      } else {
        if (this.remarksGridData && this.remarksGridData.length > 0) {
          const rowsWithRemarks = this.remarksGridData.filter(
            (row: any) => row.remark !== ''
          );
          this.remarksCounts =
            rowsWithRemarks && rowsWithRemarks.length > 0
              ? rowsWithRemarks.length
              : 0;
        }
      }
    });
    this.BudgetService.getPhotoRepData().subscribe((res: any) => {
      this.photoRepCounts = res;
    });
    this.BudgetService.getImgCount().subscribe((res: any) => {
      this.photoRepImgCounts = res;
    });
    this.BudgetService.getPrGridData().subscribe((res: any) => {
      this.photoRowData = res;
    });
    this.getplannedDate();
  }

  buildForm() {
    this.autoSaveForm = this.fb.group({
      dateField: [''],
      TextAreaField: [''],
      wrkFlowTextArea: [''],
    });
  }
  onInputBlur() {
    this.onFormChanges();
  }
  onDateChange(event: any) {
    this.plannedSubDate = this.datePipe.transform(
      event.value,
      'yyyy-MM-dd HH:mm:ss'
    );
    this.autoSaveForm.get('dateField')?.setValue(this.plannedSubDate);
    this.onFormChanges();
  }
  onFormChanges() {
    this.dateSelected = this.autoSaveForm.controls['dateField'].value;
    this.quickNotes = this.autoSaveForm.controls['TextAreaField'].value;

    if (this.dateSelected != null || this.quickNotes != '') {
      this.onSubmitQuickNotes();
    }
  }
  onWorkflow(type?: any, event?: any) {
    if (type == 'approve') {
      this.BudgetService.setEditVisible(this.hideEdit);
      localStorage.setItem('setEditVisible', 'true');
    } else {
      this.BudgetService.setEditVisible(false);
      localStorage.setItem('setEditVisible', 'false');
    }
    this.getAnswerValue(type);
    event.preventDefault();
    event.stopPropagation();
  }

  getworkflowStatus() {
    this.getRank = this.userDetails.userData.mdata.appInfo.rankCode;
    this.BudgetService.getworkFlowStatus().subscribe((res: any) => {
      let val = res.workflowmaster;

      this.getWrkFlowId = val[0].wfid;
      this.getSubWrkFlowRank = val[0].submitter;
      this.getResAprWrkFlowRank = val[0].approver;
      const getAppRank =
        val && val[0] && val[0].approvers
          ? val[0].approvers.find((x: any) => x === this.getRank)
          : '';

      const getSubRank =
        val && val[0] && val[0].submitters
          ? val[0].submitters.find((x: any) => x === this.getRank)
          : '';
      this.getApproverRanks = getAppRank !== undefined ? getAppRank : 0;
      this.getSubmitterRanks = getSubRank !== undefined ? getSubRank : 0;
      
      if (this.route.snapshot.paramMap.get('type') == 'view') {
        this.BudgetService.getEnableBtn().subscribe((res: any) => {
          if (
            (this.getSubmitterRanks == this.getRank ||
              this.getApproverRanks == this.getRank) &&
            res == false
          ) {
            this.disableSubFlowBtn = false;
          } else {
            this.disableSubFlowBtn = true;
          }
          if (this.getApproverRanks == this.getRank && res == false) {
            this.disableResAprFlowBtn = false;
          } else {
            this.disableResAprFlowBtn = true;
          }
        });
      } else {
        if (
          this.getSubmitterRanks == this.getRank ||
          this.getApproverRanks == this.getRank
        ) {
          this.disableSubFlowBtn = false;
        } else {
          this.disableSubFlowBtn = true;
        }
        if (this.getApproverRanks == this.getRank) {
          this.disableResAprFlowBtn = false;
        } else {
          this.disableResAprFlowBtn = true;
        }
      }
      this.getMasterDetails();
    });
  }

  saveWorkFlowAction(getFlowAction: any) {
    const payload = {
      wfaction: getFlowAction,
      wfid: this.getWrkFlowId,
      instanceid: this.referenceNumber,
      user: this.userDetails.userCode,
      rank: this.getRank,
      remarks: this.remarks,
      vesselcode: this.getVesselCode,
    };

    this.BudgetService.getworkflowaction(payload).subscribe((res: any) => {});
  }

  getMasterDetails() {
    const payload = {
      instanceid: this.referenceNumber,
      presettype: 'n',
      companycode: this.userDetails.companyCode,
      username: this.userDetails.empCode,
    };
    this.BudgetService.getPiqQuestAns(payload).subscribe((res: any) => {
      this.setPlannedDate(res);
      this.getWorkFlowAction = res.wrkflow;
      this.getVesselCode = res.vesselcode;
      this.certficateGridDatas();
      this.getOriginator = res.orginator;
      // if (
      //   this.getWorkFlowAction == 'Submitted' ||
      //   this.getWorkFlowAction == 'Approved'
      // ) {
      //   this.BudgetService.setEnableBtn(true);
      // }
      const data = res && res.lastMod ? JSON.parse(res.lastMod) : [];
      const exceptionList =
        res && res.exceptionlist ? JSON.parse(res.exceptionlist) : [];
      this.BudgetService.setExceptionData(exceptionList);
      if (this.route.snapshot.paramMap.get('type') == 'view') {
        if (
          this.getOriginator == 'CNT002' &&
          this.getWorkFlowAction == 'Inprogress' &&
          this.userDetails?.cntrlType === 'CNT001'
        ) {
          this.BudgetService.setEnableViewMode(false);
        }
      }

      if (
        (this.getWorkFlowAction == 'Submitted' &&
          this.getApproverRanks != this.userDetails?.rankCode) ||
        ((this.getWorkFlowAction == 'ReAssigned' ||
          this.getWorkFlowAction == 'Approved') &&
          this.getApproverRanks == this.userDetails?.rankCode)
      ) {
        this.viewMode = true;
      }

      if (
        (this.getOriginator == 'CNT002' &&
          this.getWorkFlowAction === 'Submitted' &&
          this.getApproverRanks != this.userDetails?.rankCode) ||
        (this.getOriginator == 'CNT001' &&
          this.getWorkFlowAction === 'Submitted' &&
          this.userDetails?.cntrlType === 'CNT001' &&
          this.getApproverRanks != this.userDetails?.rankCode) ||
        (this.getWorkFlowAction === 'ReAssigned' &&
          this.userDetails?.cntrlType === 'CNT001' &&
          this.getApproverRanks === this.userDetails?.rankCode) ||
        this.getWorkFlowAction === 'Approved'
      ) {
        this.hideReqBtns = true;
      }

      if (res.quicknotes === 'null') {
        this.quickNotesInput = '';
      } else {
        this.quickNotesInput = res.quicknotes;
      }

      if (data) {
        this.modifiedrowData = data;
      }

      if (res && res.datasyncgrid && res.datasyncgrid != '') {
        const data = JSON.parse(res.datasyncgrid);
        this.expectedRowData = data;
      }
      this.BudgetService.setEditVisible(false);
      localStorage.setItem('setEditVisible', 'false');
      if (this.getOriginator == 'CNT002') {
        if (
          (this.getWorkFlowAction === 'Submitted' &&
            this.userDetails?.cntrlType === 'CNT002') ||
          (this.getWorkFlowAction === 'ReAssigned' &&
            this.userDetails?.cntrlType === 'CNT001') ||
          (this.getWorkFlowAction != 'Inprogress' &&
            this.userDetails?.cntrlType === 'CNT001' &&
            this.getApproverRanks != this.userDetails?.rankCode) ||
          this.getWorkFlowAction === 'Approved'
        ) {
          this.hideBtns = true;
          this.BudgetService.setEditVisible(true);
          localStorage.setItem('setEditVisible', 'true');
        }
      } else if (this.getOriginator == 'CNT001') {
        if (
          this.userDetails?.cntrlType === 'CNT002' ||
          (this.getApproverRanks != this.userDetails?.rankCode &&
            this.getWorkFlowAction === 'Submitted' &&
            this.userDetails?.cntrlType === 'CNT001') ||
          (this.getWorkFlowAction == 'Approved' &&
            this.userDetails?.cntrlType === 'CNT001') ||
          (this.getApproverRanks === this.userDetails?.rankCode &&
            this.getWorkFlowAction === 'ReAssigned' &&
            this.userDetails?.cntrlType === 'CNT001')
        ) {
          this.hideBtns = true;
          this.BudgetService.setEditVisible(true);
          localStorage.setItem('setEditVisible', 'true');
        }
      }

      if (
        this.getOriginator == 'CNT001' &&
        this.userDetails?.cntrlType === 'CNT001' &&
        this.getWorkFlowAction === 'Approved'
      ) {
        this.hideBtns = true;
        this.BudgetService.setEditVisible(true);
        localStorage.setItem('setEditVisible', 'true');
      }
    });
  }

  defaultGridChanges() {}

  certficateGridDatas() {
    this.BudgetService.getCertificateList(
      this.userDetails.companyCode,
      this.getVesselCode,
      this.referenceNumber
    ).subscribe((res: any) => {
      this.certificateRowData =
        res &&
        res.response &&
        res.response.piqmappinglist &&
        res.response.piqmappinglist.length > 0
          ? res.response.piqmappinglist
          : [];
    });
  }
  isString(input: any): input is string {
    return typeof input === 'string';
  }
  customCrUserValueGetter(params: any) {
    const certificatename = params.data.mackcertificatename;
    return certificatename ? 'Yes' : 'No';
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi!.setRowData(this.rowData);
    this.gridApi.refreshCells(params);
  }

  getAnswerValue(type?: any) {
    if (
      type != 'reUse' &&
      this.getExceptionGrid &&
      this.getExceptionGrid.length > 0
    ) {
      this.emptyRemark = this.getExceptionGrid.find(
        (x: any) => x.remark === ''
      );
      if (this.emptyRemark) {
        this._snackBarService.loadSnackBar(
          'Exception Remarks Mandatory',
          colorCodes.ERROR
        );
        return;
      }
    }

    let ansPayload: any;
    let pendingResult: any = [];
    this.getMainQuestCounts.forEach((element: any) => {
      pendingResult.push({
        mainQuesId: element.qid,
        checkbox: element.checkbox,
      });
    });
    if (type === 'syncToStore') {
      ansPayload = {
        instanceid: this.referenceNumber,
        action: 'SS',
        user: this.userDetails.userCode,
        tenantIdentifier: '',
        answerdata: this.submitData,
        locationcode: this.locationCode,
        exceptionjson: this.getExceptionGrid,
        mainQuestCheckbox: pendingResult,
        lastmodifieddata: JSON.stringify(this.modifiedrowData),
        wfaction: '',
      };
    } else if (type === 'reassign') {
      if (this.autoSaveForm.controls['wrkFlowTextArea'].value != '') {
        this.setFlowAction = 'RSN';
        ansPayload = {
          instanceid: this.referenceNumber,
          action: 'SS',
          user: this.userDetails.userCode,
          tenantIdentifier: '',
          answerdata: this.submitData,
          locationcode: this.locationCode,
          exceptionjson: this.getExceptionGrid,
          mainQuestCheckbox: pendingResult,
          lastmodifieddata: JSON.stringify(this.modifiedrowData),
          wfaction: 'RSN',
        };
        this.BudgetService.setEnableViewMode(this.enableViewMode);
        let remarks = document.getElementById('remarks');
        localStorage.setItem('setDisable', 'true');
        remarks?.classList.remove('remError');
        this.viewMode = true;
        this.disableResAprFlowBtn = true;
        this.saveWorkFlowAction(this.setFlowAction);
      } else {
        let remarks = document.getElementById('remarks');
        remarks?.classList.add('remError');
        this.disableResAprFlowBtn = false;
        this._snackBarService.loadSnackBar('Add Remarks', colorCodes.ERROR);
      }
    } else if (type === 'approve') {
      if (this.autoSaveForm.controls['wrkFlowTextArea'].value != '') {
        this.setFlowAction = 'APR';
        ansPayload = {
          instanceid: this.referenceNumber,
          action: 'S',
          user: this.userDetails.userCode,
          tenantIdentifier: '',
          answerdata: this.submitData,
          locationcode: this.locationCode,
          exceptionjson: this.getExceptionGrid,
          mainQuestCheckbox: pendingResult,
          lastmodifieddata: JSON.stringify(this.modifiedrowData),
          wfaction: 'APR',
        };
        this.BudgetService.setEnableViewMode(this.enableViewMode);
        localStorage.setItem('setDisable', 'true');
        let remarks = document.getElementById('remarks');
        remarks?.classList.remove('remError');
        this.viewMode = true;
        this.disableResAprFlowBtn = true;
        this.saveWorkFlowAction(this.setFlowAction);
      } else {
        let remarks = document.getElementById('remarks');
        remarks?.classList.add('remError');
        this.disableResAprFlowBtn = false;
        this._snackBarService.loadSnackBar('Add Remarks', colorCodes.ERROR);
      }
    } else if (type === 'submit') {
      if (this.autoSaveForm.controls['wrkFlowTextArea'].value != '') {
        this.setFlowAction = 'SUB';
        ansPayload = {
          chapterdata: JSON.stringify(this.rowData),
          instanceid: this.referenceNumber,
          action: 'S',
          user: this.userDetails.userCode,
          tenantIdentifier: '',
          answerdata: this.submitData,
          locationcode: this.locationCode,
          exceptionjson: this.getExceptionGrid,
          mainQuestCheckbox: pendingResult,
          lastmodifieddata: JSON.stringify(this.modifiedrowData),
          wfaction: 'SUB',
        };
        this.BudgetService.setEnableViewMode(this.enableViewMode);
        let remarks = document.getElementById('remarks');
        localStorage.setItem('setDisable', 'true');
        remarks?.classList.remove('remError');
        this.viewMode = true;
        this.saveWorkFlowAction(this.setFlowAction);
        this.disableSubFlowBtn = true;
      } else {
        let remarks = document.getElementById('remarks');
        remarks?.classList.add('remError');
        this._snackBarService.loadSnackBar('Add Remarks', colorCodes.ERROR);
      }
    } else {
      return;
    }
    this.saveMethodCall(ansPayload, type);
  }
  getQuestionAnswerDatas(type?: any) {
    const payload = {
      instanceid: this.referenceNumber,
      presettype: 'n',
      companycode: this.userDetails.companyCode,
      username: this.userDetails.empCode,
    };
    this.getMainQuestCounts = [];
    this.BudgetService.getPiqQuestAns(payload).subscribe((res: any) => {
      if (res && res.response) {
        let object = res && res.response ? JSON.parse(res.response) : [];
        this.getAllDatas = object;
        object.forEach((value1: any) => {
          value1.values.forEach((value: any) => {
            value.question.forEach((subHeader: any) => {
              this.getMainQuestCounts.push(subHeader);
            });
          });
        });
      }
      this.getAnswerValue(type);
    });
  }

  onSubmit(type: string, event: any) {
    this.setFlowAction = '';
    this.getQuestionAnswerDatas(type);

    if (type === 'reUse') {
      this.getRefnImportDetails(this.instanceId);
    }
  }

  onSubmitQuickNotes() {
    const payload = {
      instanceid: this.referenceNumber,
      usercode: this.userDetails.userCode,
      quicknotes: this.quickNotesInput,
      plannedsubdate: this.dateSelected,
    };
    this.BudgetService.saveQuickNotes(payload).subscribe((res) => {
      this.getplannedDate();
    });
  }
  getplannedDate() {
    const payload = {
      instanceid: this.referenceNumber,
      presettype: 'n',
      companycode: this.userDetails.companyCode,
      username: this.userDetails.empCode,
    };
    this.BudgetService.getPiqQuestAns(payload).subscribe((res: any) => {
      this.setPlannedDate(res);
    });
  }

  setPlannedDate(res: any) {
    this.getPlannedSubDate = this.datePipe.transform(
      res.plannedsubdate,
      'dd-MMM-yyyy'
    );
    const resDate = res.plannedsubdate;
    this.autoSaveForm.get('dateField')?.setValue(resDate);
  }
  getRefnImportDetails(instanceid: any) {
    let getMainQuestCounts: any[] = [];
    this.BudgetService.getRefnImportAnswer(instanceid).subscribe((data) => {
      this.getAllDatas.forEach((value1: any) => {
        value1.values.forEach((value: any) => {
          value.question.forEach((subHeader: any) => {
            getMainQuestCounts.push(subHeader);
            this.checkboxBoolean.push(subHeader.selected);
            this.pendingCount = this.checkboxBoolean.filter(
              (value: any) => value === false
            ).length;
          });
        });
      });
      if (this.pendingCount === getMainQuestCounts.length) {
        this.BudgetService.setPreviousPresetData(data.response);
      }
    });
    const exceptionList: any = [];
    this.BudgetService.setExceptionData(exceptionList);
  }
  openDialog(): void {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'reuse-dialog-container';
    const dialogRef = this.dialog.open(
      ReuseConfirmationDialogComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.instanceId = result;
        this.onSubmit('reUse', event);
      }
    });
  }
  saveMethodCall(ansPayload: any, type?: any) {
    this.BudgetService.getSaveValues(ansPayload).subscribe((res: any) => {
      if (type === 'syncToStore' && this.userDetails?.cntrlType === 'CNT002') {
        this.getMasterDetails();
        this._snackBarService.loadSnackBar(
          'Sync to Shore Initiated Successfully',
          colorCodes.INFO
        );
      } else if (
        type === 'syncToStore' &&
        this.userDetails?.cntrlType === 'CNT001'
      ) {
        this.getMasterDetails();
        this._snackBarService.loadSnackBar(
          'Sync to Ship Initiated Successfully',
          colorCodes.INFO
        );
      } else if (type === 'submit') {
        setTimeout(() => {
          window.location.reload();
        }, 100);
        this._snackBarService.loadSnackBar(
          'Submitted Successfully',
          colorCodes.INFO
        );
      } else if (type == 'reassign') {
        this.getMasterDetails();
        window.location.reload();
        this.getMasterDetails();
        this._snackBarService.loadSnackBar(
          'Reassigned Successfully',
          colorCodes.INFO
        );
      } else if (type == 'approve') {
        window.location.reload();
        this.getMasterDetails();
        this._snackBarService.loadSnackBar(
          'Aprroved Successfully',
          colorCodes.INFO
        );
      }
    });
  }
}
