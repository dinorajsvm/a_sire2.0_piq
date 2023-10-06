import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'ag-grid-enterprise';
import { LicenseManager } from 'ag-grid-enterprise';
import { BudgetService } from '../../services/budget.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { colorCodes } from 'src/app/core/constants';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LookupDialogComponent } from '../lookup-dialog/lookup-dialog.component';
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
export class PiqReportComponent implements OnInit {
  @ViewChild('expandedSection', { static: false }) expandedSection!: ElementRef;
  @ViewChild('globalSearchComponent') globalSearchComponent: any;
  @ViewChild('comExpColBtn') comExpColBtn!: ElementRef;
  @ViewChild('selectedContentContainer', { read: ElementRef, static: false })
  selectedContentContainer!: ElementRef;
  locationCode: any;
  isContentVisible: boolean[] = [];
  selectedValue: string = '';
  selectedQuestion: any;
  dynamicForms!: FormGroup;
  selectedVsl: any[] = [];
  isErrorSelected: boolean = false;
  completedQuestionCount: number = 0;
  SelectedDate: any;
  expandAll: boolean = true;
  allQuestion: any;
  subAnswers: any[] = [];
  completedSign: boolean = false;
  getPresetQuestCounts: string[] = [];
  headerListContainer: boolean = true;
  descriptionContainer = false;
  lookupContainer = false;
  searchText: string = '';
  getAllDatas: any;
  isSearchActive = false;
  referenceNumber: any;
  isForm: boolean = true;
  userDetails: any;
  mainQuestCounts: any;
  subq = { responsearry: [] };
  pendingCount: any;
  getMainQuestCounts: any = [];
  getShipPreQuestCounts: any = [];
  exceptionList: any[] = [];
  viewMode?: boolean;
  memoVisible: boolean = false;
  checkboxBoolean: any = [];
  datas: any;
  inCompleted = true;
  inProgress = false;
  completed = false;
  enablePRTab: boolean = true;
  enableViewMode!: boolean;
  filterResponse: any[] = [];
  vesselCode: any;
  topbarData: any;
  getGuideLines: any;
  getQuestionId: any[] = [];
  infoMQuestId: any;
  getGuideQuestID: any[] = [];
  presetQuestCount: any;
  lastModifiedData: any[] = [];
  vesselSelection: any;
  getOrigination: any;
  getStatus: any;
  manualLookupData: any[] = [];
  getWrkFlowId: any;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private BudgetService: BudgetService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private _storage: StorageService,
    private _snackBarService: SnackbarService,
    private datePipe: DatePipe
  ) {
    this.userDetails = this._storage.getUserDetails();
  }

  ngOnInit(): void {
    this.referenceNumber = this.route.snapshot.paramMap.get('id');
    (this.vesselCode = this.userDetails.userData.mdata.appInfo.vesselCode),
    this.getworkflowStatus();
    this.saveWorkFlowAction();
    this.getQuestionAnswerDatas();
    this.getTopBarDatas();
    this.getGuideLinesData();
    this.edit();
    this.BudgetService.getEnableViewMode().subscribe((res: any) => {
      this.viewMode = res;
    });

    if (this.route.snapshot.paramMap.get('type') == 'view') {
      this.viewMode = true;
    }
    this.BudgetService.getPreviousPresetData().subscribe((data: any) => {
      Object.keys(data).forEach((response) => {
        if (this.dynamicForms.controls[response]) {
          this.getAllDatas.forEach((value1: any) => {
            value1.values.forEach((value: any) => {
              value.question.forEach((subHeader: any) => {
                subHeader.subQuestion.forEach((mainQus: any) => {
                  if (response === mainQus.qid) {
                    mainQus.answer = data[response];
                    if (mainQus.answer) {
                      mainQus.inprogress = false;
                      mainQus.completed = true;
                    } else {
                      mainQus.inprogress = true;
                      mainQus.completed = false;
                    }
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
        this.selectValue(
          this.getAllDatas[0].values[0].subHeaders,
          this.getAllDatas[0].values[0]
        );
      }

      this.BudgetService.setSummaryGridData(this.getAllDatas);
    });
    this.BudgetService.getExceptionResetData().subscribe((resetData) => {
      this.getAllDatas.forEach((value1: any) => {
        value1.values.forEach((value: any) => {
          value.question.forEach((subHeader: any) => {
            subHeader.subQuestion.forEach((mainQus: any) => {
              if (resetData === mainQus.qid) {
                mainQus.answer = mainQus.presetvalue;
                if (mainQus.answer) {
                  mainQus.inprogress = false;
                  mainQus.completed = true;
                } else {
                  mainQus.inprogress = true;
                  mainQus.completed = false;
                }
                this.dynamicForms.controls[resetData].patchValue(
                  mainQus.presetvalue
                );
              }
            });
          });
        });
      });
      this.subHeaderCount();
    });
  }

  getTopBarDatas() {
    this.BudgetService.getTopBarData(this.vesselCode).subscribe((res: any) => {
      const data = res.response;
      this.topbarData = data;
    });
  }

  saveWorkFlowAction(){
    const payload={
      wfaction:"INP",
      wfid:this.getWrkFlowId,
      instanceid:this.referenceNumber,
      user:this.userDetails.userCode,
      rank:this.userDetails.userData.mdata.appInfo.rankCode,
      remarks:""
    }

    

    this.BudgetService.getworkflowaction(payload).subscribe((res:any)=>{
    })
  }

  getworkflowStatus(){
    this.BudgetService.getworkFlowStatus().subscribe((res:any)=>{
      console.log("!!!!",res);
      
      let data = res.workflowmapping;
      let val = res.workflowmaster;
      val.forEach((item:any)=>{
        this.getWrkFlowId=item.wfid;
      })
    })
  }

  getGuideLinesData() {
    this.BudgetService.getGuidelines().subscribe((res: any) => {
      const data = res.response;
      this.getGuideLines = data;
      this.getGuideQuestID = [];
      this.getGuideLines.forEach((item: any) => {
        this.getGuideQuestID.push(item.qid);
      });
    });
  }

  ishighlightQuest(guidesId: any): boolean {
    return guidesId.qid === this.infoMQuestId;
  }
  showGuideQuestion(questID: any) {
    this.scrollToElement(questID);
  }

  submitFormAll(value: any) {
    var pendingResult: any = [];
    this.getMainQuestCounts.forEach((element: any) => {
      pendingResult.push({
        mainQuesId: element.qid,
        selected: element.selected,
      });
    });
    var ansPayload = {
      instanceid: this.referenceNumber,
      action: 'I',
      user: this.userDetails?.userCode,
      tenantIdentifier: '',
      answerdata: value.value,
      location: this.locationCode,
      mainQuestCheckbox: pendingResult,
      wfaction:"",
      lastmodifieddata: JSON.stringify(this.lastModifiedData),
    };
    this.BudgetService.getSaveValues(ansPayload).subscribe((res: any) => {
      this._snackBarService.loadSnackBar('Saved Successfully', colorCodes.INFO);
    });
  }

  toggleMemo() {
    this.memoVisible = !this.memoVisible;
  }

  getQuestionAnswerDatas() {
    const payload = {
      instanceid: this.referenceNumber,
      presettype: 'n',
      companycode: 'nyksg',
      vesseltypecode: 'vt002',
    };
    let formGroupFields: any = {};
    this.getMainQuestCounts = [];
    this.getShipPreQuestCounts = [];
    this.getPresetQuestCounts = [];
    this.BudgetService.getPiqQuestAns(payload).subscribe((res: any) => {
      let object = JSON.parse(res.response);
      // res['workfloaction']="INP";
      // res['origination'] = this.userDetails?.cntrlType;
      // res['origination'] = "CNT002";
      // res['status'] = 'save/draft';
      // this.getOrigination = res.origination;
      this.getOrigination = res.orginator;
      // this.getStatus = res.status;
      this.getStatus = res.wrkflow;
      this.getAllDatas = object;
      if (this.getAllDatas) {
        this.selectValue(
          this.getAllDatas[0].values[0].subHeaders,
          this.getAllDatas[0].values[0]
        );
      }
      if (res && res.exceptionlist) {
        let exceptionListObject = JSON.parse(res.exceptionlist);
        this.exceptionList = exceptionListObject.response;
        this.BudgetService.setExceptionData(this.exceptionList);
      }
      object.forEach((value1: any) => {
        value1.filledCount = 0;
        value1.values.forEach((value: any) => {
          value.question.forEach((subHeader: any) => {
            this.getMainQuestCounts.push(subHeader);
            this.checkboxBoolean.push(subHeader.selected);
            this.pendingCount = this.checkboxBoolean.filter(
              (value: any) => value === false
            ).length;
            subHeader.subQuestion.forEach((mainQus: any) => {
              if (
                mainQus.entryorgin === 'Auto or Preset' ||
                mainQus.entryorgin === 'Preset'
              ) {
                this.getPresetQuestCounts.push(mainQus.qid);
                if (mainQus.answer === '') {
                  mainQus.answer = mainQus.presetvalue;
                }
              }
              if (mainQus.answer) {
                mainQus.inprogress = false;
                mainQus.completed = true;
                subHeader.selected = true;
              } else {
                mainQus.inprogress = true;
                mainQus.completed = false;
                subHeader.selected = false;
              }
              const index = this.getMainQuestCounts.findIndex(
                (section: any) =>
                  section.mainQuestion === subHeader.mainQuestion
              );
              this.subHeaderCount();
              this.getMainQuestCounts[index] = subHeader;
              var booleanCount: any = [];
              this.getMainQuestCounts.forEach((element: any) => {
                booleanCount.push(element.selected);
              });
              this.pendingCount = booleanCount.filter(
                (value: any) => value === false
              ).length;
              if (mainQus && mainQus.qid) {
                formGroupFields[mainQus.qid] = new FormControl(mainQus.answer);
              }
            });

            this.dynamicForms = new FormGroup(formGroupFields);
          });
        });
      });
      // this.subHeaderCount();
      this.presetQuestCount = this.getPresetQuestCounts.length;
      this.selectValue(
        this.getAllDatas[0].values[0].subHeaders,
        this.getAllDatas[0].values[0]
      )
      this.BudgetService.setSummaryGridData(this.getAllDatas);
      this.mainQuestCounts = this.getMainQuestCounts.length;
      this.getAllDatas.forEach((heading: any) => {
        heading.expanded = true;
      });
      this.prTabEnabling(this.getAllDatas);
    });
  }

  openDesc(event: Event, questID: any) {
    this.infoMQuestId = questID;
    setTimeout(() => {
      this.showGuideQuestion(questID);
    }, 1000);
    if (this.headerListContainer) {
      this.headerListContainer = false;
      this.descriptionContainer = true;
    } else if (this.descriptionContainer == true) {
      this.headerListContainer = true;
      this.descriptionContainer = false;
    }
    event.preventDefault();
    event.stopPropagation();
  }

  prTabEnabling(alldata: any) {
    alldata.forEach((item: any) => {
      item.values.forEach((val: any) => {
        val.question.forEach((ques: any) => {
          ques.subQuestion.forEach((subQues: any) => {
            this.vesselSelection = subQues.answer;
            if (subQues.subName == 'Vessel Type' && subQues.qid == 'Q133') {
              if (this.vesselSelection == '') {
                this.enablePRTab = true;
              } else {
                this.enablePRTab = false;
              }
              this.BudgetService.setVesselTypeData(this.vesselSelection);
            }
          });
        });
      });
    });
  }

  closeDesc() {
    if (this.descriptionContainer) {
      this.headerListContainer = true;
      this.descriptionContainer = false;
    }
  }

  closeLookup() {
    if (this.lookupContainer) {
      this.headerListContainer = true;
      this.lookupContainer = false;
    }
  }

  selectValue(value: string, allvalues?: any) {
    this.selectedValue = value;
    const targetSubHeaders = value;
    const foundObject = this.getAllDatas.find((section: any) => {
      return section.values.find(
        (subSection: any) => subSection.subHeaders === targetSubHeaders
      );
    });
    const foundItem = allvalues;
    this.allQuestion = foundItem;
    this.selectedQuestion = foundObject.values;
    const subIndex = this.selectedQuestion.findIndex(
      (subSection: any) => subSection.subHeaders == targetSubHeaders
    );
    setTimeout(() => {
      this.scrollToElement(subIndex);
    }, 500);
    this.getQuestionId = [];
    this.selectedQuestion.forEach((item: any) => {
      item.question.filter((val: any) => {
        this.getQuestionId.push(val.qid);
      });
    });
    this.subHeaderCount();
  }

  subHeaderCount() {
    this.getAllDatas.forEach((value1: any) => {
      value1.values.forEach((value: any) => {
        value.isException = false;
        value.question.forEach((subHeader: any) => {
          const filterResponse = subHeader.subQuestion.filter((a: any) => {
            return a.completed === true;
          });
          if (filterResponse.length === subHeader.subQuestion.length) {
            value.completed = true;
            value.inprogress = false;
            subHeader.selected = true;
          } else {
            value.completed = false;
            value.inprogress = true;
            subHeader.selected = false;
          }
          if (subHeader.selected == true) {
            const index = this.getMainQuestCounts.findIndex(
              (section: any) => section.mainQuestion === subHeader.mainQuestion
            );
            this.getMainQuestCounts[index] = subHeader;
            var booleanCount: any = [];
            this.getMainQuestCounts.forEach((element: any) => {
              booleanCount.push(element.selected);
            });
            this.pendingCount = booleanCount.filter(
              (value: any) => value === false
            ).length;
          }
        });
      });
      // filledCount
      const filledCountDetails = value1.values.filter((a1: any) => {
        return a1.completed === true;
      });
      value1.filledCount =
        filledCountDetails && filledCountDetails.length > 0
          ? filledCountDetails.length
          : 0;
    });
    this.getAllDatas.forEach((ids: any) => {
      ids.values.forEach((ids1: any) => {
        ids1.question.forEach((subHeader: any) => {
          subHeader.subQuestion.forEach((que: any) => {
            if (
              (que.entryorgin === 'Auto or Preset' ||
                que.entryorgin === 'Preset') &&
              que.presetvalue &&
              que.answer !== que.presetvalue
            ) {
              ids1.isException = true;
            }
          });
        });
      });
    });
  }

  exceptionFn(ques: any, mquest: any, quest: any) {
    if (quest && quest.hasOwnProperty('presetvalue')) {
      const duplicateResponse = this.exceptionList.find(
        (x) => x.qid === quest.qid
      );
      if (duplicateResponse === undefined) {
        this.exception(ques, mquest, quest);
      } else {
        duplicateResponse.answer = quest.answer;
      }
      this.BudgetService.setExceptionData(this.exceptionList);
    }
  }

  scrollToElement(elementId: string): void {
    const element = document.getElementById(`${elementId}`);
    if (element && element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  getDefaultSelectedValue(): string {
    return this.getAllDatas &&
      this.getAllDatas.length > 0 &&
      this.getAllDatas[0].values &&
      this.getAllDatas[0].values.length > 0
      ? this.getAllDatas[0].values[0]
      : '';
  }

  toggleContent(index: number, value: any) {
    for (let i = 0; i < this.selectedQuestion.length; i++) {
      if (i === index && value === this.selectedQuestion[i].mainQuestion) {
        this.isContentVisible[i] = !this.isContentVisible[i];
        this.isErrorSelected = false;
      }
    }
  }

  toggleExpandAll() {
    this.expandAll = !this.expandAll;
    this.getAllDatas.forEach(
      (heading: any) => (heading.expanded = this.expandAll)
    );
    const expandIcon = document.getElementById('expandIcon');
    if (this.expandAll) {
      this.renderer.setProperty(expandIcon, 'textContent', 'expand_less');
    } else {
      this.renderer.setProperty(expandIcon, 'textContent', 'expand_more');
    }
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

  submitForm() {
    var getCounts: any[] = [];
    getCounts.push({
      value: this.selectedValue,
      completedQuestionCount: this.completedQuestionCount,
      remaining: this.selectedQuestion.length - this.completedQuestionCount,
    });
  }

  saveValues() {
    if (this.subAnswers.length != 0) {
      this.completedSign = false;
    }
    if (this.selectedVsl.length === 0) {
      this.isErrorSelected = true;
    } else {
      this.isErrorSelected = false;

      if (this.completedQuestionCount < this.selectedQuestion.length) {
        this.completedQuestionCount += 1;
        this.completedSign = true;
      }
    }

    this.selectedQuestion.forEach((data: any, index: any) => {
      const cc: any = document.getElementById(index);
      if (this.isErrorSelected) {
        cc.classList.add('colorAdd');
      } else {
        cc.classList.remove('colorAdd');
      }
    });
  }

  // multiSelectedValue: string[] = [];
  toggleMultiSelection(
    controlname: any,
    value: any,
    mquest: any,
    entryorgin: any,
    subq: any,
    quest: any
  ) {
    if (entryorgin.answer.includes(value)) {
      entryorgin.answer = entryorgin.answer.filter(
        (item: any) => item !== value
      );
      this.dynamicForms.controls[controlname].setValue(entryorgin.answer);
    } else {
      entryorgin.answer.push(value);
      this.dynamicForms.controls[controlname].setValue(entryorgin.answer);
    }
    if (entryorgin.answer) {
      entryorgin.inprogress = false;
      entryorgin.completed = true;
    } else {
      entryorgin.inprogress = true;
      entryorgin.completed = false;
    }
    this.selectedValue = quest.subHeaders;

    this.subHeaderCount();
    this.exceptionFn(subq, mquest, quest);
  }

  toggleSingleSelection(
    value: string,
    ques: any,
    mainQue: any,
    subQue: any,
    allValues: any
  ): void {
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
        'dd-MMM-yyyy HH:mm:ss'
      ),
    };
    this.lastModifiedData.push(modifiedData);
    this.lastModifiedData.sort((a, b) => b.sortingDate - a.sortingDate);
    if (this.lastModifiedData.length > 5) {
      this.lastModifiedData.splice(5);
    }
    subQue.answer = value;
    this.vesselSelection = subQue.answer;
    if (subQue.answer) {
      subQue.inprogress = false;
      subQue.completed = true;
    } else {
      subQue.inprogress = true;
      subQue.completed = false;
    }
    this.selectedValue = ques.subHeaders;
    this.subHeaderCount();
    this.exceptionFn(ques, mainQue, subQue);
    this.dynamicForms.controls[subQue.qid].setValue(value);
    this.prTabEnabling(allValues);
  }

  exception(ques: any, mainQue: any, subQue: any) {
    const sqid = subQue.sid;
    const splitValue = sqid.split('.');
    splitValue.shift();
    const exceptionData = {
      qid: subQue.qid,
      subHeaders: ques.subHeaders,
      mainQuestion: mainQue.mainQuestion,
      subName: splitValue.join('.') + ' ' + subQue.subName,
      presetValue: subQue.presetvalue,
      answer: subQue.answer,
      remark: '',
    };
    this.exceptionList.push(exceptionData);
    this.BudgetService.setExceptionData(this.exceptionList);
  }

  resetDate(event: any, subq: any, quest: any, mquest: any) {
    var getresetID = event.target.id;
    var getId = subq.qid;
    const areIdsEqual = getresetID === getId;
    if (areIdsEqual == true) {
      this.dynamicForms.controls[subq.qid].setValue('');
      subq.answer = '';
      mquest.selected = false;
    }
    this.getAllDatas.forEach((value1: any) => {
      value1.values.forEach((value: any) => {
        value.question.forEach((subHeader: any) => {
          subHeader.subQuestion.forEach((mainQus: any) => {
            const index = this.getMainQuestCounts.findIndex(
              (section: any) => section.mainQuestion === subHeader.mainQuestion
            );
            this.getMainQuestCounts[index] = subHeader;
            var booleanCount: any = [];
            this.getMainQuestCounts.forEach((element: any) => {
              booleanCount.push(element.selected);
            });
            this.pendingCount = booleanCount.filter(
              (value: any) => value === false
            ).length;
          });
        });
      });
    });
  }

  restoreOriginal(subq: any) {
    const objWithIdIndex = this.exceptionList.findIndex(
      (obj) => obj.qid === subq.qid
    );
    if (objWithIdIndex > -1) {
      this.exceptionList.splice(objWithIdIndex, 1);
      this.BudgetService.setExceptionData(this.exceptionList);
    }
    this.dynamicForms.controls[subq.qid].setValue(subq.presetvalue);
    subq.answer = subq.presetvalue;
    if (subq.answer) {
      subq.inprogress = false;
      subq.completed = true;
    } else {
      subq.inprogress = true;
      subq.completed = false;
    }
    this.subHeaderCount();
  }

  allExpansionPanelsExpanded = true;
  expandAllMainquestions() {
    this.allExpansionPanelsExpanded = !this.allExpansionPanelsExpanded;
    this.isContentVisible = new Array(this.getAllDatas.length).fill(
      this.allExpansionPanelsExpanded
    );
  }

  areAllQuestionsExpanded() {
    return this.isContentVisible.every((isVisible) => isVisible);
  }

  isSelected(vessels: any, id: any): boolean {
    return this.selectedVsl.includes(vessels);
  }

  navigateToPath() {
    this.router.navigateByUrl('/path');
  }
  getVesselCertificateLookupDetail() {
    // const locationCode = this.userDetails.companyCode;
    this.BudgetService.getVesselCertificateLookup('sndc').subscribe(
      (data) => {
        if (data && data.response) {
          const response = JSON.parse(data.response);
          response.forEach((res: any) => {
            res.dateofissue = this.datePipe.transform(
              res.dateofissue,
              'dd-MMM-yyyy HH:mm:ss'
            );
            res.validfrom = this.datePipe.transform(
              res.validfrom,
              'dd-MMM-yyyy HH:mm:ss'
            );
          });
          this.manualLookupData = response;
        }
      },
      (error) => {
      }
    );
  }
  openLookUp(event: any, quest: any, mainQuest?: any) {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'grid-dialog-container';
    if (quest && quest.subheadid === 'SH1') {
      this.getVesselCertificateLookupDetail();
      if (this.headerListContainer) {
        this.headerListContainer = false;
        this.lookupContainer = true;
      } else if (this.lookupContainer) {
        this.headerListContainer = true;
        this.lookupContainer = false;
      }
    } else if (quest && quest.subheadid === 'SH29') {
      const mocDialog = this.dialog.open(MocComponent, dialogConfig);
      mocDialog.afterClosed().subscribe((result: any) => {
        quest.question.forEach((Mquest: any) => {
          Mquest.subQuestion.forEach((response: any) => {
            if (response && response.type === 'Select') {
              result.forEach((result: any) => {
                if (response && response.qid === result.qid) {
                  this.dynamicForms.controls[response.qid].patchValue(
                    result.value ? 'Yes' : 'No'
                  );
                  response.answer = result.value ? 'Yes' : 'No';
                }
              });
            }

            if (response.answer) {
              response.inprogress = false;
              response.completed = true;
            } else {
              response.inprogress = true;
              response.completed = false;
            }
            // }
          });
        });
      });
    } else if (quest && quest.subheadid === 'SH2') {
      const dialogRef = this.dialog.open(LookupDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((result: any) => {
        const timeDifference =
          result.visittodate.getTime() - result.visitfromdate.getTime();
        const dateCount = Math.floor(timeDifference / (1000 * 3600 * 24));
        if (mainQuest && mainQuest.qid === 'MQ6') {
          this.dynamicForms.patchValue({
            Q8: new Date(result.visitfromdate),
            Q9: new Date(result.visittodate),
            Q10: dateCount,
          });
          quest.question.forEach((Mquest: any) => {
            if (Mquest && Mquest.qid === 'MQ6') {
              Mquest.subQuestion.forEach((response: any) => {
                if (response && response.qid === 'Q8') {
                  response.answer = result.visitfromdate;
                } else if (response && response.qid === 'Q9') {
                  response.answer = result.visittodate;
                } else if (response && response.qid === 'Q10') {
                  response.answer = dateCount;
                }
                if (response.answer) {
                  response.inprogress = false;
                  response.completed = true;
                } else {
                  response.inprogress = true;
                  response.completed = false;
                }
              });
            }
          });
        } else if (mainQuest && mainQuest.qid === 'MQ20') {
          this.dynamicForms.patchValue({
            Q22: new Date(result.visitfromdate),
            Q23: new Date(result.visittodate),
            Q24: dateCount,
          });
          quest.question.forEach((Mquest: any) => {
            if (Mquest && Mquest.qid === 'MQ20') {
              Mquest.subQuestion.forEach((response: any) => {
                if (response && response.qid === 'Q22') {
                  response.answer = result.visitfromdate;
                } else if (response && response.qid === 'Q23') {
                  response.answer = result.visittodate;
                } else if (response && response.qid === 'Q24') {
                  response.answer = dateCount;
                }
                if (response.answer) {
                  response.inprogress = false;
                  response.completed = true;
                } else {
                  response.inprogress = true;
                  response.completed = false;
                }
              });
            }
          });
        }
      });
    } else if (quest && quest.subheadid === 'SH32') {
      const dialogRef = this.dialog.open(PscComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((result: any) => {
        this.dynamicForms.patchValue({
          Q155: 'Yes',
          Q156: result.crdate,
          Q157: 'From Port Master',
          Q158: result.authoritycode,
          Q159: '',
          Q160: result.isnon_nc_def_obs === 'N' ? 'No' : 'Yes',
          Q161: result.deficiencycount === '1' ? 'Yes' : 'No',
        });
        quest.question.forEach((Mquest: any) => {
          if (Mquest && Mquest.qid === 'MQ154') {
            Mquest.subQuestion.forEach((response: any) => {
              if (response && response.qid === 'Q155') {
                response.answer = 'Yes';
              } else if (response && response.qid === 'Q156') {
                response.answer = result.crdate;
              } else if (response && response.qid === 'Q157') {
                response.answer = 'From Port Master';
              } else if (response && response.qid === 'Q158') {
                response.answer = result.authoritycode;
              } else if (response && response.qid === 'Q159') {
                response.answer = '';
              } else if (response && response.qid === 'Q160') {
                response.answer =
                  result.isnon_nc_def_obs === 'N' ? 'No' : 'Yes';
              } else if (response && response.qid === 'Q161') {
                response.answer = result.deficiencycount === '1' ? 'Yes' : 'No';
              }
              if (response.answer) {
                response.inprogress = false;
                response.completed = true;
              } else {
                response.inprogress = true;
                response.completed = false;
              }
            });
          }
        });
      });
    }

    event.preventDefault();
    event.stopPropagation();
  }

  inputChanges(
    event: any,
    subq: any,
    mquest: any,
    entryorgin: any,
    quest: any
  ) {
    var value = event.target.value;
    subq.answer = value;
    if (subq.answer) {
      subq.inprogress = false;
      subq.completed = true;
    } else {
      subq.inprogress = true;
      subq.completed = false;
    }
    this.selectedValue = quest.subHeaders;
  }

  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = inputElement.value;
    inputValue = inputValue.replace(/[^\d]/g, '');
    inputElement.value = inputValue;
  }

  formattedDate: any = '';
  datePickerChanges(
    event: MatDatepickerInputEvent<Date>,
    subQues: any,
    mquest: any,
    subq: any
  ): void {
    const selectedDate = event.value;
    subq.answer = selectedDate;
    this.selectedValue = subQues.subHeaders;
    if (subq.answer) {
      subq.inprogress = false;
      subq.completed = true;
    } else {
      subq.inprogress = true;
      subq.completed = false;
    }

    // this.subHeaderCount();
    this.exceptionFn(subQues, mquest, subq);
    // if (selectedDate != null && selectedDate != undefined) {
    //   mquest.selected = true;
    //   const index = this.getMainQuestCounts.findIndex(
    //     (section: any) => section.mainQuestion === mquest.mainQuestion
    //   );
    //   this.getMainQuestCounts[index] = mquest;
    //   var booleanCount: any = [];
    //   this.getMainQuestCounts.forEach((element: any) => {
    //     booleanCount.push(element.selected);
    //   });
    //   this.pendingCount = booleanCount.filter(
    //     (value: any) => value === false
    //   ).length;
    // } else {
    //   mquest.selected = false;
    // }
  }

  showWorkSpace:boolean=false;
  workSpace(){
    this.showWorkSpace=!this.showWorkSpace;
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
    this.getAllDatas.forEach((heading: any) => {
      heading.expanded = true;
    });
  }

  highlightSearchText(text: string): string {
    if (this.searchText.length > 0) {
      const regex = new RegExp(this.searchText, 'gi');
      return text.replace(regex, '<span class="highlight">$&</span>');
    }
    return text;
  }

  openOriginalQuest(mQuest: any, allValues: any, mQuestIndex: any) {
    this.selectValue(allValues.subHeaders, allValues);
    this.isSearchActive = false;
    this.onSearchTextChanged('');
    this.globalSearchComponent.clearSearch();
    this.toggleContent(mQuestIndex, mQuest);
  }

  isQuestionShow(entrylogin: any): boolean | undefined {
    if (entrylogin) {
      if (this.userDetails?.cntrlType === 'CNT001') {
        this.locationCode = this.userDetails.companyCode;
        localStorage.setItem('locationCode', this.locationCode);
        if (this.getOrigination == 'CNT002' && this.getStatus == 'Inprogress') {
          var flag = entrylogin === 'Office';
          return flag;
        } else if (
          this.getOrigination == 'CNT002' &&
          this.getStatus != 'Inprogress'
        ) {
          var flag = true;
          return flag;
        } else {
          var flag = true;
          return flag;
        }
      } else if (this.userDetails?.cntrlType === 'CNT002') {
        var flag =
          entrylogin === 'Vessel' ||
          entrylogin === 'Auto or Preset' ||
          entrylogin === 'Preset' ||
          entrylogin === 'Hybrid';
        this.locationCode = this.userDetails.userData.mdata.appInfo.vesselCode;
        localStorage.setItem('locationCode', this.locationCode);
        return flag;
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
    this.router.navigate(['/sire/piq-landing/']);
  }

  enableEditMode: boolean = true;
  edit() {
    if (this.route.snapshot.paramMap.get('type') == 'view') {
      this.viewMode = false;
      this.enableEditMode = false;
    } else {
      this.enableEditMode = true;
    }
  }

  showPendingQuest: boolean = false;
  AllQuestions: boolean = true;
  showpendQues() {
    this.showPendingQuest = true;
    this.AllQuestions = false;
  }

  ShowAllQuest() {
    this.AllQuestions = true;
    this.showPendingQuest = false;
  }

  onTabChanged(event: any) {
    if (event && event.index === 0) {
      this.BudgetService.setSummaryGridData(this.getAllDatas);
    }
  }
}
