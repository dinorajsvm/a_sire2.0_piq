import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'ag-grid-enterprise';
import { LicenseManager } from 'ag-grid-enterprise';
import { AppService } from '../../services/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import {
  colorCodes,
  questionValue,
  safetyRowData,
  valuesToCheckDD,
  valuesToCheckDate,
} from 'src/app/core/constants';

import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LookupDialogComponent } from '../lookup/lookup-dialog/lookup-dialog.component';
LicenseManager.setLicenseKey(
  'CompanyName=SOLVERMINDS SOLUTIONS AND TECHNOLOGIES PRIVATE LIMITED,LicensedGroup=SVM Solutions & Technologies Pte. Ltd,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=6,AssetReference=AG-033022,SupportServicesEnd=18_November_2023_[v2]_MTcwMDI2NTYwMDAwMA==55aa1a1d8528a024728210e6983fb1ea'
);
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MocComponent } from '../lookup/moc/moc.component';
import { PscComponent } from '../lookup/psc/psc.component';
import { TMSAComponent } from '../lookup/tmsa/tmsa.component';
import { SafetyManagementComponent } from '../lookup/safety-management/safety-management.component';
import { PmsLookupComponent } from '../lookup/pms-lookup/pms-lookup.component';
import { ManualLookUpComponent } from '../lookup/manual-look-up/manual-look-up.component';
import { MatTabGroup } from '@angular/material/tabs';
import { UnsaveConfirmationDialogPopupComponent } from '../unsave-confirmation-dialog-popup/unsave-confirmation-dialog-popup.component';
import { SwitchVesselTypeComponent } from '../switch-vessel-type/switch-vessel-type.component';
import { ExceptionRemarkComponent } from '../exception-remark/exception-remark.component';
import { LoaderService } from 'src/app/core/services/utils/loader.service';
import { Guid } from 'guid-typescript';
import { PhotoRepositoryComponent } from '../photo-repository/photo-repository.component';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: ['l'],
  },
  //  DD-MM-YYYY
  display: {
    dateInput: 'DD-MMM-YYYY', // Change the date input format
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-piq-report',
  templateUrl: './piq-report.component.html',
  styleUrls: ['./piq-report.component.css'],
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
export class PiqReportComponent implements OnInit, OnDestroy {
  @ViewChild('expandedSection', { static: false }) expandedSection!: ElementRef;
  @ViewChild('globalSearchComponent') globalSearchComponent: any;
  @ViewChild('comExpColBtn') comExpColBtn!: ElementRef;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  @ViewChild('child') photoRepComponent!: PhotoRepositoryComponent;

  dateTimeFormat = 'dd-MMM-yyyy HH:mm';
  dateFormat = 'dd-MMM-yyyy';
  refernceCount = '';
  exceptionCount = '';
  rowSummaryData: any[] = [];
  totalRowCount = 0;
  locationCode: any;
  selectedValue = '';
  disableBtns = false;
  selectedQuestion: any;
  dynamicForms!: FormGroup;
  findResponse: any;
  expandAll = true;
  vesselTypeCode: any;
  getPresetQuestCounts: string[] = [];
  headerListContainer = true;
  descriptionContainer = false;
  searchText: string = '';
  getAllDatas: any;
  isSearchActive = false;
  referenceNumber: any;
  userDetails: any;
  mainQuestCounts = 0;
  pendingCount = 0;
  getMainQuestCounts: any = [];
  exceptionList: any[] = [];
  viewMode?: boolean;
  memoVisible = false;
  checkboxBoolean: any = [];
  filterResponse: any[] = [];
  topbarData: any;
  getGuideLines: any;
  infoMQuestId: any;
  presetQuestCount: any;
  lastModifiedData: any[] = [];
  vesselSelection: any;
  getOrigination: any;
  getStatus: any;
  getApproveRank: any;
  getWrkFlSummaryData: any;
  showWorkSpace = false;
  disableEditMode = true;
  showPendingQuest = false;
  AllQuestions = true;
  formattedDate = '';
  lookUpEnable = false;
  isLeftIcon = true;
  hideEditbutton = false;
  saveDisable = true;
  saveMappedCertificateData: any;
  hideReqBtns = false;
  gridApi: any;
  isLoader = false;
  unSavedData = false;
  modifiedrowData: any[] = [];
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private appServices: AppService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private _storage: StorageService,
    private _snackBarService: SnackbarService,
    private datePipe: DatePipe,
    private loaderService: LoaderService
  ) {
    this.userDetails = this._storage.getUserDetails();
  }

  ngOnInit(): void {
    localStorage.removeItem('vesselType');
    this.referenceNumber = this.route.snapshot.paramMap.get('id');
    this.getworkflowStatus();
    this.getWrkFlSummary();
    this.getQuestionAnswerDatas('', 1);
    this.getGuideLinesData();
    this.appServices.getEnableViewMode().subscribe((res: any) => {
      if (this.userDetails?.cntrlType === 'CNT001') {
        this.disableEditMode = res;
      }
    });

    this.appServices.getExceptionData().subscribe((res: any) => {
      this.exceptionList = res;
      this.exceptionIcon();
    });

    this.appServices.getEditVisible().subscribe((res: any) => {
      this.hideEditbutton = res;
      this.hideReqBtns = res;
    });
    this.appServices.getUnSaveAction().subscribe((res: any) => {
      this.unSavedData = res;
    });

    this.appServices.getExceptionRowData().subscribe((res: any) => {
      this.exceptionList = res && res.length > 0 ? res : [];
    });

    this.appServices.getSavedMappedCertificateData().subscribe((res: any) => {
      this.saveMappedCertificateData = res;
    });
    this.appServices.getPreviousPresetData().subscribe((data: any) => {
      Object.keys(data).forEach((response) => {
        if (this.dynamicForms.controls[response]) {
          this.getAllDatas.forEach((getAllValue: any) => {
            getAllValue.values.forEach((value: any) => {
              value.question.forEach((subHeader: any) => {
                subHeader.subQuestion.forEach((mainQus: any) => {
                  if (response === mainQus.qid) {
                    mainQus.answer = data[response];
                    this.countDetails();
                    this.dynamicForms.controls[response].patchValue(
                      data[response]
                    );
                  }
                });
              });
            });
          });
        }
      });
      if (this.getAllDatas) {
        this.selectValue(this.getAllDatas[0].values[0].subHeaders);
      }
    });
    this.appServices.getExceptionResetData().subscribe((resetData) => {
      this.getAllDatas.forEach((getAllValue: any) => {
        if (getAllValue && getAllValue.values) {
          getAllValue.values.forEach((value: any) => {
            value.question.forEach((subHeader: any) => {
              subHeader.subQuestion.forEach((mainQus: any) => {
                if (
                  mainQus &&
                  resetData.qid === mainQus.qid &&
                  mainQus.presetvalue
                ) {
                  mainQus.answer = mainQus.presetvalue;
                  this.countDetails();
                  this.dynamicForms.controls[resetData.qid].patchValue(
                    mainQus.presetvalue
                  );
                } else {
                  if (mainQus && resetData.qid === mainQus.qid) {
                    mainQus.answer = resetData.savedAnswer;
                    mainQus.savedAnswer = resetData.savedAnswer;
                    this.dynamicForms.controls[resetData.qid].patchValue(
                      new Date(resetData.savedAnswer)
                    );
                    this.dateCount(subHeader);
                  }
                }
              });
            });
          });
        }
      });
    });
  }

  onChangeMemo() {
    this.appServices.setUnSaveAction(true);
  }

  getTopBarDatas() {
    this.loaderService.loaderShow();
    this.appServices
      .getTopBarData(this.referenceNumber)
      .subscribe((res: any) => {
        const data = res.response;
        this.topbarData = data;
        this.loaderService.loaderHide();
      });
  }

  getworkflowStatus() {
    this.appServices.getWorkflowmaster().subscribe((res: any) => {
      let val = res.workflowmaster;
      const getAppRank =
        val && val[0] && val[0].approvers
          ? val[0].approvers.find((x: any) => x === this.userDetails?.rankCode)
          : '';
      this.getApproveRank = getAppRank !== undefined ? getAppRank : 0;
      localStorage.setItem('AppRank', this.getApproveRank);
    });
  }
  getWrkFlSummary() {
    this.loaderService.loaderShow();
    this.appServices
      .getWorkFlowSummary(this.referenceNumber)
      .subscribe((res: any) => {
        this.getWrkFlSummaryData = res.response;
        this.loaderService.loaderHide();
      });
  }
  arrayObj: any[] = [];
  getGuideLinesData() {
    this.loaderService.loaderShow();
    this.appServices.getGuidelineData().subscribe((res: any) => {
      const data = res;
      this.getGuideLines = data;
      this.loaderService.loaderHide();
    });
  }

  ishighlightQuest(guidesId: any): boolean {
    return guidesId.qid === this.infoMQuestId;
  }
  showGuideQuestion(questID: any) {
    this.scrollToElement(questID);
  }

  submitFormAll(value: any, id: number, header?: string, mainQueId?: any) {
    this.chapterGrid();
    this.loaderService.loaderShow();
    var pendingResult: any = [];
    this.getMainQuestCounts.forEach((element: any) => {
      pendingResult.push({
        mainQuesId: element.qid,
        selected: element.selected,
      });
    });
    this.appServices.setPiqQuestionData(value.value);
    const currentVesselType = localStorage.getItem('currentVesselType');
    const ansPayload = {
      instanceid: this.referenceNumber,
      action: 'I',
      user: this.userDetails?.userCode,
      tenantIdentifier: '',
      answerdata: value.value,
      location: this.locationCode,
      mainQuestCheckbox: pendingResult,
      exceptionjson: this.exceptionList,
      wfaction: '',
      lastmodifieddata: JSON.stringify(this.lastModifiedData),
      duplicateDetails: this.arrayObj,
      certificatetab: this.saveMappedCertificateData,
      vesseltype: (
        currentVesselType === '' ||
        currentVesselType === undefined ||
        currentVesselType === 'undefined' ||
        currentVesselType === null
          ? ''
          : currentVesselType
      )
        ? currentVesselType
        : localStorage.getItem('vesselType')
        ? localStorage.getItem('vesselType')
        : '',
    };
    this.countDetails();
    this.appServices.getSaveValues(ansPayload).subscribe((res: any) => {
      this._snackBarService.loadSnackBar('Saved Successfully', colorCodes.INFO);
      localStorage.removeItem('vesselType');
      this.loaderService.loaderHide();
      this.appServices.setUnSaveAction(false);
      this.unSavedData = false;
      this.dialog.closeAll();
      this.getQuestionAnswerDatas('', id, header, mainQueId);
    });
  }

  toggleMemo() {
    this.memoVisible = !this.memoVisible;
  }

  getQuestionAnswerDatas(
    vesselCode?: any,
    id?: any,
    header?: string,
    mainQueId?: any
  ) {
    const payload = {
      instanceid: this.referenceNumber,
      presettype: 'n',
      companycode: this.userDetails.companyCode,
      username: this.userDetails.empCode,
      vesseltype:
        vesselCode === '' ||
        vesselCode === undefined ||
        vesselCode === 'undefined' ||
        vesselCode === null
          ? ''
          : vesselCode,
    };
    localStorage.setItem(
      'currentVesselType',
      vesselCode
        ? vesselCode === '' ||
          vesselCode === undefined ||
          vesselCode === 'undefined' ||
          vesselCode === null
          ? ''
          : vesselCode
        : ''
    );
    let formGroupFields: any = {};
    this.getMainQuestCounts = [];
    this.getPresetQuestCounts = [];
    this.appServices.getPiqQuestAns(payload).subscribe((res: any) => {
      localStorage.setItem(
        'currentVesselType',
        vesselCode
          ? vesselCode === '' ||
            vesselCode === undefined ||
            vesselCode === 'undefined' ||
            vesselCode === null
            ? ''
            : vesselCode
          : ''
      );
      this.getStatus = res.wrkflow;
      let object = JSON.parse(res.response);
      this.getOrigination = res.orginator;
      localStorage.setItem('Origination', res.orginator);
      localStorage.setItem('masterVesselCode', res.vesselcode);
      const regex = res && res.fileRegex ? res.fileRegex : '';
      this.appServices.setRegex(regex);
      this.appServices.setStatus(this.getStatus);
      this.vesselSelection = res.vesseltypename;
      const data = res && res.lastMod ? JSON.parse(res.lastMod) : [];

      if (data) {
        this.modifiedrowData = data;
        this.appServices.setModifiedRowData(this.modifiedrowData);
      }
      this.getRankLogic();
      if (res && res.guidence) {
        let guidenceObject = JSON.parse(res.guidence);
        let guidance = guidenceObject ? guidenceObject : [];
        this.appServices.setGuidelineData(guidance);
      }
      object.forEach((getAllValue: any) => {
        getAllValue.filledCount = 0;
        // if (getAllValue && getAllValue.values && getAllValue.values.length > 0) {
        getAllValue.values.forEach((value: any) => {
          value.question.forEach((subHeader: any) => {
            subHeader['isShowMainQues'] = false;
            // console.log(subHeader.qid, 'subHeader');

            if (subHeader && subHeader.qid) {
              formGroupFields[subHeader.qid] = new FormControl(
                subHeader.answer
              );
            }
            if (subHeader && !subHeader.isShowMainQues) {
              this.getMainQuestCounts.push(subHeader);
            }

            subHeader.subQuestion.forEach((mainQus: any) => {
              if (
                mainQus.entryorgin === 'Auto or Preset' ||
                mainQus.entryorgin === 'Preset'
              ) {
                this.getPresetQuestCounts.push(mainQus.qid);
                if (mainQus.answer === '') {
                  mainQus.answer = mainQus.presetvalue;
                  this.countDetails();
                }

                if (
                  mainQus &&
                  mainQus.hasOwnProperty('presetvalue') &&
                  mainQus.presetvalue &&
                  mainQus.answer !== mainQus.presetvalue
                ) {
                  this.exception(value, subHeader, mainQus, 2);
                }
              }

              const index = this.getMainQuestCounts.findIndex(
                (section: any) =>
                  section.mainQuestion === subHeader.mainQuestion
              );

              this.getMainQuestCounts[index] = subHeader;
              this.piqPendingCount();
              if (mainQus && mainQus.qid) {
                if (mainQus.type != 'MultiSelect') {
                  formGroupFields[mainQus.qid] = new FormControl(
                    mainQus.answer
                  );
                } else if (mainQus.type === 'MultiSelect') {
                  if (typeof mainQus.answer === 'string' && mainQus.answer) {
                    mainQus.multiAnswer = mainQus.multiAnswer.map((term: any) =>
                      term.trim()
                    );
                    if (!Array.isArray(mainQus.answer)) {
                      mainQus.answer = [];
                    }
                    mainQus.multiAnswer.forEach((multiRes: any) => {
                      mainQus.answer = mainQus.answer.concat(
                        multiRes.toString()
                      );
                      mainQus.answer = mainQus.answer.filter(
                        (item: any) => item !== ''
                      );
                    });
                  }
                  formGroupFields[mainQus.qid] = new FormControl(
                    mainQus.multiAnswer
                  );
                }
              }
              if (subHeader.entrymethod === 'Lookup') {
                if (mainQus && mainQus.type === 'Date') {
                  mainQus.savedAnswer =
                    mainQus && mainQus.answer
                      ? this.datePipe.transform(mainQus.answer, this.dateFormat)
                      : '';
                } else {
                  mainQus.savedAnswer = mainQus.answer;
                }
              }
            });
            this.dynamicForms = new FormGroup(formGroupFields);
            this.dynamicForms.patchValue({ Q133: this.vesselSelection });
            if (subHeader && subHeader.qid === 'MQ1') {
              subHeader.answer = this.vesselSelection;
              this.countDetails();
            }
          });
        });
        // }
      });
      this.getAllDatas = object;
      if (this.getAllDatas && this.getAllDatas.length > 0) {
        this.setVisibleQuestions();
      }
      if (
        vesselCode !== '' &&
        vesselCode !== undefined &&
        vesselCode !== 'undefined'
      ) {
        this.switchVeselException();
      } else if (
        res &&
        res.exceptionlist != '' &&
        this.exceptionList &&
        this.exceptionList.length === 0
      ) {
        let exceptionData = JSON.parse(res.exceptionlist);
        this.exceptionList = exceptionData;
        this.appServices.setExceptionData(exceptionData);
      }
      this.countDetails();
      this.piqPendingCount();
      this.presetQuestCount = this.getPresetQuestCounts.length;
      if (id) {
        if (this.getAllDatas) {
          this.selectValue(this.getAllDatas[0].values[0].subHeaders);
        }
        setTimeout(() => {
          if (
            this.getAllDatas &&
            this.getAllDatas[0] &&
            this.getAllDatas[0].values &&
            this.getAllDatas[0].values[0] &&
            this.getAllDatas[0].values[0].question &&
            this.getAllDatas[0].values[0].question[0] &&
            this.getAllDatas[0].values[0].question[0].subQuestion &&
            this.getAllDatas[0].values[0].question[0].subQuestion[0]
          ) {
            this.toggleSingleSelection(
              this.vesselSelection,
              this.getAllDatas[0].values[0],
              this.getAllDatas[0].values[0].question[0],
              this.getAllDatas[0].values[0].question[0].subQuestion[0],
              'initial'
            );
          }

          if (
            vesselCode !== '' &&
            vesselCode !== undefined &&
            vesselCode !== 'undefined'
          ) {
            this.appServices.setUnSaveAction(true);
          } else {
            this.appServices.setUnSaveAction(false);
          }
        }, 100);
      } else {
        if (header) {
          this.selectValue(header, mainQueId);
        }
      }

      this.mainQuestCounts = this.getMainQuestCounts.filter(
        (value: any) => !value.isShowMainQues
      ).length;
      this.expandMethod();
      this.getTopBarDatas();
    });
  }

  setVisibleQuestions() {
    this.getAllDatas.forEach((val: any) => {
      val.values.forEach((ques: any) => {
        ques.question.forEach((main: any) => {
          main.subQuestion.forEach((sub: any) => {
            if (
              sub.qid === 'Q4' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              main.subQuestion[2].isShowSubQues = true;
            } else if (
              sub.qid === 'Q7' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q21' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q36' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 8; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
              ques.question[4].isShowMainQues = true;
              ques.question[5].isShowMainQues = true;
              ques.question[6].isShowMainQues = true;
            } else if (
              sub.qid === 'Q50' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              main.subQuestion[1].isShowSubQues = true;
            } else if (
              sub.qid === 'Q136' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              main.subQuestion[1].isShowSubQues = true;
            } else if (
              sub.qid === 'Q139' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              main.subQuestion[1].isShowSubQues = true;
            } else if (
              sub.qid === 'Q141' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              main.subQuestion[1].isShowSubQues = true;
            } else if (
              sub.qid === 'Q142' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              main.subQuestion[1].isShowSubQues = true;
            } else if (
              sub.qid === 'Q145' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              main.subQuestion[1].isShowSubQues = true;
            } else if (
              sub.qid === 'Q155' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 6; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q77' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q83' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q89' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 5; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q212' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              ques.question[1].isShowMainQues = true;
            } else if (
              sub.qid === 'Q338' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q344' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q350' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q356' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q362' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q368' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q374' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q380' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q386' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q392' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q398' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q404' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q410' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q416' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q422' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q428' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q434' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q440' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q446' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q452' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q458' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q464' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q470' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q476' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q482' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q488' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q494' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q500' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q506' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 1; i <= 4; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q226' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              ques.question[1].isShowMainQues = true;
            } else if (
              sub.qid === 'Q252' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              main.subQuestion[1].isShowSubQues = true;
            } else if (
              sub.qid === 'Q255' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              main.subQuestion[1].isShowSubQues = true;
            } else if (
              sub.qid === 'Q258' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 2; i <= 31; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q290' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              for (let i = 2; i <= 5; i++) {
                main.subQuestion[i].isShowSubQues = true;
              }
            } else if (
              sub.qid === 'Q296' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              main.subQuestion[1].isShowSubQues = true;
            } else if (
              sub.qid === 'Q299' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              main.subQuestion[1].isShowSubQues = true;
            } else if (
              sub.qid === 'Q302' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              main.subQuestion[1].isShowSubQues = true;
            } else if (
              sub.qid === 'Q305' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              // for (let i = 1; i <= 4; i++) {
              //   main.subQuestion[i].isShowSubQues = true;
              // }
              ques.question[4].isShowMainQues = true;
              ques.question[5].isShowMainQues = true;
              ques.question[6].isShowMainQues = true;
              ques.question[7].isShowMainQues = true;
              ques.question[9].isShowMainQues = true;
            } else if (
              sub.qid === 'Q307' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              ques.question[4].isShowMainQues = true;
              ques.question[5].isShowMainQues = true;
              ques.question[6].isShowMainQues = true;
              ques.question[7].isShowMainQues = true;
              ques.question[9].isShowMainQues = true;
            } else if (
              sub.qid === 'Q309' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              ques.question[4].isShowMainQues = true;
              ques.question[5].isShowMainQues = true;
              ques.question[6].isShowMainQues = true;
              ques.question[7].isShowMainQues = true;
              ques.question[9].isShowMainQues = true;
            } else if (
              sub.qid === 'Q311' &&
              (sub.answer === undefined || sub.answer === '')
            ) {
              ques.question[4].isShowMainQues = true;
              ques.question[5].isShowMainQues = true;
              ques.question[6].isShowMainQues = true;
              ques.question[7].isShowMainQues = true;
              ques.question[9].isShowMainQues = true;
            }
          });
        });
      });
    });
    this.countDetails();
  }

  getRankLogic() {
    if (this.route.snapshot.paramMap.get('type') == 'new') {
      this.disableEditMode = true;
      this.saveDisable = false;
      this.viewMode = false;
    }

    if (
      this.getOrigination == 'CNT001' &&
      this.userDetails?.cntrlType === 'CNT002'
    ) {
      this.hideReqBtns = true;
    }
    if (this.route.snapshot.paramMap.get('type') == 'view') {
      if (this.route.snapshot.paramMap.get('loadType') === 'form') {
        this.tabGroup.selectedIndex = 1;
      }
      if (
        this.getOrigination == 'CNT001' &&
        this.userDetails?.cntrlType === 'CNT002'
      ) {
        this.viewMode = false;
      } else {
        this.viewMode = true;
      }
      this.saveDisable = true;
      if (this.userDetails?.cntrlType === 'CNT002') {
        if (this.getOrigination == 'CNT002' && this.getStatus != 'Submitted') {
          this.disableEditMode = false;
        } else {
          this.disableEditMode = true;
          this.viewMode = false;
        }
      } else if (this.userDetails?.cntrlType === 'CNT001') {
        if (this.getOrigination == 'CNT001' && this.getStatus != 'Approved') {
          this.disableEditMode = false;
        } else if (
          this.getOrigination == 'CNT002' &&
          (this.getStatus == 'Submitted' || this.getStatus == 'ReAssigned')
        ) {
          this.disableEditMode = false;
        } else if (
          this.getOrigination == 'CNT002' &&
          this.getStatus == 'Inprogress'
        ) {
          this.viewMode = true;
        }
      }
    } else {
      this.saveDisable = false;
    }
  }

  openDesc(event: Event, questID: any) {
    let guidance = document.getElementById('guidanceWrapper');
    let contentArea = document.getElementById('contentArea');
    let sideBar = document.getElementById('sideBarList');

    if (contentArea?.classList.contains('col-sm-12')) {
      contentArea?.classList.remove('col-sm-12', 'expandedContent');
      contentArea?.classList.add('col-sm-9');
      contentArea?.classList.add('test');
      guidance?.classList.add('guideWrapExpanded');
      guidance?.classList.remove('guideWrap');
    } else if (contentArea?.classList.contains('col-sm-9' && 'test')) {
      guidance?.classList.add('guideWrapExpanded');
      guidance?.classList.remove('guideWrap');
      sideBar?.classList.add('sideCollapse');
    } else if (contentArea?.classList.contains('col-sm-9')) {
      sideBar?.classList.add('sideCollapse');
      contentArea?.classList.add('test');
      guidance?.classList.add('guideWrapExpanded');
      guidance?.classList.remove('guideWrap');
    }

    this.infoMQuestId = questID;
    setTimeout(() => {
      this.showGuideQuestion(questID);
    }, 1000);
    if (this.headerListContainer) {
      this.headerListContainer = false;
      this.descriptionContainer = true;
    } else if (this.descriptionContainer) {
      this.headerListContainer = true;
      this.descriptionContainer = false;
    }
    event.preventDefault();
    event.stopPropagation();
  }

  hideSideBar(event: any) {
    this.isLeftIcon = !this.isLeftIcon;
    let sideBar = document.getElementById('sideBarList');
    let pending = document.getElementById('pendingArea');
    let contentArea = document.getElementById('contentArea');
    let expColl = document.getElementById('expCol');
    let guidance = document.getElementById('guidanceWrapper');
    sideBar?.classList.add('sideCollapse');

    if (contentArea?.classList.contains('col-sm-9' && 'test')) {
      contentArea?.classList.remove('col-sm-12', 'expandedContent');
      expColl?.classList.remove('hideCol');
      contentArea?.classList.add('col-sm-9');
      pending?.classList.remove('col-sm-12', 'expandedContent');
      pending?.classList.add('col-sm-9');
      contentArea?.classList.remove('test');
      guidance?.classList.add('guideWrap');
      guidance?.classList.remove('guideWrapExpanded');
      sideBar?.classList.remove('sideCollapse');
    } else if (
      contentArea?.classList.contains('col-sm-9') ||
      pending?.classList.contains('col-sm-9')
    ) {
      contentArea?.classList.remove('col-sm-9');
      expColl?.classList.add('hideCol');
      contentArea?.classList.add('col-sm-12', 'expandedContent');
      pending?.classList.remove('col-sm-9');
      pending?.classList.add('col-sm-12', 'expandedContent');
    } else if (
      contentArea?.classList.contains('col-sm-12') ||
      pending?.classList.contains('col-sm-12')
    ) {
      contentArea?.classList.remove('col-sm-12', 'expandedContent');
      expColl?.classList.remove('hideCol');
      contentArea?.classList.add('col-sm-9');
      pending?.classList.remove('col-sm-12', 'expandedContent');
      pending?.classList.add('col-sm-9');
      sideBar?.classList.remove('sideCollapse');
    } else {
      contentArea?.classList.remove('col-sm-12', 'expandedContent');
      expColl?.classList.remove('hideCol');
      contentArea?.classList.add('col-sm-9');
      pending?.classList.remove('col-sm-12', 'expandedContent');
      pending?.classList.add('col-sm-9');
      sideBar?.classList.remove('sideCollapse');
      this.isLeftIcon = true;
    }

    event.preventDefault();
    event.stopPropagation();
  }

  closeDesc() {
    let contentArea = document.getElementById('contentArea');
    let guidance = document.getElementById('guidanceWrapper');
    if (contentArea?.classList.contains('col-sm-9')) {
      contentArea?.classList.add('col-sm-12', 'expandedContent');
      contentArea?.classList.remove('col-sm-9');
      guidance?.classList.add('guideWrap');
      guidance?.classList.remove('guideWrapExpanded');
    }
  }

  selectValue(value: string, mainQueId?: any) {
    this.selectedValue = value;
    this.ShowAllQuest();
    const foundObject = this.getAllDatas.find((section: any) => {
      return section.values.find(
        (subSection: any) => subSection.subHeaders === this.selectedValue
      );
    });
    this.selectedQuestion = foundObject.values;
    const subIndex = this.selectedQuestion.findIndex(
      (subSection: any) => subSection.subHeaders == this.selectedValue
    );
    this.scrollToElement(subIndex);

    if (mainQueId) {
      this.scrollToDivElement(mainQueId);
    }
    this.countDetails();
  }

  exceptionFn(ques: any, mquest: any, quest: any) {
    const duplicateResponse = this.exceptionList.find(
      (x) => x.qid === quest.qid
    );

    if (duplicateResponse === undefined) {
      this.exception(ques, mquest, quest, 1);
    } else {
      duplicateResponse.answer = quest.answer;
      const dialogRef = this.dialog.open(ExceptionRemarkComponent, {
        disableClose: true,
        panelClass: 'exceptionRemark-dialog-container',
        data: duplicateResponse.remark,
      });
      this._snackBarService.loadSnackBar(
        'Changing company preset data will be captured as Exception.',
        colorCodes.WARNING
      );
      dialogRef.afterClosed().subscribe((result) => {
        duplicateResponse.remark = result ? result : '';
        this.appServices.setExceptionData(this.exceptionList);
      });
      this.countDetails();
    }
  }

  exceptionDateFn(ques: any, mquest: any, quest: any) {
    if (quest && (quest.type === 'Date' || quest.type === 'Select')) {
      if (quest.type === 'Date') {
        quest.answer = this.datePipe.transform(quest.answer, this.dateFormat);
      }
      this.countDetails();
      const duplicateResponse = this.exceptionList.find(
        (x) => x.qid === quest.qid
      );
      if (duplicateResponse === undefined) {
        this.exception(ques, mquest, quest, 1);
      } else {
        duplicateResponse.answer = quest.answer;
      }
    }
  }

  scrollToElement(elementId: string): void {
    const element = document.getElementById(`${elementId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToDivElement(elementId: string): void {
    const element = document.getElementById(`${elementId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  toggleExpandAll() {
    this.expandAll = !this.expandAll;
    this.getAllDatas.forEach(
      (heading: any) => (heading.expanded = this.expandAll)
    );
    const expandIcon = document.getElementById('expandIcon');
    this.expandAll
      ? this.renderer.setProperty(expandIcon, 'textContent', 'expand_less')
      : this.renderer.setProperty(expandIcon, 'textContent', 'expand_more');
  }

  toggleExpandHeader(heading: any) {
    heading.expanded = true;
    this.getAllDatas.forEach((head: any) => {
      if (head !== heading) {
        head.expanded = false;
      }
    });

    if (heading.expanded && this.expandedSection) {
      this.scrollToExpandedSection();
    }
    const index = this.getAllDatas.findIndex(
      (section: any) => section.header === heading.header
    );
    this.selectedQuestion = this.getAllDatas[index].values;
    this.scrollToElement('0');
  }

  scrollToExpandedSection() {
    setTimeout(() => {
      this.expandedSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  toggleMultiSelection(value: any, entryorgin: any, quest: any) {
    this.appServices.setUnSaveAction(true);
    if (value) {
      if (entryorgin.multiAnswer.includes(value)) {
        entryorgin.multiAnswer = entryorgin.multiAnswer.filter(
          (item: any) => item !== value
        );
        entryorgin.answer = entryorgin.answer.filter(
          (item: any) => item !== value.toString()
        );
      } else {
        if (value.toString() != '') {
          entryorgin.multiAnswer.push(value);
          if (!Array.isArray(entryorgin.answer)) {
            entryorgin.answer = [entryorgin.answer];
          }
          entryorgin.answer = entryorgin.answer.concat(value.toString());
          entryorgin.answer = entryorgin.answer.filter(
            (item: any) => item !== ''
          );
        }
      }
    }
    this.selectedValue = quest && quest.subHeaders ? quest.subHeaders : '';
    this.chapterGrid();
  }
  isOptionSelected(selecVal: any, answer: any): boolean {
    return Array.isArray(answer) && answer.includes(selecVal);
  }
  onFilterChanged() {
    this.totalRowCount = this.gridApi.getDisplayedRowCount();
  }
  tooltipRemark = '';
  fetchRemark(subq: any) {
    const findValue = this.exceptionList.find((x) => x.qid === subq.qid);
    this.tooltipRemark = findValue && findValue.remark ? findValue.remark : '';
  }
  toggleSingleSelection(
    value: string,
    ques: any,
    mainQue: any,
    subQue: any,
    type?: any,
    id?: number
  ): void {
    if (type === 'initial') {
      const currentVesselType = localStorage.getItem('currentVesselType');
      if (currentVesselType) {
        localStorage.setItem('vesselType', currentVesselType);
        localStorage.removeItem('currentVesselType');
      }
    }

    if (
      subQue.entryorgin === 'Auto or Preset' ||
      subQue.entryorgin === 'Preset'
    ) {
      if (subQue.answer !== '' && value === subQue.answer) {
        return;
      }
    }
    if (type === '' && value === subQue.answer) {
      value = '';
    }
    if (value === '' && subQue.qid === 'Q133') {
      this._snackBarService.loadSnackBar(
        'Vessel Type Mandatory',
        colorCodes.ERROR
      );
      return;
    }
    if (subQue.qid === 'Q4') {
      const flag = value === questionValue.YES ? false : true;
      this.quesShowHideValidationIndex1(mainQue.subQuestion, 2, flag);
      this.answerRemoveValidationIndex1(mainQue.subQuestion, 2);
      this.dynamicForms.patchValue({
        Q5: '',
      });
    } else if (subQue.qid === 'Q7') {
      const flag = value === questionValue.YES ? false : true;
      this.quesShowHideValidationIndex4(mainQue.subQuestion, flag);
      this.answerRemoveValidationIndex(mainQue.subQuestion, 4);
      this.dynamicForms.patchValue({
        Q8: '',
        Q9: '',
        Q10: '',
        Q11: '',
      });
    } else if (subQue.qid === 'Q21') {
      const flag = value === questionValue.YES ? false : true;
      this.quesShowHideValidationIndex4(mainQue.subQuestion, flag);
      this.answerRemoveValidationIndex(mainQue.subQuestion, 4);
      this.dynamicForms.patchValue({
        Q22: '',
        Q23: '',
        Q24: '',
        Q25: '',
      });
    } else if (subQue.qid === 'Q36') {
      if (value === questionValue.YES) {
        this.quesShowHideValidationIndex8(mainQue.subQuestion, false);
        ques.question[4].isShowMainQues = false;
        ques.question[5].isShowMainQues = false;
        ques.question[6].isShowMainQues = false;
      } else {
        this.quesShowHideValidationIndex8(mainQue.subQuestion, true);
        ques.question[4].isShowMainQues = true;
        ques.question[5].isShowMainQues = true;
        ques.question[6].isShowMainQues = true;
      }
      this.answerRemoveValidationIndex(mainQue.subQuestion, 8);
      this.dynamicForms.patchValue({
        Q37: '',
        Q38: '',
        Q39: '',
        Q40: '',
        Q41: '',
        Q42: '',
        Q43: '',
        Q44: '',
      });
    } else if (subQue.qid === 'Q50') {
      if (value === 'Other (Please Specify)') {
        mainQue.subQuestion[1].isShowSubQues = false;
      } else {
        mainQue.subQuestion[1].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q136') {
      const flag = value === questionValue.YES ? false : true;
      this.quesShowHideValidationIndex1(mainQue.subQuestion, 1, flag);
      this.answerRemoveValidationIndex1(mainQue.subQuestion, 1);
      this.dynamicForms.patchValue({
        Q137: '',
      });
    } else if (subQue.qid === 'Q139') {
      const flag = value === questionValue.YES ? false : true;
      this.quesShowHideValidationIndex1(mainQue.subQuestion, 1, flag);
      this.answerRemoveValidationIndex1(mainQue.subQuestion, 1);
      this.dynamicForms.patchValue({
        Q140: '',
      });
    } else if (subQue.qid === 'Q142') {
      const flag = value === questionValue.YES ? false : true;
      this.quesShowHideValidationIndex1(mainQue.subQuestion, 1, flag);
      this.answerRemoveValidationIndex1(mainQue.subQuestion, 1);
      this.dynamicForms.patchValue({
        Q143: '',
      });
    } else if (subQue.qid === 'Q145') {
      const flag = value === questionValue.YES ? false : true;
      this.quesShowHideValidationIndex1(mainQue.subQuestion, 1, flag);
      this.answerRemoveValidationIndex1(mainQue.subQuestion, 1);
      this.dynamicForms.patchValue({
        Q146: '',
      });
    } else if (subQue.qid === 'Q155') {
      const flag = value === questionValue.YES ? false : true;
      this.quesShowHideValidationIndex6(mainQue.subQuestion, flag);
      this.answerRemoveValidationIndex(mainQue.subQuestion, 6);
      this.dynamicForms.patchValue({
        Q156: '',
        Q157: '',
        Q158: '',
        Q159: '',
        Q160: '',
        Q161: '',
      });
    } else if (subQue.qid === 'Q77') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q83') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q89') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 5; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 5; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q212') {
      if (value === questionValue.YES) {
        ques.question[1].isShowMainQues = false;
      } else {
        ques.question[1].isShowMainQues = true;
      }
    } else if (subQue.qid === 'Q338') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q344') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q350') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q356') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q362') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q368') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q374') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q380') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q386') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q386') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q392') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q398') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q404') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q410') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q416') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q422') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q428') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q434') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q440') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q446') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q452') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q458') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q464') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q470') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q476') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q482') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q488') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q494') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q500') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q506') {
      if (value === questionValue.YES) {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
      } else {
        for (let i = 1; i <= 4; i++) {
          mainQue.subQuestion[i].isShowSubQues = true;
        }
      }
    } else if (subQue.qid === 'Q226') {
      if (value === questionValue.YES) {
        ques.question[1].isShowMainQues = false;
      } else {
        ques.question[1].isShowMainQues = true;
      }
    } else if (subQue.qid === 'Q252') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[1].isShowSubQues = false;
      } else {
        mainQue.subQuestion[1].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q255') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[1].isShowSubQues = false;
      } else {
        mainQue.subQuestion[1].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q258') {
      if (value === questionValue.YES) {
        for (let i = 2; i <= 30; i += 2) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
        // mainQue.subQuestion[2].isShowSubQues = false;
        // mainQue.subQuestion[4].isShowSubQues = false;
        // mainQue.subQuestion[6].isShowSubQues = false;
        // mainQue.subQuestion[8].isShowSubQues = false;
        // mainQue.subQuestion[10].isShowSubQues = false;
        // mainQue.subQuestion[12].isShowSubQues = false;
        // mainQue.subQuestion[14].isShowSubQues = false;
        // mainQue.subQuestion[16].isShowSubQues = false;
        // mainQue.subQuestion[18].isShowSubQues = false;
        // mainQue.subQuestion[20].isShowSubQues = false;
        // mainQue.subQuestion[22].isShowSubQues = false;
        // mainQue.subQuestion[24].isShowSubQues = false;
        // mainQue.subQuestion[26].isShowSubQues = false;
        // mainQue.subQuestion[28].isShowSubQues = false;
        // mainQue.subQuestion[30].isShowSubQues = false;
        // for (let i = 2; i <= 31; i++) {
        //   mainQue.subQuestion[i].isShowSubQues = false;
        // }
      } else {
        for (let i = 2; i <= 30; i += 2) {
          mainQue.subQuestion[i].isShowSubQues = false;
        }
        // mainQue.subQuestion[2].isShowSubQues = true;
        // mainQue.subQuestion[4].isShowSubQues = true;
        // mainQue.subQuestion[6].isShowSubQues = true;
        // mainQue.subQuestion[8].isShowSubQues = true;
        // mainQue.subQuestion[10].isShowSubQues = true;
        // mainQue.subQuestion[12].isShowSubQues = true;
        // mainQue.subQuestion[14].isShowSubQues = true;
        // mainQue.subQuestion[16].isShowSubQues = true;
        // mainQue.subQuestion[18].isShowSubQues = true;
        // mainQue.subQuestion[20].isShowSubQues = true;
        // mainQue.subQuestion[22].isShowSubQues = true;
        // mainQue.subQuestion[24].isShowSubQues = true;
        // mainQue.subQuestion[26].isShowSubQues = true;
        // mainQue.subQuestion[28].isShowSubQues = true;
        // mainQue.subQuestion[30].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q259') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[3].isShowSubQues = false;
      } else {
        mainQue.subQuestion[3].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q261') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[5].isShowSubQues = false;
      } else {
        mainQue.subQuestion[5].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q263') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[7].isShowSubQues = false;
      } else {
        mainQue.subQuestion[7].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q265') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[9].isShowSubQues = false;
      } else {
        mainQue.subQuestion[9].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q267') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[11].isShowSubQues = false;
      } else {
        mainQue.subQuestion[11].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q269') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[13].isShowSubQues = false;
      } else {
        mainQue.subQuestion[13].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q271') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[15].isShowSubQues = false;
      } else {
        mainQue.subQuestion[15].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q273') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[17].isShowSubQues = false;
      } else {
        mainQue.subQuestion[17].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q275') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[19].isShowSubQues = false;
      } else {
        mainQue.subQuestion[19].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q277') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[21].isShowSubQues = false;
      } else {
        mainQue.subQuestion[21].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q279') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[23].isShowSubQues = false;
      } else {
        mainQue.subQuestion[23].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q281') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[25].isShowSubQues = false;
      } else {
        mainQue.subQuestion[25].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q283') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[27].isShowSubQues = false;
      } else {
        mainQue.subQuestion[27].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q285') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[29].isShowSubQues = false;
      } else {
        mainQue.subQuestion[29].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q287') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[31].isShowSubQues = false;
      } else {
        mainQue.subQuestion[31].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q290') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[2].isShowSubQues = false;
        mainQue.subQuestion[4].isShowSubQues = false;
      } else {
        mainQue.subQuestion[2].isShowSubQues = true;
        mainQue.subQuestion[4].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q291') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[3].isShowSubQues = false;
      } else {
        mainQue.subQuestion[3].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q293') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[5].isShowSubQues = false;
      } else {
        mainQue.subQuestion[5].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q296') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[1].isShowSubQues = false;
      } else {
        mainQue.subQuestion[1].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q299') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[1].isShowSubQues = false;
      } else {
        mainQue.subQuestion[1].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q302') {
      if (value === questionValue.YES) {
        mainQue.subQuestion[1].isShowSubQues = false;
      } else {
        mainQue.subQuestion[1].isShowSubQues = true;
      }
    } else if (subQue.qid === 'Q305') {
      if (value === questionValue.YES) {
        // for (let i = 1; i <= 4; i++) {
        //   mainQue.subQuestion[i].isShowSubQues = true;
        // }
        ques.question[4].isShowMainQues = false;
        ques.question[5].isShowMainQues = false;
        ques.question[6].isShowMainQues = false;
        ques.question[7].isShowMainQues = false;
        ques.question[9].isShowMainQues = false;
      } else {
        // for (let i = 1; i <= 4; i++) {
        //   main.subQuestion[i].isShowSubQues = true;
        // }
        ques.question[4].isShowMainQues = true;
        ques.question[5].isShowMainQues = true;
        ques.question[6].isShowMainQues = true;
        ques.question[7].isShowMainQues = true;
        ques.question[9].isShowMainQues = true;
      }
    } else if (subQue.qid === 'Q307') {
      if (value === questionValue.YES) {
        // for (let i = 1; i <= 4; i++) {
        //   main.subQuestion[i].isShowSubQues = true;
        // }
        ques.question[4].isShowMainQues = false;
        ques.question[5].isShowMainQues = false;
        ques.question[6].isShowMainQues = false;
        ques.question[7].isShowMainQues = false;
        ques.question[9].isShowMainQues = false;
      } else {
        // for (let i = 1; i <= 4; i++) {
        //   main.subQuestion[i].isShowSubQues = true;
        // }
        ques.question[4].isShowMainQues = true;
        ques.question[5].isShowMainQues = true;
        ques.question[6].isShowMainQues = true;
        ques.question[7].isShowMainQues = true;
        ques.question[9].isShowMainQues = true;
      }
    } else if (subQue.qid === 'Q309') {
      if (value === questionValue.YES) {
        // for (let i = 1; i <= 4; i++) {
        //   main.subQuestion[i].isShowSubQues = true;
        // }
        ques.question[4].isShowMainQues = false;
        ques.question[5].isShowMainQues = false;
        ques.question[6].isShowMainQues = false;
        ques.question[7].isShowMainQues = false;
        ques.question[9].isShowMainQues = false;
      } else {
        // for (let i = 1; i <= 4; i++) {
        //   main.subQuestion[i].isShowSubQues = true;
        // }
        ques.question[4].isShowMainQues = true;
        ques.question[5].isShowMainQues = true;
        ques.question[6].isShowMainQues = true;
        ques.question[7].isShowMainQues = true;
        ques.question[9].isShowMainQues = true;
      }
    } else if (subQue.qid === 'Q311') {
      if (value === questionValue.YES) {
        // for (let i = 1; i <= 4; i++) {
        //   main.subQuestion[i].isShowSubQues = true;
        // }
        ques.question[4].isShowMainQues = false;
        ques.question[5].isShowMainQues = false;
        ques.question[6].isShowMainQues = false;
        ques.question[7].isShowMainQues = false;
        ques.question[9].isShowMainQues = false;
      } else {
        // for (let i = 1; i <= 4; i++) {
        //   main.subQuestion[i].isShowSubQues = true;
        // }
        ques.question[4].isShowMainQues = true;
        ques.question[5].isShowMainQues = true;
        ques.question[6].isShowMainQues = true;
        ques.question[7].isShowMainQues = true;
        ques.question[9].isShowMainQues = true;
      }
    }

    if (type === '' && subQue.qid === 'Q133') {
      this.getvesseltype();
      this.switchVesselType();
    } else {
      this.appServices.setVesselTypeData(this.vesselSelection);
    }

    this.appServices.setUnSaveAction(true);
    subQue.answer = subQue.answer !== value ? value : subQue.answer;
    value = subQue.answer === '' ? '' : subQue.answer;

    const mQuestion = mainQue.mainQuestion;
    const str = mQuestion.split(' ');
    let questionId = '';
    if (str && str.length > 0) {
      if (str[0].endsWith('.')) {
        const stringWithoutLastDot = str[0].slice(0, -1);
        str[0] = stringWithoutLastDot;
      }
      const matchResult = str[0].match(/\d+\.\d+\.\d+(\.\d+)?/);
      if (matchResult) {
        questionId = matchResult[0];
      } else {
        const modifiedStr = str[0].replace(/\.\w*$/, '');
        questionId = modifiedStr;
      }
    }

    if (
      questionId === '2.3.3.1' ||
      questionId === '2.3.3.2' ||
      questionId === '2.3.3.3'
    ) {
      this.getPMSDetail(questionId, ques, mainQue, subQue, 'select');
    }
    if (questionId === '2.8.2') {
      this.getPscDetail(questionId, ques, mainQue, subQue);
    }
    if (ques && ques.subheadid === 'SH14') {
      this.safetyManagementDetails(questionId, ques, mainQue, subQue, 'Select');
    }
    if (questionId.includes('2.5')) {
      this.getMocDetail(ques, mainQue, subQue);
    }
    const modifiedData = {
      userName: this.userDetails.userData.mdata.appInfo.userName,
      userType: this.userDetails.userData.mdata.userInfo.userType,
      header: ques.subHeaders,
      mainQuestion: mainQue.mainQuestion,
      subID: subQue.qid,
      subQuestion: subQue.subName,
      answer: value,
      sortingDate: new Date(),
      modifiedDateTime: this.datePipe.transform(
        new Date(),
        this.dateTimeFormat
      ),
    };
    this.lastModifiedData.push(modifiedData);
    this.lastModifiedData.sort((a, b) => b.sortingDate - a.sortingDate);
    if (this.lastModifiedData.length > 10) {
      this.lastModifiedData.splice(0, 1);
    }
    this.countDetails();
    this.selectedValue = ques && ques.subHeaders ? ques.subHeaders : '';
    if (subQue && subQue.presetvalue === subQue.answer) {
      this.restoreOriginal(subQue);
    } else {
      if (
        subQue &&
        (subQue.entryorgin === 'Auto or Preset' ||
          subQue.entryorgin === 'Preset') &&
        subQue.presetvalue
      ) {
        this.exceptionFn(ques, mainQue, subQue);
      }
    }
    this.dynamicForms.controls[subQue.qid].setValue(value);
    this.chapterGrid();
  }

  quesShowHideValidationIndex1(question: any, index: number, value: boolean) {
    question[index].isShowSubQues = value;
  }

  quesShowHideValidationIndex4(question: any, value: boolean) {
    for (let i = 1; i <= 4; i++) {
      question[i].isShowSubQues = value;
    }
  }

  quesShowHideValidationIndex6(question: any, value: boolean) {
    for (let i = 1; i <= 6; i++) {
      question[i].isShowSubQues = value;
    }
  }

  quesShowHideValidationIndex8(question: any, value: boolean) {
    for (let i = 1; i <= 8; i++) {
      question[i].isShowSubQues = value;
    }
  }

  answerRemoveValidationIndex1(question: any, index: number) {
    question[index].answer = '';
  }


  answerRemoveValidationIndex(question: any, nValue: number) {
    for (let i = 1; i <= nValue; i++) {
      question[i].answer = '';
    }
  }



  getMocDetail(subQues: any, mquest: any, subq: any) {
    let hasMocData = false;
    const vesselCode = localStorage.getItem('masterVesselCode');
    this.appServices
      .getMocDetails(vesselCode, this.referenceNumber, '2.5.')
      .subscribe((data) => {
        if (
          data.response.some(
            (element: any) =>
              element.q136 || element.q139 || element.q142 || element.q145
          )
        ) {
          hasMocData = true;
        }
        if (hasMocData) {
          let fetchData = data.response.some(
            (element: any) => element[subq.qid.toLowerCase()]
          );
          fetchData = fetchData ? 'Yes' : 'No';
          subq.savedAnswer = fetchData;
          if (fetchData != this.dynamicForms.value[subq.qid]) {
            this.exceptionDateFn(subQues, mquest, subq);
          } else {
            const exceptioDetails = [...this.exceptionList];
            const filterMquest = exceptioDetails.filter((exc) => {
              return (
                mquest.qid === exc.mainQueId &&
                exc.mainQuestion === mquest.mainQuestion
              );
            });
            filterMquest.forEach((data) => {
              this.exceptionList.forEach((filter: any, index: number) => {
                if (filter.guid.value === data.guid.value) {
                  this.exceptionList.splice(index, 1);
                }
              });
            });

            this.updateExceptionList();
          }
        }
      });
  }
  getvesseltype() {
    this.appServices.getvesseltypeNameCode().subscribe((res: any) => {
      this.vesselTypeCode = res.response;
    });
  }
  switchVesselType() {
    const dialogRef = this.dialog.open(SwitchVesselTypeComponent, {
      disableClose: true,
      panelClass: 'switchVessel-dialog-container',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getvesseltype();
      if (result && this.vesselTypeCode && this.vesselTypeCode.length > 0) {
        localStorage.removeItem('getSelectedCheckListID');
        const vesselCode = this.vesselTypeCode.find(
          (x: any) => x.vesseltypename === this.dynamicForms.value.Q133
        );
        if (vesselCode && vesselCode.vesseltypecode) {
          this.getQuestionAnswerDatas(vesselCode.vesseltypecode, 1);
          const emptyProperty: any[] = [];
          this.appServices.setExceptionData(emptyProperty);
          this.appServices.setUnSaveAction(true);
          return;
        }
      } else {
        this.toggleSingleSelection(
          this.vesselSelection,
          this.getAllDatas[0].values[0],
          this.getAllDatas[0].values[0].question[0],
          this.getAllDatas[0].values[0].question[0].subQuestion[0],
          'initial'
        );
      }
    });
  }

  switchVeselException() {
    this.exceptionList = [];
    this.getAllDatas.forEach((getAllValue: any) => {
      getAllValue.values.forEach((value: any) => {
        value.question.forEach((subHeader: any) => {
          subHeader.subQuestion.forEach((mainQus: any) => {
            if (
              mainQus &&
              mainQus.hasOwnProperty('presetvalue') &&
              mainQus.presetvalue &&
              mainQus.answer !== mainQus.presetvalue
            ) {
              this.exception(value, subHeader, mainQus, 1);
            }
          });
        });
      });
    });
  }

  countDetails() {
    if (this.getAllDatas && this.getAllDatas.length > 0) {
      let filterResponse: any;
      let filterQuestions = 0;
      let filterPendingQuestion = 0;
      let filterPendingResponse: any;

      this.getAllDatas.forEach((getAllValue: any) => {
        if (getAllValue && getAllValue.values) {
          getAllValue.values.forEach((value: any) => {
            value.question.forEach((subHeader: any) => {
              // isShowMainQues
              filterResponse = subHeader.subQuestion.filter((a: any) => {
                return (
                  !subHeader.isShowMainQues &&
                  !a.isShowSubQues &&
                  a.answer != '' &&
                  a.answer != undefined &&
                  a.answer != null &&
                  a.answer
                );
              });
              filterPendingResponse = subHeader.subQuestion.filter((a: any) => {
                return (
                  !subHeader.isShowMainQues &&
                  !a.isShowSubQues &&
                  (a.answer === '' ||
                    a.answer === undefined ||
                    a.answer === null ||
                    a.answer === '[]')
                );
              });
              filterPendingQuestion += filterPendingResponse.length;
              filterQuestions += filterResponse.length;
              subHeader.selected =
                filterResponse.length === subHeader.subQuestion.length;

              if (subHeader && subHeader.selected) {
                const index = this.getMainQuestCounts.findIndex(
                  (section: any) =>
                    section.mainQuestion === subHeader.mainQuestion
                );
                this.getMainQuestCounts[index] = subHeader;
                this.piqPendingCount();
              }
            });
          });
        }
      });

      this.getAllDatas.forEach((getAllValue: any) => {
        if (getAllValue && getAllValue.values) {
          getAllValue.values.forEach((value: any) => {
            value.selected = true;
            value.question.forEach((subHeader: any) => {
              subHeader.subQuestion.forEach((subQues: any) => {
                if (
                  (subQues &&
                    !subHeader.isShowMainQues &&
                    !subQues.isShowSubQues &&
                    subQues.answer === '') ||
                  subQues.answer === undefined ||
                  subQues.answer === null ||
                  subQues.answer === '[]'
                ) {
                  value.selected = false;
                }
              });
            });
          });
        }
      });

      this.getAllDatas.forEach((getAllValue: any) => {
        if (getAllValue && getAllValue.values) {
          const filledCountDetails = getAllValue.values.filter((res: any) => {
            return res.selected;
          });

          getAllValue.filledCount =
            filledCountDetails && filledCountDetails.length > 0
              ? filledCountDetails.length
              : 0;
        }
      });
      if (this.dynamicForms && this.dynamicForms.value) {
        this.appServices.setPiqQuestionData(this.dynamicForms.value);
      }
    }
  }

  piqPendingCount() {
    let booleanCount: any = [];
    this.getMainQuestCounts.forEach((element: any) => {
      if (element && !element.isShowMainQues && !element.selected) {
        booleanCount.push(element.selected);
      }
    });
    this.pendingCount =
      booleanCount && booleanCount.length > 0 ? booleanCount.length : 0;
  }
  exception(ques: any, mainQue: any, subQue: any, id: any, payLoad?: any) {
    const sqid = subQue.sid;
    const splitValue = sqid.split('.');
    splitValue.shift();
    const currentVesselType = localStorage.getItem('currentVesselType');

    if (id === 0 || id === 1) {
      if (
        currentVesselType === '' ||
        currentVesselType === undefined ||
        currentVesselType === 'undefined' ||
        (currentVesselType === null && subQue.presetvalue)
      ) {
        const dialogRef = this.dialog.open(ExceptionRemarkComponent, {
          disableClose: true,
          panelClass: 'exceptionRemark-dialog-container',
          data: '',
        });
        this._snackBarService.loadSnackBar(
          'Changing company preset data will be captured as Exception.',
          colorCodes.WARNING
        );
        dialogRef.afterClosed().subscribe((result) => {
          let exceptionData: any;
          if (result) {
            exceptionData = {
              guid: Guid.create(),
              mainId: ques.subheadid,
              mainQueId: mainQue.qid,
              qid: subQue.qid,
              subHeaders: ques.subHeaders,
              mainQuestion: mainQue.mainQuestion,
              subName: splitValue.join('.') + ' ' + subQue.subName,
              presetValue: subQue.presetvalue,
              // savedAnswer:
              //   subQue.entryorgin === 'Auto or Preset' ||
              //   subQue.entryorgin === 'Preset'
              //     ? ''
              //     : subQue.savedAnswer,
              savedAnswer: subQue.savedAnswer,
              answer: subQue.answer,
              remark: result,
            };
            if (id === 0) {
              this.lookupResetBtn(payLoad.questionId, payLoad.jobid, '');
            }
          } else {
            exceptionData = {
              guid: Guid.create(),
              mainId: ques.subheadid,
              qid: subQue.qid,
              mainQueId: mainQue.qid,
              subHeaders: ques.subHeaders,
              mainQuestion: mainQue.mainQuestion,
              subName: splitValue.join('.') + ' ' + subQue.subName,
              presetValue: subQue.presetvalue,
              // savedAnswer:
              //   subQue.entryorgin === 'Auto or Preset' ||
              //   subQue.entryorgin === 'Preset'
              //     ? ''
              //     : subQue.savedAnswer,
              savedAnswer: subQue.savedAnswer,
              answer: subQue.answer,
              remark: '',
            };
          }
          this.exceptionList.push(exceptionData);

          this.updateExceptionList();
        });
      } else {
        let exceptionData: any;
        exceptionData = {
          guid: Guid.create(),
          mainId: ques.subheadid,
          qid: subQue.qid,
          mainQueId: mainQue.qid,
          subHeaders: ques.subHeaders,
          mainQuestion: mainQue.mainQuestion,
          subName: splitValue.join('.') + ' ' + subQue.subName,
          presetValue: subQue.presetvalue,
          // savedAnswer:
          //   subQue.entryorgin === 'Auto or Preset' ||
          //   subQue.entryorgin === 'Preset'
          //     ? ''
          //     : subQue.savedAnswer,
          savedAnswer: subQue.savedAnswer,
          answer: subQue.answer,
          remark: '',
        };
        this.exceptionList.push(exceptionData);
        this.appServices.setExceptionData(this.exceptionList);
        if (id === 0) {
          this.lookupResetBtn(payLoad.questionId, payLoad.jobid, '');
        }
      }
    } else {
      const duplicateResponse = this.exceptionList.find(
        (x) => x.qid === subQue.qid
      );
      if (duplicateResponse) {
        return;
      }
      let exceptionData: any;
      exceptionData = {
        guid: Guid.create(),
        mainId: ques.subheadid,
        qid: subQue.qid,
        mainQueId: mainQue.qid,
        subHeaders: ques.subHeaders,
        mainQuestion: mainQue.mainQuestion,
        subName: splitValue.join('.') + ' ' + subQue.subName,
        presetValue: subQue.presetvalue,
        // savedAnswer:
        //   subQue.entryorgin === 'Auto or Preset' ||
        //   subQue.entryorgin === 'Preset'
        //     ? ''
        //     : subQue.savedAnswer,
        savedAnswer: subQue.savedAnswer,
        answer: subQue.answer,
        remark: '',
      };
      this.exceptionList.push(exceptionData);
      this.updateExceptionList();
    }
  }

  exceptionIcon() {
    if (this.getAllDatas) {
      this.getAllDatas.forEach((res: any) => {
        res.values.forEach((value: any) => {
          value.isException = this.exceptionList.some((element) => {
            return element.mainId === value.subheadid;
          });
        });
      });
    }
  }

  resetDate(subq: any, quest: any, mquest: any) {
    this.appServices.setUnSaveAction(true);
    this.dynamicForms.controls[subq.qid].setValue('');
    subq.answer = '';
    mquest.selected = false;

    if (mquest.qid == 'MQ6') {
      const getFromDate = this.dynamicForms.value.Q8;
      const getToDate = this.dynamicForms.value.Q9;
      if (getFromDate == '' || getToDate == '') {
        this.dynamicForms.patchValue({ Q10: 0 });
      }
    }
    if (mquest.qid == 'MQ20') {
      const getFromDate = this.dynamicForms.value.Q22;
      const getToDate = this.dynamicForms.value.Q23;
      if (getFromDate == '' || getToDate == '') {
        this.dynamicForms.patchValue({ Q24: 0 });
        this.inputChanges(0, subq, quest, mquest);
      }
    } else if (mquest.qid == 'MQ100') {
      const getFromDate = this.dynamicForms.value.Q101;
      const getToDate = this.dynamicForms.value.Q102;
      if (getFromDate == '' || getToDate == '') {
        this.dynamicForms.patchValue({ Q103: 0 });
        this.inputChanges(0, subq, quest, mquest);
      }
    } else if (mquest.qid == 'MQ105') {
      const getFromDate = this.dynamicForms.value.Q107;
      const getToDate = this.dynamicForms.value.Q108;
      if (getFromDate == '' || getToDate == '') {
        this.dynamicForms.patchValue({ Q109: 0 });
        this.inputChanges(0, subq, quest, mquest);
        this.lastinputChanges(0, subq, quest, mquest);
      }
    }
    this.getAllDatas.forEach((getAllValue: any) => {
      getAllValue.values.forEach((value: any) => {
        value.question.forEach((subHeader: any) => {
          subHeader.subQuestion.forEach((mainQus: any) => {
            const index = this.getMainQuestCounts.findIndex(
              (section: any) => section.mainQuestion === subHeader.mainQuestion
            );
            this.getMainQuestCounts[index] = subHeader;
            this.piqPendingCount();
          });
        });
      });
    });
    const mQuestion = mquest.mainQuestion;
    const str = mQuestion.split(' ');
    let questionId = '';
    if (str && str.length > 0) {
      if (str[0].endsWith('.')) {
        const stringWithoutLastDot = str[0].slice(0, -1);
        str[0] = stringWithoutLastDot;
      }
      const matchResult = str[0].match(/\d+\.\d+\.\d+(\.\d+)?/);
      if (matchResult) {
        questionId = matchResult[0];
      } else {
        const modifiedStr = str[0].replace(/\.\w*$/, '');
        questionId = modifiedStr;
      }
    }
    if (questionId === '2.2.1' || questionId === '2.2.2') {
      this.getLookUpVisit(questionId, quest, mquest, subq);
    } else if (
      questionId === '2.3.3.1' ||
      questionId === '2.3.3.2' ||
      questionId === '2.3.3.3'
    ) {
      this.getPMSDetail(questionId, quest, mquest, subq, 'date');
    } else if (questionId === '2.8.2') {
      this.getPscDetail(questionId, quest, mquest, subq);
    } else if (
      questionId === '3.2.1' ||
      questionId === '3.2.2' ||
      questionId === '3.2.3' ||
      questionId === '3.2.4' ||
      questionId === '3.2.5' ||
      questionId === '3.2.6' ||
      questionId === '3.2.7'
    ) {
      this.getTmsaDetail(questionId, quest, mquest, subq);
    }
    this.countDetails();
    this.chapterGrid();
  }

  restoreOriginal(subq: any) {
    const objWithIdIndex = this.exceptionList.findIndex(
      (obj) => obj.qid === subq.qid
    );
    if (objWithIdIndex > -1) {
      this.exceptionList.splice(objWithIdIndex, 1);
    }
    this.dynamicForms.controls[subq.qid].setValue(subq.presetvalue);
    subq.answer = subq.presetvalue;
    this.countDetails();
    this.appServices.setUnSaveAction(true);
    this.updateExceptionList();
  }

  restoreLookUp(subq: any) {
    const objWithIdIndex = this.exceptionList.findIndex(
      (obj) => obj.qid === subq.qid
    );
    if (objWithIdIndex > -1) {
      this.exceptionList.splice(objWithIdIndex, 1);
    }
    subq.answer = '';
    this.countDetails();
    this.exceptionIcon();
    this.appServices.setUnSaveAction(true);
  }
  expandAllMainquestions(quest: any, index: any) {
    quest['expand' + index] = !quest['expand' + index];
  }

  openLookUp(event: any, quest: any, mainQuest?: any) {
    if (this.lookUpEnable) {
      return;
    }
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'grid-dialog-container';
    const mQuestion = mainQuest.mainQuestion;
    const str = mQuestion.split(' ');
    let questionId = '';
    if (str && str.length > 0) {
      if (str[0].endsWith('.')) {
        const stringWithoutLastDot = str[0].slice(0, -1);
        str[0] = stringWithoutLastDot;
      }
      const matchResult = str[0].match(/\d+\.\d+\.\d+(\.\d+)?/);
      if (matchResult) {
        questionId = matchResult[0];
      } else {
        const modifiedStr = str[0].replace(/\.\w*$/, '');
        questionId = modifiedStr;
      }
    }
    if (quest && quest.subheadid === 'SH1') {
      this.manualLookUp(dialogConfig);
    } else if (quest && quest.subheadid === 'SH29') {
      this.mocLookUp(quest, mainQuest.qid);
    } else if (quest && quest.subheadid === 'SH2') {
      this.lookUpDialog(mainQuest, questionId, mainQuest.qid);
    } else if (
      mainQuest &&
      (mainQuest.qid === 'MQ26' ||
        mainQuest.qid === 'MQ29' ||
        mainQuest.qid === 'MQ32')
    ) {
      this.pmsLookup(mainQuest, questionId, mainQuest.qid);
    } else if (quest && quest.subheadid === 'SH32') {
      this.pscLookUp(quest, mainQuest, questionId, mainQuest.qid);
    } else if (
      mainQuest &&
      (mainQuest.qid === 'MQ115' ||
        mainQuest.qid === 'MQ97' ||
        mainQuest.qid === 'MQ100' ||
        mainQuest.qid === 'MQ105' ||
        mainQuest.qid === 'MQ111' ||
        mainQuest.qid === 'MQ120' ||
        mainQuest.qid === 'MQ125')
    ) {
      this.tmsaLookUp(mainQuest, questionId, mainQuest.qid);
    } else if (quest && quest.subheadid === 'SH14') {
      this.safetyManagement(questionId, mainQuest.qid);
    }
    event.preventDefault();
    event.stopPropagation();
  }

  manualLookUp(dialogConfig: any) {
    this.dialog.open(ManualLookUpComponent, dialogConfig);
  }

  mocLookUp(quest: any, mainQueId?: any) {
    const mocDialog = this.dialog.open(MocComponent, {
      panelClass: 'moc-dialog-container',
      data: {
        questionId: '2.5.',
        referenceId: this.referenceNumber,
      },
    });
    mocDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        let payloadDetails: any[] = [];

        if (result && result.rowData && result.rowData.length > 0) {
          result.rowData.forEach((res: any) => {
            payloadDetails.push({
              referenceId: res.refid,
              q136: res.q136,
              q139: res.q139,
              q142: res.q142,
              q145: res.q145,
            });
          });
        }
        this.lookupResetBtn(
          '2.5.',
          '',
          payloadDetails,
          '2.5.Management of Change',
          mainQueId
        );
        quest.question.forEach((Mquest: any) => {
          Mquest.subQuestion.forEach((response: any) => {
            if (response && response.type === 'Select') {
              result.data.forEach((result: any) => {
                if (response && response.qid === result.qid) {
                  this.dynamicForms.controls[response.qid].patchValue(
                    result.value ? 'Yes' : 'No'
                  );
                  response.answer = result.value ? 'Yes' : 'No';
                  this.countDetails();
                }
              });
            }
          });
        });
      }
    });
  }

  lookUpDialog(mainQuest: any, questionId: any, mainQueId?: any) {
    const dialogRef = this.dialog.open(LookupDialogComponent, {
      panelClass: 'lookUp-dialog-container',
      data: {
        qid: mainQuest.qid,
        questionId: questionId,
        referenceId: this.referenceNumber,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result !== 'Reset' && result.sid) {
        this.lookupResetBtn(
          questionId,
          result.sid,
          '',
          '2.2.Management Oversight',
          mainQueId
        );
        const timeDifference =
          result &&
          (result.auditfromdate && result.audittodate
            ? new Date(result.audittodate).getTime() -
              new Date(result.auditfromdate).getTime()
            : result.actualtodate && result.actualfromdate
            ? new Date(result.actualtodate).getTime() -
              new Date(result.actualfromdate).getTime()
            : 0);

        const dateCount = timeDifference
          ? Math.floor(timeDifference / (1000 * 60 * 60 * 24))
          : 0;

        if (
          (mainQuest && mainQuest.qid === 'MQ6') ||
          mainQuest.qid === 'MQ20'
        ) {
          mainQuest.subQuestion.forEach((subQuest: any) => {
            this.restoreLookUp(subQuest);
          });

          if (mainQuest && mainQuest.qid === 'MQ6') {
            this.dynamicForms.patchValue({
              Q8:
                result && result.actualfromdate
                  ? new Date(result.actualfromdate)
                  : '',
              Q9:
                result && result.actualtodate
                  ? new Date(result.actualtodate)
                  : '',
              Q10: dateCount,
            });
          } else if (mainQuest && mainQuest.qid === 'MQ20') {
            this.dynamicForms.patchValue({
              Q22: result.auditfromdate
                ? result && result.auditfromdate
                  ? new Date(result.auditfromdate)
                  : ''
                : result && result.actualfromdate
                ? new Date(result.actualfromdate)
                : '',
              Q23: result.audittodate
                ? result && result.audittodate
                  ? new Date(result.audittodate)
                  : ''
                : result && result.actualtodate
                ? new Date(result.actualtodate)
                : '',
              Q24: dateCount,
            });
            if (
              mainQuest &&
              (mainQuest.qid === 'MQ6' || mainQuest.qid === 'MQ20')
            ) {
              mainQuest.subQuestion.forEach((response: any) => {
                if (response && response.qid === 'Q8') {
                  response.answer = result.actualfromdate;
                } else if (response && response.qid === 'Q22') {
                  response.answer = result.auditfromdate
                    ? result.auditfromdate
                    : result.actualfromdate;
                } else if (response && response.qid === 'Q9') {
                  response.answer = result.actualtodate;
                } else if (response && response.qid === 'Q23') {
                  response.answer = result.audittodate
                    ? result.audittodate
                    : result.actualtodate;
                } else if (
                  (response && response.qid === 'Q10') ||
                  response.qid === 'Q24'
                ) {
                  response.answer = dateCount;
                }
                this.countDetails();
              });
            }
          }
        }
      } else if (result === 'Reset') {
        if (
          (mainQuest && mainQuest.qid === 'MQ6') ||
          mainQuest.qid === 'MQ20'
        ) {
          mainQuest.subQuestion.forEach((subQuest: any) => {
            this.restoreLookUp(subQuest);
          });

          if (mainQuest && mainQuest.qid === 'MQ6') {
            this.formResetMQ6();
          } else if (mainQuest && mainQuest.qid === 'MQ20') {
            this.formResetMQ20();
          }
        }
        const exceptioDetails = [...this.exceptionList];
        const filterMquest = exceptioDetails.filter((exc) => {
          return (
            mainQuest.qid === exc.mainQueId &&
            exc.mainQuestion.includes(questionId)
          );
        });
        filterMquest.forEach((data) => {
          this.exceptionList.forEach((filter: any, index: number) => {
            if (filter.guid.value === data.guid.value) {
              this.exceptionList.splice(index, 1);
            }
          });
        });
        this.updateExceptionList();
        this.lookupResetBtn(questionId, 'Reset', '');
      }
    });
  }

  pmsLookup(mainQuest: any, questionId: any, mainQueId?: any) {
    const dialogRef = this.dialog.open(PmsLookupComponent, {
      panelClass: 'pmsLookUp-dialog-container',
      data: {
        moduleName:
          mainQuest && mainQuest.qid === 'MQ26'
            ? 'Cargo Tanks'
            : mainQuest.qid === 'MQ29'
            ? 'Ballast Tanks'
            : 'Void Spaces',
        referenceId: this.referenceNumber,
        questionId: questionId,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result !== 'Reset') {
        this.lookupResetBtn(
          questionId,
          result.jobid,
          '',
          '2.3.Structural Assessment',
          mainQueId
        );
        if (
          mainQuest &&
          (mainQuest.qid === 'MQ26' ||
            mainQuest.qid === 'MQ29' ||
            mainQuest.qid === 'MQ32')
        ) {
          mainQuest.subQuestion.forEach((subQuest: any) => {
            this.restoreLookUp(subQuest);
          });
          if (mainQuest && mainQuest.qid === 'MQ26') {
            this.dynamicForms.patchValue({
              Q27: result.convertedFrequencyType,
              Q28: result && result.dueDate ? new Date(result.dueDate) : '',
            });
          } else if (mainQuest && mainQuest.qid === 'MQ29') {
            this.dynamicForms.patchValue({
              Q30: result.convertedFrequencyType,
              Q31: result && result.dueDate ? new Date(result.dueDate) : '',
            });
          } else if (mainQuest && mainQuest.qid === 'MQ32') {
            this.dynamicForms.patchValue({
              Q33: result.convertedFrequencyType,
              Q34: result && result.dueDate ? new Date(result.dueDate) : '',
            });
          }

          if (
            mainQuest &&
            (mainQuest.qid === 'MQ26' ||
              mainQuest.qid === 'MQ29' ||
              mainQuest.qid === 'MQ32')
          ) {
            mainQuest.subQuestion.forEach((response: any) => {
              if (response && response.qid === 'Q27') {
                response.answer = result.convertedFrequencyType;
              } else if (response && response.qid === 'Q28') {
                response.answer = result.dueDate;
              } else if (response && response.qid === 'Q30') {
                response.answer = result.convertedFrequencyType;
              } else if (response && response.qid === 'Q31') {
                response.answer = result.dueDate;
              } else if (response && response.qid === 'Q33') {
                response.answer = result.convertedFrequencyType;
              } else if (response && response.qid === 'Q34') {
                response.answer = result.dueDate;
              }
              this.countDetails();
            });
          }
        }
      } else if (result === 'Reset') {
        if (
          mainQuest &&
          (mainQuest.qid === 'MQ26' ||
            mainQuest.qid === 'MQ29' ||
            mainQuest.qid === 'MQ32')
        ) {
          mainQuest.subQuestion.forEach((subQuest: any) => {
            this.restoreLookUp(subQuest);
          });

          if (mainQuest && mainQuest.qid === 'MQ26') {
            this.formResetMQ26();
          } else if (mainQuest && mainQuest.qid === 'MQ29') {
            this.formResetMQ29();
          } else if (mainQuest && mainQuest.qid === 'MQ34') {
            this.formResetMQ34();
          }
        }
        const exceptioDetails = [...this.exceptionList];
        const filterMquest = exceptioDetails.filter((exc) => {
          return (
            mainQuest.qid === exc.mainQueId &&
            exc.mainQuestion.includes(questionId)
          );
        });
        filterMquest.forEach((data) => {
          this.exceptionList.forEach((filter: any, index: number) => {
            if (filter.guid.value === data.guid.value) {
              this.exceptionList.splice(index, 1);
            }
          });
        });
        this.updateExceptionList();
        this.lookupResetBtn(questionId, 'Reset', '');
      }
    });
  }
  pscLookUp(quest: any, mainQuest: any, questionId: any, mainQueId?: any) {
    const dialogRef = this.dialog.open(PscComponent, {
      panelClass: 'psc-dialog-container',
      data: {
        qid: mainQuest.qid,
        questionId: questionId,
        referenceId: this.referenceNumber,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result !== 'Reset' && result.sid) {
        if (result) {
          this.lookupResetBtn(
            questionId,
            result.sid,
            '',
            '2.8. General Information',
            mainQueId
          );
          this.dynamicForms.patchValue({
            Q155: 'Yes',
            Q156: result && result.crdate ? result.crdate : '',
            Q158: result && result.authoritycode ? result.authoritycode : '',
            Q160: result && result.isnon_nc_def_obs === 'N' ? 'No' : 'Yes',
            Q161: result && result.deficiencycount === '1' ? 'Yes' : 'No',
          });
          quest.question.forEach((Mquest: any) => {
            if (Mquest && Mquest.qid === 'MQ154') {
              Mquest.subQuestion.forEach((response: any) => {
                this.restoreLookUp(response);
                if (response && response.qid === 'Q155') {
                  response.answer = 'Yes';
                } else if (response && response.qid === 'Q156') {
                  response.answer = result.crdate;
                } else if (response && response.qid === 'Q158') {
                  response.answer = result.authoritycode;
                } else if (response && response.qid === 'Q160') {
                  response.answer =
                    result.isnon_nc_def_obs === 'N' ? 'No' : 'Yes';
                } else if (response && response.qid === 'Q161') {
                  response.answer =
                    result.deficiencycount === '1' ? 'Yes' : 'No';
                }
                this.countDetails();
              });
            }
          });
        }
      } else if (result === 'Reset') {
        if (mainQuest && mainQuest.qid === 'MQ154') {
          this.formResetMQ154();
        }
        const exceptioDetails = [...this.exceptionList];
        const filterMquest = exceptioDetails.filter((exc) => {
          return (
            mainQuest.qid === exc.mainQueId &&
            exc.mainQuestion.includes(questionId)
          );
        });
        filterMquest.forEach((data) => {
          this.exceptionList.forEach((filter: any, index: number) => {
            if (filter.guid.value === data.guid.value) {
              this.exceptionList.splice(index, 1);
            }
          });
        });
        this.updateExceptionList();
        this.lookupResetBtn(questionId, 'Reset', '');
      }
    });
  }

  tmsaLookUp(mainQuest: any, questionId: any, mainQueId?: any) {
    const dialogRef = this.dialog.open(TMSAComponent, {
      panelClass: 'tmsa-dialog-container',
      data: {
        qid:
          mainQuest.qid === 'MQ97'
            ? '3.2.1'
            : mainQuest.qid === 'MQ100'
            ? '3.2.2'
            : mainQuest.qid === 'MQ105'
            ? '3.2.3'
            : mainQuest.qid === 'MQ111'
            ? '3.2.4'
            : mainQuest.qid === 'MQ115'
            ? '3.2.5'
            : mainQuest.qid === 'MQ120'
            ? '3.2.6'
            : mainQuest.qid === 'MQ125'
            ? '3.2.7'
            : '',
        questionId: questionId,
        referenceId: this.referenceNumber,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result !== 'Reset' && result.sid) {
        if (mainQuest && mainQuest.qid === 'MQ115') {
          this.mq115LookUp(result, questionId, mainQueId);
        } else if (mainQuest && mainQuest.qid === 'MQ97') {
          this.mq97LookUp(result, questionId, mainQueId);
        } else if (mainQuest && mainQuest.qid === 'MQ100') {
          this.mq100LookUp(result, questionId, mainQueId);
        } else if (mainQuest && mainQuest.qid === 'MQ105') {
          this.mq105LookUp(result, questionId, mainQueId);
        } else if (mainQuest && mainQuest.qid === 'MQ111') {
          this.mq111LookUp(result, questionId, mainQueId);
        } else if (mainQuest && mainQuest.qid === 'MQ120') {
          this.mq120LookUp(result, questionId, mainQueId);
        } else if (mainQuest && mainQuest.qid === 'MQ125') {
          this.mq125LookUp(result, questionId, mainQueId);
        }
      } else if (result === 'Reset') {
        this.lookupResetBtn(questionId, 'Reset', '');
      }
    });
  }

  mq115LookUp(result: any, questionId: any, mainQueId?: any) {
    if (result && result.hasOwnProperty('auditfromdate')) {
      this.dynamicForms.patchValue({
        Q117:
          result && result.auditfromdate ? new Date(result.auditfromdate) : '',
        Q118: result && result.audittodate ? new Date(result.audittodate) : '',
      });
    } else if (result && result.hasOwnProperty('actualfromdate')) {
      this.dynamicForms.patchValue({
        Q117: result.actualfromdate,
        Q118: result.actualtodate,
      });
    }
    this.lookupResetBtn(
      questionId,
      result.sid,
      '',
      '3.2.Crew Evaluation',
      mainQueId
    );
  }

  mq97LookUp(result: any, questionId: any, mainQueId?: any) {
    if (result && result.hasOwnProperty('actualfromdate')) {
      this.dynamicForms.patchValue({
        Q99: result.actualfromdate,
      });
    } else {
      this.dynamicForms.patchValue({
        Q99:
          result && result.auditfromdate ? new Date(result.auditfromdate) : '',
      });
    }
    this.lookupResetBtn(
      questionId,
      result.sid,
      '',
      '3.2.Crew Evaluation',
      mainQueId
    );
  }

  mq100LookUp(result: any, questionId: any, mainQueId?: any) {
    if (result && result.hasOwnProperty('actualfromdate')) {
      const timeDifference =
        new Date(result.actualtodate).getTime() -
        new Date(result.actualfromdate).getTime();
      const dateCount = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      this.dynamicForms.patchValue({
        Q101:
          result && result.actualfromdate
            ? new Date(result.actualfromdate)
            : '',
        Q102:
          result && result.actualtodate ? new Date(result.actualtodate) : '',
        Q103: dateCount,
      });
    } else if (result.hasOwnProperty('auditfromdate')) {
      const timeDifference =
        new Date(result.audittodate).getTime() -
        new Date(result.auditfromdate).getTime();
      const dateCount = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      this.dynamicForms.patchValue({
        Q101:
          result && result.auditfromdate ? new Date(result.auditfromdate) : '',
        Q102: result && result.audittodate ? new Date(result.audittodate) : '',
        Q103: dateCount,
      });
    }
    this.lookupResetBtn(
      questionId,
      result.sid,
      '',
      '3.2.Crew Evaluation',
      mainQueId
    );
  }

  mq105LookUp(result: any, questionId: any, mainQueId?: any) {
    if (result && result.hasOwnProperty('actualfromdate')) {
      const timeDifference =
        new Date(result.actualtodate).getTime() -
        new Date(result.actualfromdate).getTime();
      const dateCount = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      this.dynamicForms.patchValue({
        Q107: result.actualfromdate,
        Q108: result.actualtodate,
        Q109: dateCount,
      });
    } else if (result.hasOwnProperty('auditfromdate')) {
      const timeDifference =
        new Date(result.audittodate).getTime() -
        new Date(result.auditfromdate).getTime();
      const dateCount = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      this.dynamicForms.patchValue({
        Q107:
          result && result.auditfromdate ? new Date(result.auditfromdate) : '',
        Q108: result && result.audittodate ? new Date(result.audittodate) : '',
        Q109: dateCount,
      });
    }
    this.lookupResetBtn(
      questionId,
      result.sid,
      '',
      '3.2.Crew Evaluation',
      mainQueId
    );
  }

  mq111LookUp(result: any, questionId: any, mainQueId?: any) {
    if (result && result.hasOwnProperty('actualfromdate')) {
      this.dynamicForms.patchValue({
        Q113: result.actualfromdate,
      });
    } else if (result.hasOwnProperty('auditfromdate')) {
      this.dynamicForms.patchValue({
        Q113:
          result && result.auditfromdate ? new Date(result.auditfromdate) : '',
      });
    }
    this.lookupResetBtn(
      questionId,
      result.sid,
      '',
      '3.2.Crew Evaluation',
      mainQueId
    );
  }

  mq120LookUp(result: any, questionId: any, mainQueId?: any) {
    if (result && result.hasOwnProperty('actualfromdate')) {
      this.dynamicForms.patchValue({
        Q122: result.actualfromdate,
        Q123: result.actualtodate,
      });
    } else if (result && result.hasOwnProperty('auditfromdate')) {
      this.dynamicForms.patchValue({
        Q122:
          result && result.auditfromdate ? new Date(result.auditfromdate) : '',
        Q123: result && result.audittodate ? new Date(result.audittodate) : '',
      });
    }
    this.lookupResetBtn(
      questionId,
      result.sid,
      '',
      '3.2.Crew Evaluation',
      mainQueId
    );
  }

  mq125LookUp(result: any, questionId: any, mainQueId?: any) {
    if (result && result.hasOwnProperty('actualfromdate')) {
      this.dynamicForms.patchValue({
        Q127: result.actualfromdate,
        Q128: result.actualtodate,
      });
    } else if (result && result.hasOwnProperty('auditfromdate')) {
      this.dynamicForms.patchValue({
        Q127:
          result && result.auditfromdate ? new Date(result.auditfromdate) : '',
        Q128: result && result.audittodate ? new Date(result.audittodate) : '',
      });
    }
    this.lookupResetBtn(
      questionId,
      result.sid,
      '',
      '3.2.Crew Evaluation',
      mainQueId
    );
  }
  safetyManagement(questionId: any, mainQueId: any) {
    const dialogRef = this.dialog.open(SafetyManagementComponent, {
      panelClass: 'safety-dialog-container',
      data: {
        qid: '5.7',
        questionId: questionId,
        referenceId: this.referenceNumber,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result !== 'Reset') {
          let insertQuest: any;
          this.arrayObj = [];
          let tempRowData: any[] = [];
          let modifiedSubQuestion: any;
          safetyRowData.forEach((row) => {
            result.forEach((resultResponse: any, indexValue: any) => {
              const trueValueKeys = Object.keys(resultResponse).filter(
                (key) => resultResponse[key] === true
              );
              trueValueKeys.forEach((trueResponse: any) => {
                if (trueResponse === row) {
                  tempRowData.push(trueResponse);
                  if (tempRowData && tempRowData.length > 1) {
                    this.getAllDatas.forEach((chapter: any) => {
                      if (chapter && chapter.uniqueid === 'H5') {
                        chapter.values.forEach((mainQues: any) => {
                          if (mainQues && mainQues.subheadid === 'SH14') {
                            this.findResponse = mainQues.question.find(
                              (quest: any) => quest && quest.qid === row
                            );

                            if (this.findResponse) {
                              const insertQuest = { ...this.findResponse };

                              insertQuest.mainQuestion = resultResponse.ivrid;
                              const ivrid = resultResponse.ivrid;
                              insertQuest.entrymethod = '';

                              let obj: any = {};
                              let duplicatePayload: any = {};
                              modifiedSubQuestion = insertQuest.subQuestion.map(
                                (dsd: any) => ({
                                  ...dsd,
                                  qid: 'D' + indexValue + '_' + dsd.qid,
                                })
                              );

                              modifiedSubQuestion.forEach((modData: any) => {
                                this.dynamicForms.addControl(
                                  modData.qid,
                                  new FormControl('')
                                );
                                obj[`${modData.qid}`] = '';
                              });

                              insertQuest.subQuestion = modifiedSubQuestion;

                              if (insertQuest.subQuestion[3].qid) {
                                this.dynamicForms.controls[
                                  `${insertQuest.subQuestion[3].qid}`
                                ].patchValue(resultResponse.dropdown);
                              }

                              if (insertQuest.subQuestion[4].qid) {
                                this.dynamicForms.controls[
                                  `${insertQuest.subQuestion[4].qid}`
                                ].patchValue(
                                  new Date(resultResponse.dateSelection)
                                );
                              }

                              const keys = Object.keys(obj);
                              if (keys && keys.length >= 4) {
                                let fourthKey = keys[3]; // Index 3 corresponds to the fourth key
                                let fifthKey = keys[4];
                                obj[fourthKey] = resultResponse.dropdown;
                                obj[fifthKey] = new Date(
                                  resultResponse.dateSelection
                                );
                              }
                              const originalQuestion = mainQues.question.find(
                                (quest: any) => quest && quest.qid === row
                              );
                              const mQuestion = originalQuestion.mainQuestion;
                              const str = mQuestion.split(' ');
                              if (str && str.length > 0) {
                                if (str[0].endsWith('.')) {
                                  const stringWithoutLastDot = str[0].slice(
                                    0,
                                    -1
                                  );
                                  str[0] = stringWithoutLastDot;
                                }
                                const matchResult = str[0].match(
                                  /\d+\.\d+\.\d+(\.\d+)?/
                                );
                                if (matchResult) {
                                  questionId = matchResult[0] + '.';
                                } else {
                                  const modifiedStr = str[0].replace(
                                    /\.\w*$/,
                                    ''
                                  );
                                  questionId = modifiedStr + '.';
                                }
                              }

                              duplicatePayload.qid = row;
                              console.log(row, 'row');

                              duplicatePayload.ivrid =
                                ivrid +
                                ' ' +
                                '-' +
                                ' ' +
                                originalQuestion.mainQuestion.replace(
                                  '5.7.1.1.',
                                  ''
                                );
                              duplicatePayload.duplicateDetails = obj;

                              this.arrayObj.push(duplicatePayload);

                              if (insertQuest) {
                                this.getAllDatas.forEach((chapter: any) => {
                                  if (chapter && chapter.uniqueid === 'H5') {
                                    chapter.values.forEach((mainQues: any) => {
                                      if (
                                        mainQues &&
                                        mainQues.subheadid === 'SH14'
                                      ) {
                                        let index = mainQues.question.findIndex(
                                          (quest: any) => quest.qid === row
                                        );
                                        ++index;
                                        mainQues.question.splice(
                                          index,
                                          0,
                                          insertQuest
                                        );
                                      }
                                    });
                                  }
                                });
                              }
                            }
                          }
                        });
                      }
                    });
                    this.countDetails();
                  } else {
                    this.getAllDatas.forEach((chapter: any) => {
                      if (chapter && chapter.uniqueid === 'H5') {
                        chapter.values.forEach((mainQues: any) => {
                          if (mainQues && mainQues.subheadid === 'SH14') {
                            this.findResponse = mainQues.question.find(
                              (quest: any) => quest && quest.qid === row
                            );
                            if (this.findResponse) {
                              insertQuest = { ...this.findResponse };
                              const tempSubQuestion = insertQuest.subQuestion;
                              tempSubQuestion.forEach((temp: any) => {
                                if (
                                  valuesToCheckDD.some((value) =>
                                    temp.qid.includes(value)
                                  )
                                ) {
                                  this.dynamicForms.patchValue({
                                    [temp.qid]: resultResponse.dropdown,
                                  });
                                  temp.answer = resultResponse.dropdown;
                                  temp.savedAnswer = resultResponse.dropdown;
                                  const exceptioDetails = [
                                    ...this.exceptionList,
                                  ];
                                  const filterMquest = exceptioDetails.filter(
                                    (exc) => {
                                      return temp.qid === exc.qid;
                                    }
                                  );

                                  filterMquest.forEach((data) => {
                                    this.exceptionList.forEach(
                                      (filter: any, index: number) => {
                                        if (
                                          filter.guid.value === data.guid.value
                                        ) {
                                          this.exceptionList.splice(index, 1);
                                        }
                                      }
                                    );
                                  });
                                }
                                if (
                                  valuesToCheckDate.some((value) =>
                                    temp.qid.includes(value)
                                  )
                                ) {
                                  this.dynamicForms.controls[
                                    `${temp.qid}`
                                  ].patchValue(
                                    new Date(resultResponse.dateSelection)
                                  );
                                  temp.answer = resultResponse.dateSelection;
                                  temp.savedAnswer = this.datePipe.transform(
                                    resultResponse.dateSelection,
                                    this.dateFormat
                                  );

                                  const exceptioDetails = [
                                    ...this.exceptionList,
                                  ];
                                  const filterMquest = exceptioDetails.filter(
                                    (exc) => {
                                      return (
                                        mainQues.qid === exc.mainQueId &&
                                        exc.mainQuestion ===
                                          mainQues.mainQuestion
                                      );
                                    }
                                  );
                                  filterMquest.forEach((data) => {
                                    this.exceptionList.forEach(
                                      (filter: any, index: number) => {
                                        if (
                                          filter.guid.value === data.guid.value
                                        ) {
                                          this.exceptionList.splice(index, 1);
                                        }
                                      }
                                    );
                                  });
                                }
                              });
                            }
                          }
                        });
                      }
                    });
                    this.countDetails();
                  }
                }
              });
            });

            tempRowData = [];
          });
          this.lookupResetBtn(
            '5.7',
            '',
            result,
            '5.7.Safety Management',
            mainQueId
          );
        } else if (result === 'Reset') {
          this.lookupResetBtn(questionId, 'Reset', '');
        }
      }
    });
    this.updateExceptionList();
  }

  chapterGrid() {
    this.rowSummaryData = [];
    this.getAllDatas.forEach((data: any) => {
      let questions: any[] = [];
      let questions1: any[] = [];
      let totalQuest: any[] = [];
      let status: any;
      let totalQuestCount = 0;
      let filledQuestionCount = 0;
      let answerQuestionCount = 0;
      if (data && data.values) {
        data.values.forEach((filledQus: any, index: any) => {
          filledQus.question.forEach((question: any) => {
            totalQuest.push(question.subQuestion.length);
            questions.push(
              question.subQuestion.filter((x: any) => x.answer !== '').length
            );
            questions1.push(
              question.subQuestion.filter((y: any) => y.answer === '').length
            );
          });
        });
      }

      totalQuest.forEach((count: any) => {
        totalQuestCount = totalQuestCount + count;
      });
      questions.forEach((count: any) => {
        filledQuestionCount = filledQuestionCount + count;
      });
      questions1.forEach((count: any) => {
        answerQuestionCount = answerQuestionCount + count;
      });
      if (totalQuestCount - filledQuestionCount == 0) {
        status = 'Completed';
      } else {
        status = 'Inprogress';
      }
      const pattern = /[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\|]/g;
      this.rowSummaryData.push({
        topics: data && data.header ? data.header.replace(pattern, '') : '',
        status: status,
        totalQuestion: totalQuestCount,
        filledQuestion: filledQuestionCount,
        pendingQuestion: totalQuestCount - filledQuestionCount,
      });
      this.appServices.setGridSummary(this.rowSummaryData);
    });
    this.updateExceptionList();
  }

  lastinputChanges(event?: any, subq?: any, quest?: any, mquest?: any) {
    let value =
      event && event.target && event.target.value ? event.target.value : event;
    const modifiedData = {
      userName: this.userDetails.userData.mdata.appInfo.userName,
      userType: this.userDetails.userData.mdata.userInfo.userType,
      header: quest.subHeaders,
      mainQuestion: mquest.mainQuestion,
      subID: subq.qid,
      subQuestion: subq.subName,
      answer: value,
      sortingDate: new Date(),
      modifiedDateTime: this.datePipe.transform(
        new Date(),
        this.dateTimeFormat
      ),
    };
    this.lastModifiedData.push(modifiedData);
    this.lastModifiedData.sort((a, b) => b.sortingDate - a.sortingDate);
    if (this.lastModifiedData.length > 10) {
      this.lastModifiedData.splice(0, 1);
    }
    this.chapterGrid();
  }
  inputChanges(event?: any, subq?: any, quest?: any, mquest?: any, type?: any) {
    let value =
      event && event.target && event.target.value ? event.target.value : event;
    subq.answer = value;
    if (typeof value === 'object') {
      subq.answer = '';
    }
    this.countDetails();
    this.appServices.setUnSaveAction(true);
    if (subq && subq.presetvalue === subq.answer) {
      this.restoreOriginal(subq);
    } else if (subq && subq.presetvalue) {
      this.exceptionFn(quest, mquest, subq);
    }
    this.selectedValue = quest && quest.subHeaders ? quest.subHeaders : '';
    this.chapterGrid();
  }

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = inputElement.value;
    inputValue = inputValue.replace(/[^\d]/g, '');
    inputElement.value = inputValue;
  }

  datePickerChanges(
    event: MatDatepickerInputEvent<Date>,
    subQues: any,
    mquest: any,
    subq: any
  ): void {
    let value = event.value;
    this.appServices.setUnSaveAction(true);
    const modifiedData = {
      userName: this.userDetails.userData.mdata.appInfo.userName,
      userType: this.userDetails.userData.mdata.userInfo.userType,
      header: subQues.subHeaders,
      mainQuestion: mquest.mainQuestion,
      subID: subq.qid,
      subQuestion: subq.subName,
      answer: value,
      sortingDate: new Date(),
      modifiedDateTime: this.datePipe.transform(
        new Date(),
        this.dateTimeFormat
      ),
    };
    this.lastModifiedData.push(modifiedData);
    this.lastModifiedData.sort((a, b) => b.sortingDate - a.sortingDate);
    if (this.lastModifiedData.length > 10) {
      this.lastModifiedData.splice(0, 1);
    }
    const mQuestion = mquest.mainQuestion;
    const str = mQuestion.split(' ');
    let questionId = '';
    if (str && str.length > 0) {
      if (str[0].endsWith('.')) {
        const stringWithoutLastDot = str[0].slice(0, -1);
        str[0] = stringWithoutLastDot;
      }
      const matchResult = str[0].match(/\d+\.\d+\.\d+(\.\d+)?/);
      if (matchResult) {
        questionId = matchResult[0];
      } else {
        const modifiedStr = str[0].replace(/\.\w*$/, '');
        questionId = modifiedStr;
      }
    }
    subq.answer = this.datePipe.transform(event.value, this.dateFormat);
    if (questionId === '2.2.1' || questionId === '2.2.2') {
      this.getLookUpVisit(questionId, subQues, mquest, subq);
    } else if (
      questionId === '2.3.3.1' ||
      questionId === '2.3.3.2' ||
      questionId === '2.3.3.3'
    ) {
      this.getPMSDetail(questionId, subQues, mquest, subq, 'date');
    } else if (questionId === '2.8.2') {
      this.getPscDetail(questionId, subQues, mquest, subq);
    } else if (
      questionId === '3.2.1' ||
      questionId === '3.2.2' ||
      questionId === '3.2.3' ||
      questionId === '3.2.4' ||
      questionId === '3.2.5' ||
      questionId === '3.2.6' ||
      questionId === '3.2.7'
    ) {
      this.getTmsaDetail(questionId, subQues, mquest, subq);
    } else if (subQues && subQues.subheadid === 'SH14') {
      this.safetyManagementDetails(questionId, subQues, mquest, subq, 'Date');
    }

    this.selectedValue =
      subQues && subQues.subHeaders ? subQues.subHeaders : '';
    this.countDetails();
    this.dateCount(mquest);
    this.chapterGrid();
  }

  safetyManagementDetails(
    questionId: string,
    subQues: any,
    mquest: any,
    subq: any,
    type: string
  ) {
    const vesselCode = localStorage.getItem('masterVesselCode');
    this.loaderService.loaderShow();
    this.appServices
      .getLookupDetail('5.7', vesselCode, '5.7', this.referenceNumber)
      .subscribe((data) => {
        this.loaderService.loaderHide();
        const safetyMgnData = JSON.parse(data.response);

        const findQidDetail = safetyMgnData.find((x: any) => {
          if (questionId === '5.7.1.1') {
            return x.MQ337;
          } else if (questionId === '5.7.1.2') {
            return x.MQ343;
          } else if (questionId === '5.7.1.3') {
            return x.MQ349;
          } else if (questionId === '5.7.1.4') {
            return x.MQ355;
          } else if (questionId === '5.7.1.5') {
            return x.MQ361;
          } else if (questionId === '5.7.1.6') {
            return x.MQ367;
          } else if (questionId === '5.7.1.7') {
            return x.MQ373;
          } else if (questionId === '5.7.1.8') {
            return x.MQ379;
          } else if (questionId === '5.7.1.9') {
            return x.MQ385;
          } else if (questionId === '5.7.1.10') {
            return x.MQ391;
          } else if (questionId === '5.7.1.11') {
            return x.MQ397;
          } else if (questionId === '5.7.1.12') {
            return x.MQ403;
          } else if (questionId === '5.7.1.13') {
            return x.MQ409;
          } else if (questionId === '5.7.1.14') {
            return x.MQ415;
          } else if (questionId === '5.7.1.15') {
            return x.MQ421;
          } else if (questionId === '5.7.1.16') {
            return x.MQ427;
          } else if (questionId === '5.7.1.17') {
            return x.MQ433;
          } else if (questionId === '5.7.1.18') {
            return x.MQ439;
          } else if (questionId === '5.7.1.19') {
            return x.MQ445;
          } else if (questionId === '5.7.1.20') {
            return x.MQ451;
          } else if (questionId === '5.7.1.21') {
            return x.MQ457;
          } else if (questionId === '5.7.1.22') {
            return x.MQ463;
          } else if (questionId === '5.7.1.23') {
            return x.MQ469;
          } else if (questionId === '5.7.1.24') {
            return x.MQ475;
          } else if (questionId === '5.7.1.25') {
            return x.MQ481;
          } else if (questionId === '5.7.1.26') {
            return x.MQ487;
          } else if (questionId === '5.7.1.27') {
            return x.MQ493;
          } else if (questionId === '5.7.1.28') {
            return x.MQ499;
          } else if (questionId === '5.7.1.29') {
            return x.MQ505;
          } else {
            return mquest.mainQuestion.includes(x.ivrid);
          }
        });

        if (!findQidDetail) return;
        if (type === 'Date') {
          findQidDetail.dateSelection =
            findQidDetail.dateSelection?.split(' ')[0] || '';
          if (
            findQidDetail.dateSelection !== subq.answer &&
            (subq.qid.includes('Q342') ||
              subq.qid.includes('Q348') ||
              subq.qid.includes('Q354') ||
              subq.qid.includes('Q360') ||
              subq.qid.includes('Q366') ||
              subq.qid.includes('Q372') ||
              subq.qid.includes('Q378') ||
              subq.qid.includes('Q384') ||
              subq.qid.includes('Q390') ||
              subq.qid.includes('Q396') ||
              subq.qid.includes('Q402') ||
              subq.qid.includes('Q408') ||
              subq.qid.includes('Q414') ||
              subq.qid.includes('Q420') ||
              subq.qid.includes('Q426') ||
              subq.qid.includes('Q432') ||
              subq.qid.includes('Q438') ||
              subq.qid.includes('Q444') ||
              subq.qid.includes('Q450') ||
              subq.qid.includes('Q456') ||
              subq.qid.includes('Q462') ||
              subq.qid.includes('Q468') ||
              subq.qid.includes('Q474') ||
              subq.qid.includes('Q480') ||
              subq.qid.includes('Q486') ||
              subq.qid.includes('Q492') ||
              subq.qid.includes('Q498') ||
              subq.qid.includes('Q504') ||
              subq.qid.includes('Q510'))
          ) {
            this.exceptionDateFn(subQues, mquest, subq);
          } else {
            const exceptioDetails = [...this.exceptionList];
            const filterMquest = exceptioDetails.filter((exc) => {
              return (
                mquest.qid === exc.mainQueId &&
                exc.mainQuestion.includes(questionId)
              );
            });
            filterMquest.forEach((data) => {
              this.exceptionList.forEach((filter: any, index: number) => {
                if (filter.guid.value === data.guid.value) {
                  this.exceptionList.splice(index, 1);
                }
              });
            });
            this.updateExceptionList();
          }
        } else if (
          type === 'Select' &&
          findQidDetail.dropdown !== subq.answer
        ) {
          this.exceptionDateFn(subQues, mquest, subq);
        } else {
          const exceptioDetails = [...this.exceptionList];
          const filterMquest = exceptioDetails.filter((exc) => {
            return (
              mquest.qid === exc.mainQueId &&
              exc.mainQuestion.includes(questionId)
            );
          });
          filterMquest.forEach((data) => {
            this.exceptionList.forEach((filter: any, index: number) => {
              if (filter.guid.value === data.guid.value) {
                this.exceptionList.splice(index, 1);
              }
            });
          });

          this.updateExceptionList();
        }
      });
  }

  updateExceptionList() {
    this.appServices.setExceptionData(this.exceptionList);
    this.exceptionIcon();
  }

  dateCount(mquest?: any) {
    if (mquest) {
      if (mquest.qid == 'MQ6') {
        const getFromDate = this.dynamicForms.value.Q8;
        const getToDate = this.dynamicForms.value.Q9;

        if (getFromDate != '' && getToDate != '') {
          const fromDate = new Date(getFromDate);
          const toDate = new Date(getToDate);
          const timeDifference = toDate.getTime() - fromDate.getTime();
          const daysDifference = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
          );
          this.dynamicForms.patchValue({ Q10: daysDifference });
          this.q10FromDateAuto(daysDifference);
        } else {
          this.dynamicForms.patchValue({ Q10: 0 });
          this.q10FromDateAuto(0);
        }
      } else if (mquest.qid == 'MQ20') {
        const getFromDate = this.dynamicForms.value.Q22;
        const getToDate = this.dynamicForms.value.Q23;

        if (getFromDate != '' && getToDate != '') {
          const fromDate = new Date(getFromDate);
          const toDate = new Date(getToDate);
          const timeDifference = toDate.getTime() - fromDate.getTime();
          const daysDifference = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
          );
          this.dynamicForms.patchValue({ Q24: daysDifference });
          this.q24FromDateAuto(daysDifference);
        } else {
          this.dynamicForms.patchValue({ Q24: 0 });
          this.q24FromDateAuto(0);
        }
      } else if (mquest.qid == 'MQ100') {
        const getFromDate = this.dynamicForms.value.Q101;
        const getToDate = this.dynamicForms.value.Q102;

        if (getFromDate != '' && getToDate != '') {
          const fromDate = new Date(getFromDate);
          const toDate = new Date(getToDate);
          const timeDifference = toDate.getTime() - fromDate.getTime();
          const daysDifference = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
          );
          this.dynamicForms.patchValue({ Q103: daysDifference });
          this.q103FromDateAuto(daysDifference);
        } else {
          this.dynamicForms.patchValue({ Q103: 0 });
          this.q103FromDateAuto(0);
        }
      } else if (mquest.qid == 'MQ105') {
        const getFromDate = this.dynamicForms.value.Q107;
        const getToDate = this.dynamicForms.value.Q108;

        if (getFromDate != '' && getToDate != '') {
          const fromDate = new Date(getFromDate);
          const toDate = new Date(getToDate);
          const timeDifference = toDate.getTime() - fromDate.getTime();
          const daysDifference = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
          );
          this.dynamicForms.patchValue({ Q109: daysDifference });
          this.q109FromDateAuto(daysDifference);
        } else {
          this.dynamicForms.patchValue({ Q109: 0 });
          this.q109FromDateAuto(0);
        }
      }
    }
  }

  q10FromDateAuto(daysDifference: any) {
    const subq = {
      subName: 'Number of days:',
      type: 'Automatic',
      sid: 'subq.2.2.2.4',
      information: 'MSI',
      entrymethod: 'Auto',
      entryorgin: 'Vessel',
      response: 'Auto',
      qid: 'Q10',
      controlname: 'automatic4',
      isShowSubQues: false,
      inprogress: false,
      isshipvisit: false,
      isinternal: false,
      isexternal: false,
      ismanagment: false,
      isvslcertificate: false,
      isincident: false,
      ispms: false,
      answer: '',
    };

    this.inputChanges(daysDifference, subq);
    this.countDetails();
  }

  q24FromDateAuto(daysDifference: any) {
    const subq = {
      subName: 'Number of days:',
      type: 'Automatic',
      sid: 'subq.2.2.2.4',
      information: 'MSI',
      entrymethod: 'Auto',
      entryorgin: 'Vessel',
      response: 'Auto',
      qid: 'Q24',
      controlname: 'automatic4',
      isShowSubQues: false,
      inprogress: false,
      isshipvisit: false,
      isinternal: false,
      isexternal: false,
      ismanagment: false,
      isvslcertificate: false,
      isincident: false,
      ispms: false,
      answer: '',
    };

    this.inputChanges(daysDifference, subq);
    this.countDetails();
  }

  q103FromDateAuto(daysDifference: any) {
    const subq = {
      subName: 'Number of days:',
      type: 'Automatic',
      sid: 'subq.2.2.2.4',
      information: 'MSI',
      entrymethod: 'Auto',
      entryorgin: 'Vessel',
      response: 'Auto',
      qid: 'Q103',
      controlname: 'automatic4',
      isShowSubQues: false,
      inprogress: false,
      isshipvisit: false,
      isinternal: false,
      isexternal: false,
      ismanagment: false,
      isvslcertificate: false,
      isincident: false,
      ispms: false,
      answer: '',
    };
    this.inputChanges(daysDifference, subq);
    this.countDetails();
  }

  q109FromDateAuto(daysDifference: any) {
    const subq = {
      subName: 'Number of days:',
      type: 'Automatic',
      sid: 'subq.2.2.2.4',
      information: 'MSI',
      entrymethod: 'Auto',
      entryorgin: 'Vessel',
      response: 'Auto',
      qid: 'Q109',
      controlname: 'automatic4',
      isShowSubQues: false,
      inprogress: false,
      isshipvisit: false,
      isinternal: false,
      isexternal: false,
      ismanagment: false,
      isvslcertificate: false,
      isincident: false,
      ispms: false,
      answer: '',
    };
    this.inputChanges(daysDifference, subq);
    this.countDetails();
  }
  getLookUpVisit(questionId: any, subQues: any, mquest: any, subq: any) {
    const vesselCode = localStorage.getItem('masterVesselCode');
    this.appServices
      .getLookupVisitData(vesselCode, this.referenceNumber, questionId)
      .subscribe((data) => {
        if (questionId === '2.2.1') {
          let findLookUpDate: any;
          if (
            data &&
            data.response &&
            data.response.ShipVisit &&
            data.response.ShipVisit.length > 0
          ) {
            findLookUpDate = data.response.ShipVisit.find(
              (x: any) => x.highlight
            );
          }

          if (findLookUpDate) {
            const fromDate = this.dynamicForms.value.Q8
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q8),
                  this.dateFormat
                )
              : '';
            const toDate = this.dynamicForms.value.Q9
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q9),
                  this.dateFormat
                )
              : '';
            const lookUpFromDate = findLookUpDate.plannedfromdate
              ? this.datePipe.transform(
                  new Date(findLookUpDate.plannedfromdate),
                  this.dateFormat
                )
              : '';
            const lookUpToDate = findLookUpDate.plannedtodate
              ? this.datePipe.transform(
                  new Date(findLookUpDate.plannedtodate),
                  this.dateFormat
                )
              : '';
            if (fromDate && lookUpFromDate && toDate && lookUpToDate) {
              if (!(fromDate === lookUpFromDate && toDate === lookUpToDate)) {
                this.exceptionDateFn(subQues, mquest, subq);
              }
            }
          }
        } else {
          let lookUpShipDate: any;
          let lookUpInternDate: any;
          if (data && data.response) {
            lookUpShipDate = data.response.ShipVisit.find(
              (x: any) => x.highlight
            );
            lookUpInternDate = data.response.Internal.find(
              (x: any) => x.highlight
            );
          }

          if (lookUpShipDate) {
            const fromDate = this.dynamicForms.value.Q22
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q22),
                  this.dateFormat
                )
              : '';
            const toDate = this.dynamicForms.value.Q23
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q23),
                  this.dateFormat
                )
              : '';
            const lookUpFromDate = lookUpShipDate.actualfromdate
              ? this.datePipe.transform(
                  new Date(lookUpShipDate.actualfromdate),
                  this.dateFormat
                )
              : '';
            const lookUpToDate = lookUpShipDate.actualtodate
              ? this.datePipe.transform(
                  new Date(lookUpShipDate.actualtodate),
                  this.dateFormat
                )
              : '';
            if (fromDate && lookUpFromDate && toDate && lookUpToDate) {
              if (!(fromDate === lookUpFromDate && toDate === lookUpToDate)) {
                this.exceptionDateFn(subQues, mquest, subq);
              }
            }
          }

          if (lookUpInternDate) {
            const fromDate = this.dynamicForms.value.Q22
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q22),
                  this.dateFormat
                )
              : '';
            const toDate = this.dynamicForms.value.Q23
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q23),
                  this.dateFormat
                )
              : '';
            const lookUpFromDate = lookUpInternDate.auditfromdate
              ? this.datePipe.transform(
                  new Date(lookUpInternDate.auditfromdate),
                  this.dateFormat
                )
              : '';
            const lookUpToDate = lookUpInternDate.audittodate
              ? this.datePipe.transform(
                  new Date(lookUpInternDate.audittodate),
                  this.dateFormat
                )
              : '';
            if (fromDate && lookUpFromDate && toDate && lookUpToDate) {
              if (!(fromDate === lookUpFromDate && toDate === lookUpToDate)) {
                this.exceptionDateFn(subQues, mquest, subq);
              }
            }
          }
        }
      });
  }

  getPMSDetail(
    questionId: any,
    subQues: any,
    mquest: any,
    subq: any,
    type: any
  ) {
    const companycode = this.userDetails.companyCode;
    const vesselCode = localStorage.getItem('masterVesselCode');
    this.appServices
      .getPMSLookupVisitData(
        companycode,
        vesselCode,
        this.referenceNumber,
        questionId
      )
      .subscribe((data) => {
        if (questionId === '2.3.3.1') {
          let lookUpPMSData: any;
          if (data && data.Response) {
            lookUpPMSData = data.Response[0].jobList.find(
              (x: any) => x.highlight
            );
          }

          if (lookUpPMSData) {
            lookUpPMSData.convertedFrequencyType =
              lookUpPMSData && lookUpPMSData.frequencytype === 'Month'
                ? lookUpPMSData.frequency + ' months'
                : '';
          }

          if (lookUpPMSData) {
            let lookUpDate: any;
            let lookUpMonthSelect: any;
            const monthSelect = this.dynamicForms.value.Q27
              ? this.dynamicForms.value.Q27
              : '';
            const date = this.dynamicForms.value.Q28
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q28),
                  this.dateFormat
                )
              : '';

            if (lookUpPMSData) {
              lookUpDate = lookUpPMSData.dueDate
                ? this.datePipe.transform(
                    new Date(lookUpPMSData.dueDate),
                    this.dateFormat
                  )
                : '';
              lookUpMonthSelect =
                lookUpPMSData && lookUpPMSData.convertedFrequencyType
                  ? lookUpPMSData.convertedFrequencyType
                  : '';
            }

            if (type === 'date') {
              if (!(date === lookUpDate)) {
                this.exceptionDateFn(subQues, mquest, subq);
              }
            }
            if (type === 'select') {
              if (!(monthSelect === lookUpMonthSelect)) {
                this.exceptionFn(subQues, mquest, subq);
              }
            }
          }
        } else if (questionId === '2.3.3.2') {
          let lookUpPMSData: any;
          if (data && data.Response) {
            lookUpPMSData = data.Response[1].jobList.find(
              (x: any) => x.highlight
            );
          }

          if (lookUpPMSData) {
            let lookUpDate: any;
            let lookUpMonthSelect: any;
            const monthSelect = this.dynamicForms.value.Q30
              ? this.dynamicForms.value.Q30
              : '';
            const date = this.dynamicForms.value.Q31
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q31),
                  this.dateFormat
                )
              : '';

            if (lookUpPMSData) {
              lookUpDate = lookUpPMSData.dueDate
                ? this.datePipe.transform(
                    new Date(lookUpPMSData.dueDate),
                    this.dateFormat
                  )
                : '';
              lookUpMonthSelect =
                lookUpPMSData && lookUpPMSData.convertedFrequencyType
                  ? lookUpPMSData.convertedFrequencyType
                  : '';
            }
            if (type === 'date') {
              if (!(date === lookUpDate)) {
                this.exceptionDateFn(subQues, mquest, subq);
              }
            }
            if (type === 'select') {
              if (!(monthSelect === lookUpMonthSelect)) {
                this.exceptionFn(subQues, mquest, subq);
              }
            }
          }
        } else if (questionId === '2.3.3.3') {
          let lookUpPMSData: any;
          if (data && data.Response) {
            lookUpPMSData = data.Response[2].jobList.find(
              (x: any) => x.highlight
            );
          }

          if (lookUpPMSData) {
            let lookUpDate: any;
            let lookUpMonthSelect: any;
            const monthSelect = this.dynamicForms.value.Q33
              ? this.dynamicForms.value.Q33
              : '';
            const date = this.dynamicForms.value.Q34
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q34),
                  this.dateFormat
                )
              : '';

            if (lookUpPMSData) {
              lookUpDate = lookUpPMSData.dueDate
                ? this.datePipe.transform(
                    new Date(lookUpPMSData.dueDate),
                    this.dateFormat
                  )
                : '';
              lookUpMonthSelect =
                lookUpPMSData && lookUpPMSData.convertedFrequencyType
                  ? lookUpPMSData.convertedFrequencyType
                  : '';
            }
            if (type === 'date') {
              if (!(date === lookUpDate)) {
                this.exceptionDateFn(subQues, mquest, subq);
              }
            }
            if (type === 'select') {
              if (!(monthSelect === lookUpMonthSelect)) {
                this.exceptionFn(subQues, mquest, subq);
              }
            }
          }
        }
      });
  }

  getPscDetail(questionId: any, subQues: any, mquest: any, subq: any) {
    const vesselCode = localStorage.getItem('masterVesselCode');
    this.appServices
      .getPscDetails(vesselCode, this.referenceNumber, questionId)
      .subscribe((data) => {
        if (subq && subq.qid === 'Q157') {
          return;
        }
        if (questionId === '2.8.2') {
          let lookUpPSCDate: any;
          let lookUpNonPSCDate: any;
          if (data && data.response) {
            lookUpPSCDate = data.response['Non-sPSC'].find(
              (x: any) => x.highlight
            );
            lookUpNonPSCDate = data.response['PSC'].find(
              (x: any) => x.highlight
            );
          }

          if (lookUpPSCDate || lookUpNonPSCDate) {
            let lookUpFromDate: any;
            let lookUpQ155: any;
            let lookUpQ158: any;
            let lookUpQ160: any;
            let lookUpQ161: any;
            const q155Field = this.dynamicForms.value.Q155
              ? this.dynamicForms.value.Q155
              : '';
            const fromDate = this.dynamicForms.value.Q156
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q156),
                  this.dateFormat
                )
              : '';

            const q158Field = this.dynamicForms.value.Q158
              ? this.dynamicForms.value.Q158
              : '';
            const q160Field = this.dynamicForms.value.Q160
              ? this.dynamicForms.value.Q160
              : '';
            const q161Field = this.dynamicForms.value.Q161
              ? this.dynamicForms.value.Q161
              : '';
            if (lookUpPSCDate) {
              lookUpFromDate = lookUpPSCDate.q156
                ? this.datePipe.transform(
                    new Date(lookUpPSCDate.q156),
                    this.dateFormat
                  )
                : '';
              lookUpQ155 = 'Yes';
              lookUpQ158 =
                lookUpPSCDate && lookUpPSCDate.authoritycode
                  ? lookUpPSCDate.authoritycode
                  : '';
              lookUpQ160 =
                lookUpPSCDate.isnon_nc_def_obs === 'N' ? 'No' : 'Yes';
              lookUpQ161 = lookUpPSCDate.deficiencycount === '1' ? 'Yes' : 'No';
            } else {
              lookUpFromDate = lookUpNonPSCDate.q156
                ? this.datePipe.transform(
                    new Date(lookUpNonPSCDate.q156),
                    this.dateFormat
                  )
                : '';
              lookUpQ155 = 'Yes';
              lookUpQ158 =
                lookUpNonPSCDate && lookUpNonPSCDate.authoritycode
                  ? lookUpNonPSCDate.authoritycode
                  : '';
              lookUpQ160 =
                lookUpNonPSCDate.isnon_nc_def_obs === 'N' ? 'No' : 'Yes';
              lookUpQ161 =
                lookUpNonPSCDate.deficiencycount === '1' ? 'Yes' : 'No';
            }
            if (
              !(
                fromDate === lookUpFromDate &&
                q155Field === lookUpQ155 &&
                q158Field === lookUpQ158 &&
                q160Field === lookUpQ160 &&
                q161Field === lookUpQ161
              )
            ) {
              this.exceptionDateFn(subQues, mquest, subq);
            }
          }
        }
      });
  }

  getTmsaDetail(questionId: any, subQues: any, mquest: any, subq: any) {
    if (subq.qid === 'Q98') {
      return;
    }
    const vesselCode = localStorage.getItem('masterVesselCode');
    this.loaderService.loaderShow();
    this.appServices
      .getLookupDetail(questionId, vesselCode, questionId, this.referenceNumber)
      .subscribe((data) => {
        this.loaderService.loaderHide();
        let lookUpInternalDate: any;
        let lookUpShipVisitDate: any;

        let fromDate: any;
        let toDate: any;
        let lookUpFromDate: any;
        let lookUpToDate: any;
        if (
          questionId === '3.2.1' ||
          questionId === '3.2.2' ||
          questionId === '3.2.5' ||
          questionId === '3.2.6' ||
          questionId === '3.2.7'
        ) {
          if (data && data.response) {
            lookUpInternalDate = data.response.Internal.find(
              (x: any) => x.highlight
            );
            lookUpShipVisitDate = data.response.ShipVisit.find(
              (x: any) => x.highlight
            );
          }
          if (lookUpInternalDate || lookUpShipVisitDate) {
            if (questionId === '3.2.1') {
              fromDate = this.dynamicForms.value.Q99
                ? this.datePipe.transform(
                    new Date(this.dynamicForms.value.Q99),
                    this.dateFormat
                  )
                : '';
            } else if (questionId === '3.2.2') {
              fromDate = this.dynamicForms.value.Q101
                ? this.datePipe.transform(
                    new Date(this.dynamicForms.value.Q101),
                    this.dateFormat
                  )
                : '';
              toDate = this.dynamicForms.value.Q102
                ? this.datePipe.transform(
                    new Date(this.dynamicForms.value.Q102),
                    this.dateFormat
                  )
                : '';
            } else if (questionId === '3.2.5') {
              fromDate = this.dynamicForms.value.Q117
                ? this.datePipe.transform(
                    new Date(this.dynamicForms.value.Q117),
                    this.dateFormat
                  )
                : '';
              toDate = this.dynamicForms.value.Q118
                ? this.datePipe.transform(
                    new Date(this.dynamicForms.value.Q118),
                    this.dateFormat
                  )
                : '';
            } else if (questionId === '3.2.6') {
              fromDate = this.dynamicForms.value.Q122
                ? this.datePipe.transform(
                    new Date(this.dynamicForms.value.Q122),
                    this.dateFormat
                  )
                : '';
              toDate = this.dynamicForms.value.Q123
                ? this.datePipe.transform(
                    new Date(this.dynamicForms.value.Q123),
                    this.dateFormat
                  )
                : '';
            } else if (questionId === '3.2.7') {
              fromDate = this.dynamicForms.value.Q127
                ? this.datePipe.transform(
                    new Date(this.dynamicForms.value.Q127),
                    this.dateFormat
                  )
                : '';
              toDate = this.dynamicForms.value.Q128
                ? this.datePipe.transform(
                    new Date(this.dynamicForms.value.Q128),
                    this.dateFormat
                  )
                : '';
            }
          }

          if (questionId === '3.2.1') {
            if (
              lookUpInternalDate &&
              lookUpInternalDate &&
              lookUpInternalDate.auditfromdate
            ) {
              lookUpFromDate =
                lookUpInternalDate && lookUpInternalDate.auditfromdate
                  ? this.datePipe.transform(
                      new Date(lookUpInternalDate.auditfromdate),
                      this.dateFormat
                    )
                  : '';
            } else if (
              lookUpShipVisitDate &&
              lookUpShipVisitDate &&
              lookUpShipVisitDate.actualfromdate
            ) {
              lookUpFromDate =
                lookUpShipVisitDate && lookUpShipVisitDate.actualfromdate
                  ? this.datePipe.transform(
                      new Date(lookUpShipVisitDate.actualfromdate),
                      this.dateFormat
                    )
                  : '';
            }
            if (lookUpFromDate && fromDate) {
              if (!(lookUpFromDate === fromDate)) {
                this.exceptionDateFn(subQues, mquest, subq);
              }
            }
          } else if (
            questionId === '3.2.2' ||
            questionId === '3.2.5' ||
            questionId === '3.2.6' ||
            questionId === '3.2.7'
          ) {
            if (lookUpInternalDate) {
              lookUpFromDate =
                lookUpInternalDate && lookUpInternalDate.auditfromdate
                  ? this.datePipe.transform(
                      new Date(lookUpInternalDate.auditfromdate),
                      this.dateFormat
                    )
                  : '';
              lookUpToDate =
                lookUpInternalDate && lookUpInternalDate.audittodate
                  ? this.datePipe.transform(
                      new Date(lookUpInternalDate.audittodate),
                      this.dateFormat
                    )
                  : '';
            } else {
              lookUpFromDate =
                lookUpShipVisitDate && lookUpShipVisitDate.actualfromdate
                  ? this.datePipe.transform(
                      new Date(lookUpShipVisitDate.actualfromdate),
                      this.dateFormat
                    )
                  : '';
              lookUpToDate =
                lookUpShipVisitDate && lookUpShipVisitDate.actualtodate
                  ? this.datePipe.transform(
                      new Date(lookUpShipVisitDate.actualtodate),
                      this.dateFormat
                    )
                  : '';
            }
            if (lookUpFromDate && fromDate && lookUpToDate && toDate) {
              if (!(lookUpFromDate === fromDate && lookUpToDate === toDate)) {
                this.exceptionDateFn(subQues, mquest, subq);
              }
            }
          }
        } else if (questionId === '3.2.3' || questionId === '3.2.4') {
          if (data && data.response) {
            lookUpInternalDate = data.response.Internal.find(
              (x: any) => x.highlight
            );
            lookUpShipVisitDate = data.response.External.find(
              (x: any) => x.highlight
            );
          }
          if (lookUpInternalDate || lookUpShipVisitDate) {
            if (questionId === '3.2.3') {
              fromDate = this.dynamicForms.value.Q107
                ? this.datePipe.transform(
                    new Date(this.dynamicForms.value.Q107),
                    this.dateFormat
                  )
                : '';
              toDate = this.dynamicForms.value.Q108
                ? this.datePipe.transform(
                    new Date(this.dynamicForms.value.Q108),
                    this.dateFormat
                  )
                : '';
            } else if (questionId === '3.2.4') {
              fromDate = this.dynamicForms.value.Q113
                ? this.datePipe.transform(
                    new Date(this.dynamicForms.value.Q113),
                    this.dateFormat
                  )
                : '';
            }
          }
          if (questionId === '3.2.3') {
            if (lookUpInternalDate) {
              lookUpFromDate =
                lookUpInternalDate && lookUpInternalDate.auditfromdate
                  ? this.datePipe.transform(
                      new Date(lookUpInternalDate.auditfromdate),
                      this.dateFormat
                    )
                  : '';
              lookUpToDate =
                lookUpInternalDate && lookUpInternalDate.audittodate
                  ? this.datePipe.transform(
                      new Date(lookUpInternalDate.audittodate),
                      this.dateFormat
                    )
                  : '';
            } else {
              lookUpFromDate =
                lookUpShipVisitDate && lookUpShipVisitDate.actualfromdate
                  ? this.datePipe.transform(
                      new Date(lookUpShipVisitDate.actualfromdate),
                      this.dateFormat
                    )
                  : '';
              lookUpToDate =
                lookUpShipVisitDate && lookUpShipVisitDate.actualtodate
                  ? this.datePipe.transform(
                      new Date(lookUpShipVisitDate.actualtodate),
                      this.dateFormat
                    )
                  : '';
            }
            if (lookUpFromDate && fromDate && lookUpToDate && toDate) {
              if (!(lookUpFromDate === fromDate && lookUpToDate === toDate)) {
                this.exceptionDateFn(subQues, mquest, subq);
              }
            }
          } else if (questionId === '3.2.4') {
            if (lookUpInternalDate) {
              lookUpFromDate =
                lookUpInternalDate && lookUpInternalDate.auditfromdate
                  ? this.datePipe.transform(
                      new Date(lookUpInternalDate.auditfromdate),
                      this.dateFormat
                    )
                  : '';
            } else {
              lookUpFromDate =
                lookUpShipVisitDate && lookUpShipVisitDate.actualfromdate
                  ? this.datePipe.transform(
                      new Date(lookUpShipVisitDate.actualfromdate),
                      this.dateFormat
                    )
                  : '';
            }
            if (fromDate && lookUpFromDate) {
              if (!(lookUpFromDate === fromDate)) {
                this.exceptionDateFn(subQues, mquest, subq);
              }
            }
          }
        }
      });
  }
  workSpace() {
    this.showWorkSpace = !this.showWorkSpace;
    const expandIcon = document.getElementById('wrkflIcon');
    if (!this.showWorkSpace) {
      this.renderer.setProperty(expandIcon, 'textContent', 'chevron_left');
    } else {
      this.renderer.setProperty(expandIcon, 'textContent', 'chevron_right');
    }
  }
  onSearchTextChanged(searchValue: string) {
    this.searchText = searchValue;
    this.isSearchActive = searchValue.length > 0;
    this.expandMethod();
    this.isLeftIcon = true;

    let sideBar = document.getElementById('sideBarList');
    let pending = document.getElementById('pendingArea');
    let contentArea = document.getElementById('contentArea');
    let expColl = document.getElementById('expCol');
    let guidance = document.getElementById('guidanceWrapper');
    if (this.isSearchActive) {
      this.ShowAllQuest();
      expColl?.classList.remove('hideCol');
      pending?.classList.remove('col-sm-12', 'expandedContent');
      pending?.classList.add('col-sm-9');
      sideBar?.classList.remove('sideCollapse');
      contentArea?.classList.add('col-sm-12', 'expandedContent');
      contentArea?.classList.remove('col-sm-9');
      guidance?.classList.add('guideWrap');
      guidance?.classList.remove('guideWrapExpanded');
    } else {
      this.ShowAllQuest();
      expColl?.classList.remove('hideCol');
      pending?.classList.remove('col-sm-12', 'expandedContent');
      pending?.classList.add('col-sm-9');
      sideBar?.classList.remove('sideCollapse');
      contentArea?.classList.remove('col-sm-12', 'expandedContent');
      contentArea?.classList.add('col-sm-9');
      guidance?.classList.add('guideWrap');
      guidance?.classList.remove('guideWrapExpanded');
    }
  }

  expandMethod() {
    this.getAllDatas.forEach((heading: any) => {
      heading.expanded = true;
    });
  }

  lookUpResetForm(event: any, quest: any, mquest: any) {
    if (this.lookUpEnable || this.viewMode) {
      return;
    }
    const mQuestion = mquest.mainQuestion;
    const str = mQuestion.split(' ');
    let questionId = '';
    if (str && str.length > 0) {
      if (str[0].endsWith('.')) {
        const stringWithoutLastDot = str[0].slice(0, -1);
        str[0] = stringWithoutLastDot;
      }
      const matchResult = str[0].match(/\d+\.\d+\.\d+(\.\d+)?/);
      if (matchResult) {
        questionId = matchResult[0];
      } else {
        const modifiedStr = str[0].replace(/\.\w*$/, '');
        questionId = modifiedStr;
      }
    }
    if (mquest) {
      if (mquest && mquest.qid === 'MQ6') {
        this.formResetMQ6();
        this.lookupResetBtn(questionId, 'Reset', '');
      } else if (mquest && mquest.qid === 'MQ20') {
        this.formResetMQ20();
        this.lookupResetBtn(questionId, 'Reset', '');
      } else if (mquest && mquest.qid === 'MQ154') {
        this.formResetMQ154();
        this.lookupResetBtn(questionId, 'Reset', '');
      } else if (mquest && mquest.qid === 'MQ97') {
        this.formResetMQ97();
        this.lookupResetBtn(questionId, 'Reset', '');
      } else if (mquest && mquest.qid === 'MQ100') {
        this.formResetMQ100();
        this.lookupResetBtn(questionId, 'Reset', '');
      } else if (mquest && mquest.qid === 'MQ105') {
        this.formResetMQ105();
        this.lookupResetBtn(questionId, 'Reset', '');
      } else if (mquest && mquest.qid === 'MQ111') {
        this.formResetMQ111();
        this.lookupResetBtn(questionId, 'Reset', '');
      } else if (mquest && mquest.qid === 'MQ115') {
        this.formResetMQ115();
        this.lookupResetBtn(questionId, 'Reset', '');
      } else if (mquest && mquest.qid === 'MQ120') {
        this.formResetMQ120();
        this.lookupResetBtn(questionId, 'Reset', '');
      } else if (mquest && mquest.qid === 'MQ125') {
        this.formResetMQ125();
        this.lookupResetBtn(questionId, 'Reset', '');
      } else if (quest.subheadid === 'SH14') {
        this.formResetSH14(quest);
      } else if (quest.subheadid === 'SH29') {
        this.formResetSH29();
        this.lookupResetBtn('2.5.', 'Reset', '');
      } else if (mquest && mquest.qid === 'MQ26') {
        this.formResetMQ26();
        this.lookupResetBtn(questionId, 'Reset', '');
      } else if (mquest && mquest.qid === 'MQ29') {
        this.formResetMQ29();
        this.lookupResetBtn(questionId, 'Reset', '');
      } else if (mquest && mquest.qid === 'MQ34') {
        this.formResetMQ34();
        this.lookupResetBtn(questionId, 'Reset', '');
      }
      const exceptioDetails = [...this.exceptionList];
      const filterMquest = exceptioDetails.filter((exc) => {
        return (
          mquest.qid === exc.mainQueId && exc.mainQuestion.includes(questionId)
        );
      });
      filterMquest.forEach((data) => {
        this.exceptionList.forEach((filter: any, index: number) => {
          if (filter.guid.value === data.guid.value) {
            this.exceptionList.splice(index, 1);
          }
        });
      });
      this.updateExceptionList();
      event.preventDefault();
      event.stopPropagation();
    }
  }
  highlightSearchText(text: string): string {
    if (this.searchText.length > 0) {
      const escapedSearchText = this.searchText.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );
      const regex = new RegExp(escapedSearchText, 'gi');
      return (document.createElement('div').textContent = text.replace(
        regex,
        '<span class="highlight">$&</span>'
      ));
    }
    return text;
  }

  openOriginalQuest(allValues: any, question: any) {
    this.selectValue(allValues.subHeaders);
    setTimeout(() => {
      this.scrollToElement(question.qid);
    }, 100);
    this.isSearchActive = false;
    this.ShowAllQuest();
    this.onSearchTextChanged('');
    this.globalSearchComponent.clearSearch();
  }

  disableLookUp(mquest: any) {
    mquest.subQuestion.forEach((item: any) => {
      if (
        this.userDetails?.cntrlType === 'CNT002' &&
        item.entryorgin === 'Office'
      ) {
        this.lookUpEnable = true;
      } else {
        this.lookUpEnable = this.viewMode ? true : false;
      }
    });
  }

  isQuestionShow(entrylogin: any): boolean | undefined {
    if (entrylogin) {
      if (this.userDetails?.cntrlType === 'CNT001') {
        this.lookUpEnable = false;
        this.locationCode = this.userDetails.companyCode;
        localStorage.setItem('locationCode', this.locationCode);
        if (this.getOrigination == 'CNT002' && this.getStatus == 'Inprogress') {
          var flag = entrylogin === 'Office';
          return flag;
        } else if (
          (this.getOrigination == 'CNT001' &&
            (this.getStatus == 'Submitted' || this.getStatus == 'Approved') &&
            this.getApproveRank != this.userDetails?.rankCode) ||
          (this.getOrigination == 'CNT002' &&
            this.getStatus != 'Inprogress' &&
            this.getApproveRank != this.userDetails?.rankCode) ||
          (this.getOrigination == 'CNT001' &&
            (this.getStatus == 'ReAssigned' || this.getStatus == 'Approved') &&
            this.getApproveRank === this.userDetails?.rankCode) ||
          (this.getOrigination == 'CNT002' &&
            (this.getStatus == 'ReAssigned' || this.getStatus == 'Approved'))
        ) {
          this.viewMode = true;
          var flag = false;
          return flag;
        } else {
          var flag = true;
          return flag;
        }
      } else if (this.userDetails?.cntrlType === 'CNT002') {
        if (
          this.getOrigination == 'CNT001' ||
          this.getStatus == 'Submitted' ||
          this.getStatus == 'Approved'
        ) {
          const disableFields = true;
          this.appServices.setEnableBtn(disableFields);
          this.viewMode = true;
          var flag = false;
          return flag;
        } else {
          var flag =
            entrylogin === 'Vessel' ||
            entrylogin === 'Auto or Preset' ||
            entrylogin === 'Preset' ||
            entrylogin === 'Hybrid';
          this.locationCode =
            this.userDetails.userData.mdata.appInfo.vesselCode;
          localStorage.setItem('locationCode', this.locationCode);
          return flag;
        }
      } else {
        return undefined;
      }
    } else {
      flag = true;
      return flag;
    }
  }

  isSpecialClass(entrylogin: any): boolean {
    return entrylogin === 'Auto or Preset' || entrylogin === 'Preset';
  }

  ishighlightClass(entrylogin: any): boolean {
    return entrylogin === 'Auto or Preset' || entrylogin === 'Preset';
  }

  home() {
    if (this.unSavedData) {
      const dialogRef = this.dialog.open(
        UnsaveConfirmationDialogPopupComponent,
        {
          disableClose: true,
          panelClass: 'confirm-dialog-container',
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        this.unSavedData = false;
        this.appServices.setUnSaveAction(false);
        this.dialog.closeAll();
        if (result) {
          this.navigateLandingPage();
        } else {
          setTimeout(() => {
            this.unSavedData = true;
            this.appServices.setUnSaveAction(true);
          }, 100);
        }
      });
      return;
    } else {
      localStorage.removeItem('setDisable');
      localStorage.removeItem('AppRank');
      localStorage.removeItem('Origination');
      this.navigateLandingPage();
    }
  }

  navigateLandingPage() {
    localStorage.removeItem('getSelectedCheckListID');
    localStorage.removeItem('previousTabIndex');
    localStorage.removeItem('currentVesselType');
    localStorage.removeItem('vesselType');
    this.appServices.setEditVisible(false);
    localStorage.setItem('setEditVisible', 'false');
    this.router.navigate(['/sire/piq-landing/']);
  }

  edit() {
    localStorage.setItem('setDisable', 'false');
    this.router.navigate(['/sire/piq-report/' + this.referenceNumber]);
    if (this.route.snapshot.paramMap.get('type') == 'view') {
      this.appServices.setEnableBtn(false);
      if (this.userDetails?.cntrlType === 'CNT002') {
        if (
          this.getOrigination == 'CNT002' &&
          (this.getStatus != 'Approved' || this.getStatus != 'Submitted')
        ) {
          this.viewMode = false;
          this.saveDisable = false;
        } else {
        }
      } else if (this.userDetails?.cntrlType === 'CNT001') {
        if (this.getOrigination === 'CNT001' && this.getStatus != 'Approved') {
          this.viewMode = false;
          this.saveDisable = false;
        } else if (
          this.getOrigination == 'CNT002' &&
          (this.getStatus == 'Submitted' ||
            this.getStatus == 'ReAssigned' ||
            this.getStatus == 'Inprogress')
        ) {
          this.viewMode = false;
          this.saveDisable = false;
        }
      }
    } else {
      this.viewMode = false;
      this.disableEditMode = false;
      this.saveDisable = false;
      this.appServices.setEnableBtn(false);
    }
  }

  showpendQues() {
    if (this.isSearchActive) {
      this.showPendingQuest = false;
      this.AllQuestions = false;
    } else {
      this.showPendingQuest = true;
      this.AllQuestions = false;
    }
  }

  ShowAllQuest() {
    if (this.isSearchActive) {
      this.showPendingQuest = false;
      this.AllQuestions = false;
    } else {
      this.AllQuestions = true;
      this.showPendingQuest = false;
    }
  }
  onTabChanged(event: any) {
    if (event.index === 2) {
      this.photoRepComponent.processElementsInView();
    }

    if (event && event.index != 1) {
      if (this.unSavedData) {
        this.tabGroup.selectedIndex = 1;
        const dialogRef = this.dialog.open(
          UnsaveConfirmationDialogPopupComponent,
          {
            disableClose: true,
            panelClass: 'confirm-dialog-container',
          }
        );
        dialogRef.afterClosed().subscribe((result) => {
          this.unSavedData = false;
          this.appServices.setUnSaveAction(false);
          if (result) {
            const index = localStorage.getItem('previousTabIndex');
            if (index != '1') {
              this.dialog.closeAll();
              this.tabGroup.selectedIndex = index;
            }
          } else {
            this.dialog.closeAll();
            setTimeout(() => {
              this.unSavedData = true;
              this.appServices.setUnSaveAction(true);
            }, 100);
          }
        });
        return;
      }
      this.appServices.getTabChangeData().subscribe((res: any) => {
        this.tabGroup.selectedIndex = res.tab;
        this.selectValue(res.subHeaders);
      });
    }
  }

  myTabSelectedIndexChange(event: any) {
    if (event != 1) {
      localStorage.setItem('previousTabIndex', event);
    }
  }

  lookupResetBtn(
    questionId: any,
    lookup: any,
    payloadDetails: any,
    header?: string,
    mainQueId?: any
  ) {
    this.loaderService.loaderShow();
    const payload = {
      instanceid: this.referenceNumber,
      questionid: questionId,
      lookupid: lookup ? lookup : '',
      lookupjson: payloadDetails,
      user: this.userDetails?.userCode,
    };
    this.appServices.saveLookUp(payload).subscribe((data) => {
      this.loaderService.loaderHide();
      this.submitFormAll(this.dynamicForms, 0, header, mainQueId);
    });
  }

  receiveRefernceCount(message: any) {
    this.refernceCount = 'References' + ' ' + '(' + message + ')';
  }

  receiveExceptionCount(message: any) {
    this.exceptionCount = 'Exceptions' + ' ' + '(' + message + ')';
  }

  formResetMQ6() {
    this.dynamicForms.patchValue({
      Q8: '',
      Q9: '',
      Q10: 0,
    });
  }

  formResetMQ20() {
    this.dynamicForms.patchValue({
      Q22: '',
      Q23: '',
      Q24: 0,
    });
  }
  formResetMQ154() {
    this.dynamicForms.patchValue({
      Q155: '',
      Q156: '',
      Q158: '',
      Q160: '',
      Q161: '',
    });
  }

  formResetMQ97() {
    this.dynamicForms.patchValue({
      Q99: '',
    });
  }

  formResetMQ100() {
    this.dynamicForms.patchValue({
      Q101: '',
      Q102: '',
      Q103: 0,
    });
  }

  formResetMQ105() {
    this.dynamicForms.patchValue({
      Q107: '',
      Q108: '',
      Q109: 0,
    });
  }
  formResetMQ111() {
    this.dynamicForms.patchValue({
      Q113: '',
    });
  }
  formResetMQ115() {
    this.dynamicForms.patchValue({
      Q117: '',
      Q118: '',
    });
  }
  formResetMQ120() {
    this.dynamicForms.patchValue({
      Q122: '',
      Q123: '',
    });
  }

  formResetMQ125() {
    this.dynamicForms.patchValue({
      Q127: '',
      Q128: '',
    });
  }

  formResetSH14(quest: any) {
    quest.question.forEach((que: any) => {
      que.subQuestion.forEach((subQue: any) => {
        if (
          valuesToCheckDD.includes(subQue.qid) ||
          valuesToCheckDate.includes(subQue.qid) ||
          subQue.qid.includes('D')
        ) {
          if (subQue.qid.includes('D')) {
            delete this.dynamicForms.value[subQue.qid];
          } else {
            this.dynamicForms.controls[subQue.qid].setValue('');
            subQue.answer = '';
            subQue.savedAnswer = '';
          }
        }
      });
    });
    this.arrayObj = [];
    this.lookupResetBtn('5.7', 'Reset', '');
  }

  formResetSH29() {
    this.dynamicForms.patchValue({
      Q136: '',
      Q139: '',
      Q142: '',
      Q145: '',
    });
  }

  formResetMQ26() {
    this.dynamicForms.patchValue({
      Q27: '',
      Q28: '',
    });
  }
  formResetMQ29() {
    this.dynamicForms.patchValue({
      Q30: '',
      Q31: '',
    });
  }
  formResetMQ34() {
    this.dynamicForms.patchValue({
      Q33: '',
      Q34: '',
    });
  }

  ngOnDestroy(): void {
    this.referenceNumber = null;
  }
}
