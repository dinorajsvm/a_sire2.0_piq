import { Component, Input, OnInit } from '@angular/core';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { BudgetService } from '../../services/budget.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { DefaultColDef, colorCodes } from 'src/app/core/constants';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ReuseConfirmationDialogComponent } from '../reuse-confirmation-dialog/reuse-confirmation-dialog.component';
import { DatePipe } from '@angular/common';
import { agGridTooltipComponent } from '../renderer/ag-grid-tooltip.component';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  @Input() getAllData: any;
  @Input() pendingQuestCount: any;
  @Input() totalQuestCount: any;
  @Input() presetQuestCounts: any;
  getSelectedDate: any = '';
  quickNotesInput = '';
  remarks = '';
  photoData: any[] = [];
  instanceId = '';
  checkboxBoolean: any[] = [];
  pendingCount = 0;
  photoRowData: any[] = [];
  private gridApi!: GridApi;
  defaultColDef = DefaultColDef

  public tooltipShowDelay = 0;
  public tooltipHideDelay = 20000;
  public gridOptions: GridOptions = {};
  columnDefs: ColDef[] = [
    // { field: 'serialNumber', headerName: 'S.No', width: 70 },
    { field: 'topics', headerName: 'Header Topics', width: 300,flex:1 },
    { field: 'status', headerName: 'Status' },
    { field: 'totalQuestion', headerName: 'Total Questions', width: 160,flex:1 },
    { field: 'filledQuestion', headerName: 'Filled Question', width: 160,flex:1 },
    { field: 'pendingQuestion', headerName: 'Pending Question', width: 160,flex:1 },
    { field: 'lastModified', headerName: 'Last Modified', width: 160,flex:1 },
  ];
  photoColumnDefs: ColDef[] = [
    {
      field: 'subTopicTitle',
      headerName: 'Sub Topic Title',
      tooltipComponent: 'subTopicTitle',flex:1 
    },
    {
      field: 'photoAvailable',
      headerName: 'Photo Available',
      tooltipField: 'photoAvailable',flex:1
    },
    {
      field: 'isNotMatching',
      headerName: 'Is Not Matching',
      tooltipField: 'isNotMatching',flex:1
    },
  ];
  expectedColumnDefs: ColDef[] = [
    { field: 'username', headerName: 'User Name', tooltipField: 'username',flex:1 },
    { field: 'rankname', headerName: 'User Rank', tooltipField: 'rankname',flex:1 },
    {
      field: 'crdate',
      headerName: 'Last Update',
      tooltipField: 'crdate',
      flex:1,
      valueGetter: this.dateFormat.bind(this),
    },
  ];
  plannedSubDate: any;
  getDate: any;
  getWorkFlowAction: any;
  getWrkFlowId: any;
  getWrkFlowRank: any;
  setFlowAction: any;
  getRank: any;
  submitData: any;
  dateSelected: any;
  quickNotes: any;
  getVesselCode: any;
  photoRepImgCounts: any;
  // dateFormat(event: any) {
  //   return this.datePipe.transform(event.crdate, 'dd-MMM-yyyy HH:mm:ss');
  // }
  dateFormat(params: any) {
    const crdate = params.data.crdate;
    return crdate
      ? this.datePipe.transform(params.data.crdate, 'dd-MMM-yyyy HH:mm:ss')
      : '';
  }
  modifiedColumns: ColDef[] = [
    {
      field: 'mainQuestion',
      headerName: 'Main Question',
      tooltipField: 'mainQuestion',flex:1
    },
    {
      field: 'subQuestion',
      headerName: 'Sub Question',
      tooltipField: 'subQuestion',flex:1
    },
    { field: 'userName', headerName: 'User Name', tooltipField: 'userName',flex:1 },
    {
      field: 'modifiedDateTime',
      headerName: 'Modified Date / Time',
      tooltipField: 'modifiedDateTime',flex:1
    },
  ];
  certificateColumns: ColDef[] = [
    {
      field: 'certifiactetype',
      headerName: 'OCIMF Certificate Type',
      tooltipField: 'categoryname',flex:1
    },
    {
      field: 'mackcertificatename',
      headerName: 'MACK Certificate Name',
      tooltipField: 'certificatename',flex:1
    },
    {
      field: 'certificateAvailable',
      headerName: 'Certificate Available',
      tooltipField: 'certificateAvailable',flex:1,
      valueGetter: this.customCrUserValueGetter.bind(this),
    },
  ];
  rowData: any[] = [];
  certificateRowData: any[] = [];
  modifiedrowData: any[] = [];
  referenceNumber: any = '';
  userDetails: any;
  answerDetails: any;
  locationCode: any;
  getMainQuestCounts: any[] = [];
  getAllDatas: any[] = [];
  isNotNull = false;
  certificateCounts: any;
  exceptionCounts: any;
  photoRepCounts: any;
  mappedCertificateCounts: any;
  lastModifiedData: any;
  syncedData: any[] = [];
  expectedRowData: any[] = [];
  disableFlowBtn: boolean = true;
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
    if (
      this.pendingQuestCount == undefined ||
      this.totalQuestCount == undefined
    ) {
      this.pendingQuestCount = 0;
      this.totalQuestCount = 0;
    }
    this.referenceNumber = this.route.snapshot.paramMap.get('id');
    this.getLastModifiedDatas();
    this.BudgetService.getsavedAnswers(this.referenceNumber).subscribe(
      (res: any) => {
        // this.expectedRowData = data;
      }
    );
    this.getworkflowStatus();
    this.getSSDatas();
    this.getAnswerValue();
    this.userDetails = this._storage.getUserDetails();
    this.locationCode = localStorage.getItem('locationCode');
    this.getRank = this.userDetails.userData.mdata.appInfo.rankCode;
    this.photoRowData = [];
    this.photoData.forEach((res: any) => {
      res.subTopics.forEach((resp: any) => {
        this.photoRowData.push(resp);
      });
    });
    this.BudgetService.getSummaryGridData().subscribe((res: any) => {
      this.rowData = [];
      this.certficateGridDatas();
      if (res) {
        res.forEach((data: any) => {
          let questions: any[] = [];
          let questions1: any[] = [];
          let filledQuestionCount = 0;
          let answerQuestionCount = 0;
          data.values.forEach((filledQus: any) => {
            filledQus.question.forEach((question: any) => {
              questions.push(
                question.subQuestion.filter((x: any) => x.answer !== '').length
              );
              console.log("questions",questions);
              
              questions1.push(
                question.subQuestion.filter((y: any) => y.answer === '').length
              );
            });
          });
          questions.forEach((count: any) => {
            filledQuestionCount = filledQuestionCount + count;
          });
          questions1.forEach((count: any) => {
            answerQuestionCount = answerQuestionCount + count;
          });
          const pattern = /[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\|]/g;
          this.rowData.push({
            serialNumber: data.id,
            topics: data.header.replace(pattern, ''),
            status: '',
            totalQuestion:
              data.values && data.values.length > 0 ? data.values.length : 0,
            filledQuestion: filledQuestionCount,
            pendingQuestion: answerQuestionCount,
            lastModified: '04-Sep-2023',
          });
          // this.gridApi!.setRowData(this.rowData);
          // this.gridApi.refreshCells();
        });
      }
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

    this.BudgetService.getPhotoRepData().subscribe((res: any) => {
      this.photoRepCounts = res;
    });
    this.BudgetService.getImgCount().subscribe((res: any) => {
      this.photoRepImgCounts = res;
    });
    this.BudgetService.getPrGridData().subscribe((res: any) => {   
      this.photoRowData = [];
      this.photoRowData = [...this.photoRowData, ...res];
    });
    this.getplannedDate();
  }

  buildForm() {
    this.autoSaveForm = this.fb.group({
      dateField: [''],
      TextAreaField: [''],
      wrkFlowTextArea:['']
       // Initialize with an initial or default value
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
    this.onFormChanges();
  }
  onFormChanges() {
    this.dateSelected = this.autoSaveForm.controls['dateField'].value;
    this.quickNotes = this.autoSaveForm.controls['TextAreaField'].value;
    if (this.dateSelected != null && this.quickNotes != '') {
      this.onSubmitQuickNotes();
    }
  }
  onWorkflow(type?: any,event?:any) {
    this.getAnswerValue(type);
    if (type == 'reassign') {
      this._snackBarService.loadSnackBar(
        'Form Reassigned Successfully',
        colorCodes.INFO
      );
    } else if (type == 'approve') {
      this._snackBarService.loadSnackBar(
        'Form Aprroved Successfully',
        colorCodes.INFO
      );
    }
    event.preventDefault();
    event.stopPropagation();
  }

  getworkflowStatus() {
    this.BudgetService.getworkFlowStatus().subscribe((res: any) => {
      let data = res.workflowmapping;
      let val = res.workflowmaster;
      val.forEach((item: any) => {
        this.getWrkFlowId = item.wfid;
        this.getWrkFlowRank = item.submitter;
      });
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

  getLastModifiedDatas() {
    const payload = {
      instanceid: this.referenceNumber,
    };
    this.BudgetService.getPiqQuestAns(payload).subscribe((res: any) => {   
      if(res.quicknotes==="null"){
        this.quickNotesInput = "";
      }else{
        this.quickNotesInput = res.quicknotes;
      }
      this.getWorkFlowAction = res.wrkflow;
      this.getVesselCode = res.vesselcode;
      const data = JSON.parse(res.lastMod);
      this.modifiedrowData = data;
    });
  }
  certficateGridDatas() {
    this.BudgetService.getCertificateList().subscribe((res: any) => {
      this.certificateRowData =
        res && res.response && res.response.piqmappinglist
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
    this.BudgetService.getsavedAnswers(this.referenceNumber).subscribe(
      (res: any) => {
        this.submitData = res.response.MergedData;
        this.answerDetails = res.response;

        // this.quickNotesInput = this.answerDetails.QuickNotes.Value;
        const isNotNull = Object.values(this.answerDetails).every(
          (value) => value !== ''
        );
        this.isNotNull = isNotNull;
        let ansPayload: any;
        var pendingResult: any = [];
        this.getMainQuestCounts.forEach((element: any) => {
          pendingResult.push({
            mainQuesId: element.qid,
            checkbox: element.checkbox,
          });
        });
        if (type === 'syncToStore') {
          this.getSSDatas();
          ansPayload = {
            instanceid: this.referenceNumber,
            action: 'SS',
            user: this.userDetails.userCode,
            tenantIdentifier: '',
            answerdata: this.submitData,
            locationcode: this.locationCode,
            mainQuestCheckbox: pendingResult,
            lastmodifieddata: JSON.stringify(this.modifiedrowData),
            wfaction: '',
          };
        } else if (type === 'reassign') {
          this.setFlowAction = 'RSN';
          ansPayload = {
            instanceid: this.referenceNumber,
            action: 'SS',
            user: this.userDetails.userCode,
            tenantIdentifier: '',
            answerdata: this.submitData,
            locationcode: this.locationCode,
            mainQuestCheckbox: pendingResult,
            lastmodifieddata: JSON.stringify(this.modifiedrowData),
            wfaction: 'RSN',
          };
          this.saveWorkFlowAction(this.setFlowAction);
        } else if (type === 'approve') {
          this.setFlowAction = 'APR';
          ansPayload = {
            instanceid: this.referenceNumber,
            action: 'SS',
            user: this.userDetails.userCode,
            tenantIdentifier: '',
            answerdata: this.submitData,
            locationcode: this.locationCode,
            mainQuestCheckbox: pendingResult,
            lastmodifieddata: JSON.stringify(this.modifiedrowData),
            wfaction: 'APR',
          };
          this.saveWorkFlowAction(this.setFlowAction);
        } else if (type === 'submit') {
          if (this.autoSaveForm.controls['wrkFlowTextArea'].value != '') {
            this.setFlowAction = 'SUB';
            ansPayload = {
              instanceid: this.referenceNumber,
              action: 'S',
              user: this.userDetails.userCode,
              tenantIdentifier: '',
              answerdata: this.submitData,
              locationcode: this.locationCode,
              mainQuestCheckbox: pendingResult,
              lastmodifieddata: JSON.stringify(this.modifiedrowData),
              wfaction: 'SUB',
            };
            this.saveWorkFlowAction(this.setFlowAction);
          } else {
            this._snackBarService.loadSnackBar('Add Remarks', colorCodes.ERROR);
          }
        } else {
          return;
        }

        this.saveMethodCall(ansPayload, type);
      }
    );
  }
  getQuestionAnswerDatas(type?: any) {
    const payload = {
      instanceid: this.referenceNumber,
      presettype: 'N',
      // "usercode": this.userDetails.userCode
    };
    this.getMainQuestCounts = [];
    this.BudgetService.getPiqQuestAns(payload).subscribe((res: any) => {
      let object = JSON.parse(res.response);
      
      this.getAllDatas = object;
      object.forEach((value1: any) => {
        value1.values.forEach((value: any) => {
          value.question.forEach((subHeader: any) => {
            this.getMainQuestCounts.push(subHeader);
          });
        });
      });
      this.getAnswerValue(type);
    });
  }
  enableViewMode: boolean = true;
  submit() {
    this.BudgetService.setEnableViewMode(this.enableViewMode);
  }
  onSubmit(type: string,event:any) {
    this.setFlowAction = '';
    this.getQuestionAnswerDatas(type);
    if (type === 'reUse') {
      this.getRefnImportDetails(this.instanceId);
    }
    this.BudgetService.setEnableViewMode(this.enableViewMode);
    event.preventDefault();
    event.stopPropagation();
  }
  getSSDatas() {
    const payload = {
      instanceid: this.referenceNumber,
    };
    this.BudgetService.getPiqQuestAns(payload).subscribe((res: any) => {
      if (res && res.datasyncgrid && res.datasyncgrid != '') {
        const data = JSON.parse(res.datasyncgrid);
        this.expectedRowData = data;
      }
    });
  }
  onSubmitQuickNotes() {
    const payload = {
      instanceid: this.referenceNumber,
      usercode: this.userDetails.userCode,
      quicknotes: this.quickNotesInput,
      plannedsubdate: this.plannedSubDate,
    };
    this.BudgetService.saveQuickNotes(payload).subscribe((res) => {
      this.getplannedDate();
    });
  }
  getplannedDate() {
    const payload = {
      instanceid: this.referenceNumber,
    };
    this.BudgetService.getPiqQuestAns(payload).subscribe((res: any) => {
      const resDate = res.plannedsubdate;
      this.autoSaveForm.get('dateField')?.setValue(resDate);
    });
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
      } else {
      }
    });
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
        this.onSubmit('reUse',event);
      }
    });
  }
  saveMethodCall(ansPayload: any, type?: any) {
    this.BudgetService.getSaveValues(ansPayload).subscribe((res: any) => {
      if (type === 'syncToStore' && this.userDetails?.cntrlType === 'CNT002') {
        this._snackBarService.loadSnackBar(
          'Synced to Shore Successfully',
          colorCodes.INFO
        );
      } else if (type === 'syncToStore' && this.userDetails?.cntrlType === 'CNT001') {
        this._snackBarService.loadSnackBar(
          'Synced to Ship Successfully',
          colorCodes.INFO
        );
      }else if (type === 'submit') {
        this._snackBarService.loadSnackBar(
          'Submitted Successfully',
          colorCodes.INFO
        );
      }
    });
  }
}
