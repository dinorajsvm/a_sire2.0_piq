import { Component, Input, OnInit } from '@angular/core';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { BudgetService } from '../../services/budget.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { colorCodes } from 'src/app/core/constants';
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
  dateForm!: FormGroup;
  @Input() getAllData: any;
  @Input() pendingQuestCount: any;
  @Input() totalQuestCount: any;
  @Input() presetQuestCounts: any;
  getSelectedDate: any = '';
  quickNotesInput = '';
  photoData: any[] = [];
  instanceId = '';
  checkboxBoolean: any[] = [];
  pendingCount = 0;
  photoRowData: any[] = [];
  private gridApi!: GridApi;
  public defaultColDef: any = {
    resizable: true,
    enableRowGroup: true,
    sortable: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    tooltipComponent: agGridTooltipComponent,
  };
  public tooltipShowDelay = 0;
  public tooltipHideDelay = 20000;
  public gridOptions: GridOptions = {};
  columnDefs: ColDef[] = [
    // { field: 'serialNumber', headerName: 'S.No', width: 70 },
    { field: 'topics', headerName: 'Header Topics', width: 300 },
    { field: 'status', headerName: 'Status' },
    { field: 'totalQuestion', headerName: 'Total Questions', width: 160 },
    { field: 'filledQuestion', headerName: 'Filled Question', width: 160 },
    { field: 'pendingQuestion', headerName: 'Pending Question', width: 160 },
    { field: 'lastModified', headerName: 'Last Modified', width: 160 },
  ];
  photoColumnDefs: ColDef[] = [
    {
      field: 'subTopicTitle',
      headerName: 'Sub Topic Title',
      tooltipField: 'subTopicTitle',
    },
    {
      field: 'photoAvailable',
      headerName: 'Photo Available',
      tooltipField: 'photoAvailable',
    },
    {
      field: 'isNotMatching',
      headerName: 'Is Not Matching',
      tooltipField: 'isNotMatching',
    },
  ];
  expectedColumnDefs: ColDef[] = [
    { field: 'username', headerName: 'User Name', tooltipField: 'username' },
    { field: 'rankname', headerName: 'User Rank', tooltipField: 'cruser' },
    {
      field: 'crdate',
      headerName: 'Last Update',
      tooltipField: 'crdate',
      valueGetter: this.dateFormat.bind(this),
    },
  ];
  plannedSubDate: any;
  getDate: any;
  getWorkFlowAction: any;
  getWrkFlowId: any;
  getWrkFlowRank: any;
  setFlowAction: any;
  onDateChange(event: any) {
    this.plannedSubDate = this.datePipe.transform(
      event.value,
      'yyyy-MM-dd HH:mm:ss'
    );
  }
  // dateFormat(event: any) {
  //   return this.datePipe.transform(event.crdate, 'dd-MMM-yyyy HH:mm:ss');
  // }
  dateFormat(params: any) {
    const crdate = params.data.crdate;
    return crdate? this.datePipe.transform(params.data.crdate, 'dd-MMM-yyyy HH:mm:ss'):"";
  }
  modifiedColumns: ColDef[] = [
    {
      field: 'mainQuestion',
      headerName: 'Main Question',
      tooltipField: 'mainQuestion',
    },
    {
      field: 'subQuestion',
      headerName: 'Sub Question',
      tooltipField: 'subQuestion',
    },
    { field: 'userName', headerName: 'User Name', tooltipField: 'userName' },
    {
      field: 'modifiedDateTime',
      headerName: 'Modified Date / Time',
      tooltipField: 'modifiedDateTime',
    },
  ];
  certificateColumns: ColDef[] = [
    {
      field: 'categoryname',
      headerName: 'Certificate Type',
      tooltipField: 'categoryname',
    },
    {
      field: 'certificatename',
      headerName: 'Certificate Name',
      tooltipField: 'certificatename',
    },
    {
      field: 'certificateAvailable',
      headerName: 'Certificate Available',
      tooltipField: 'certificateAvailable',
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
  constructor(
    public dialog: MatDialog,
    private BudgetService: BudgetService,
    private route: ActivatedRoute,
    private _storage: StorageService,
    private _snackBarService: SnackbarService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) {
    this.dateForm = this.fb.group({
      dateField: new FormControl(), // Initialize with an initial or default value
    });
  }
  ngOnInit(): void {
    if (
      this.pendingQuestCount == undefined ||
      this.totalQuestCount == undefined
    ) {
      this.pendingQuestCount = 0;
      this.totalQuestCount = 0;
    }
    this.referenceNumber = this.route.snapshot.paramMap.get('id');
    this.getLastModifiedDatas();
    this.BudgetService.getsavedAnswers(this.referenceNumber).subscribe((res:any)=>{
      // this.expectedRowData = data;
    });
    this.getworkflowStatus()
    this.getSSDatas();
    this.getAnswerValue();
    this.userDetails = this._storage.getUserDetails();
    this.locationCode = localStorage.getItem('locationCode');
    this.photoRowData = [];    
    this.photoData.forEach((res: any) => {
      res.subTopics.forEach((resp: any) => {
        this.photoRowData.push(resp);
      });
    });
    this.BudgetService.getSummaryGridData().subscribe((res: any) => {
      this.rowData = [];
      this.certficateGridDatas();
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
        this.gridApi!.setRowData(this.rowData);
        this.gridApi.refreshCells();
      });
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
    this.BudgetService.getPrGridData().subscribe((res: any) => {
      this.photoRowData = [];
      this.photoRowData = [...this.photoRowData, ...res];
    });
    // this.BudgetService.getModifiedData().subscribe((res: any) => {
    //   this.modifiedrowData = [];
    //   this.modifiedrowData = [...this.modifiedrowData, ...res];
    // });
    this.getplannedDate();
  }

  onReassign(){
    this.setFlowAction="RSN";
    this.saveWorkFlowAction(this.setFlowAction);
  }

  onAprrove(){
    this.setFlowAction="APR";
    this.saveWorkFlowAction(this.setFlowAction);
  }

  getworkflowStatus(){
    this.BudgetService.getworkFlowStatus().subscribe((res:any)=>{
      let data = res.workflowmapping;
      let val = res.workflowmaster;
      val.forEach((item:any)=>{
        this.getWrkFlowId=item.wfid;
        this.getWrkFlowRank=item.submitter;
      })
    })
  }

  saveWorkFlowAction(getFlowAction:any){
    const payload={
      wfaction:getFlowAction,
      wfid:this.getWrkFlowId,
      instanceid:this.referenceNumber,
      user:this.userDetails.userCode,
      rank:this.userDetails.userData.mdata.appInfo.rankCode,
      remarks:""
    }

    this.BudgetService.getworkflowaction(payload).subscribe((res:any)=>{
    })
  }

  getLastModifiedDatas() {
    const payload = {
      instanceid: this.referenceNumber,
    };
    this.BudgetService.getPiqQuestAns(payload).subscribe((res: any) => {
      res['workfloaction']="INP";
      this.getWorkFlowAction =res.workfloaction

      const data = JSON.parse(res.lastMod);
      this.modifiedrowData = data;
    });
  }
  certficateGridDatas() {
    this.BudgetService.getCertificateList().subscribe((res: any) => {
      this.certificateRowData = res.response.piqmappinglist;
      if (res && res.response && res.response.piqmappinglist) {
        res.response.piqmappinglist.forEach((data: any) => {
          if (data.grid === null) {
            data.grid = [];
          } else {
            if (data && data.grid) {
              let gridResponse = JSON.parse(data.grid);
              data.grid =
                gridResponse.Response === 'No data'
                  ? []
                  : gridResponse.Response;
            } else {
              data.grid = JSON.parse(data.grid);
            }
          }
        });
      }
      res.response.piqmappinglist.forEach((ress: any) => {
        if (!this.isString(ress.grid)) {
          ress.grid.forEach((response: any, index: any) => {
            if (index === 0) {
              (ress.categoryname = response.categoryname),
                (ress.certificatename = response.certificatename);
            }
          });
        }
      });
      this.certificateRowData = res.response.piqmappinglist;
      // this.totalCertificateCount = this.rowData.length;
      const mappingCercodeValues = this.rowData.map(
        (item) => item.mappingcercode
      );
      const filteredMappingCode = mappingCercodeValues.filter(
        (value) => value !== null
      );
      // this.certificateCount = filteredMappingCode.length;
    });
  }
  isString(input: any): input is string {
    return typeof input === 'string';
  }
  customCrUserValueGetter(params: any) {
    const certificatename = params.data.certificatename;
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
        this.answerDetails = res.response;
        this.quickNotesInput = this.answerDetails.QuickNotes.Value;
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
            answerdata: this.answerDetails,
            location: this.locationCode,
            mainQuestCheckbox: pendingResult,
          };
        } else {
          if (this.isNotNull && type === 'submit') {
            this.setFlowAction="SUB";
            ansPayload = {
              instanceid: this.referenceNumber,
              action: 'S',
              user: this.userDetails.userCode,
              tenantIdentifier: '',
              answerdata: this.answerDetails,
              location: this.locationCode,
              mainQuestCheckbox: pendingResult,
            };
            this.saveWorkFlowAction(this.setFlowAction)
          } else {
            return;
          }
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
  onSubmit(type: string) {
    this.setFlowAction=""
    this.getQuestionAnswerDatas(type);
    if (type === 'reUse') {
      this.getRefnImportDetails(this.instanceId);
    }
    this.BudgetService.setEnableViewMode(this.enableViewMode);
    
    // const modifiedData = {
    //   userName: this.userDetails.userData.mdata.appInfo.userName,
    //   userType: this.userDetails.userData.mdata.userInfo.userType,
    //   sortingDate: new Date(),
    //   modifiedDateTime: this.datePipe.transform(
    //     new Date(),
    //     'dd-MMM-yyyy HH:mm:ss'
    //   ),
    // };
    // this.syncedData.push(modifiedData);
    // this.syncedData.sort((a: any, b: any) => b.sortingDate - a.sortingDate);
    // if (this.syncedData.length > 5) {
    //   this.syncedData.splice(5);
    // }
    // this.expectedRowData = [];
    // this.expectedRowData = [...this.expectedRowData, ...this.syncedData];
  }
  getSSDatas() {
    const payload = {
      instanceid: this.referenceNumber,
    };
    this.BudgetService.getPiqQuestAns(payload).subscribe((res: any) => {
      const data = JSON.parse(res.datasyncgrid);
      this.expectedRowData = data;
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
    // this.getSelectedDate=''
    const payload = {
      instanceid: this.referenceNumber,
    };
    this.BudgetService.getPiqQuestAns(payload).subscribe((res: any) => {
      // const resDate=this.datePipe.transform(res.plannedsubdate, 'dd-MM-yyyy');
      const resDate = res.plannedsubdate;
      this.dateForm.get('dateField')?.setValue(resDate);
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
        this.onSubmit('reUse');
      }
    });
  }
  saveMethodCall(ansPayload: any, type?: any) {
    this.BudgetService.getSaveValues(ansPayload).subscribe((res: any) => {
      if (type === 'syncToStore') {
        this._snackBarService.loadSnackBar(
          'Sync to store successfully.',
          colorCodes.INFO
        );
      } else {
        this._snackBarService.loadSnackBar(
          'Submit successfully.',
          colorCodes.INFO
        );
      }
    });
  }
}
