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
import { MatChip } from '@angular/material/chips';
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
import { findIndex } from 'rxjs';
import { DatePipe } from '@angular/common';

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
  filterResponse: any[] = [];
  vesselCode: any;
  topbarData: any;
  getGuideLines: any;
  getQuestionId: any[] = [];
  getGuideQuestID: any[] = [];
  presetQuestCount: any;
  lastModifiedData: any[] = [];
  vesselSelection: any;
  getValues: any = {};
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private BudgetService: BudgetService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
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
      this.getQuestionAnswerDatas();
    this.getTopBarDatas();
    this.getGuideLinesData();

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
      this.selectValue(
        this.getAllDatas[0].values[0].subHeaders,
        this.getAllDatas[0].values[0]
      );
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
    return this.getQuestionId.some((res: any) => {
      return guidesId.qid === res;
    });
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
    this.getValues = [];
    this.getShipPreQuestCounts = [];
    this.getPresetQuestCounts = [];
    this.BudgetService.getPiqQuestAns(payload).subscribe((res: any) => {
      let object = JSON.parse(res.response);
      this.getAllDatas = object;
      if (res.exceptionlist) {
        let exceptionListObject = JSON.parse(res.exceptionlist);
        this.exceptionList = exceptionListObject.response;
        this.BudgetService.setExceptionData(this.exceptionList);
      }
      object.forEach((value1: any) => {
        // console.log('@@@', value1.values);
        value1.filledCount = 0;
        // this.getValues.push(value1.values);
        value1.values.forEach((value: any) => {
          value.question.forEach((subHeader: any) => {
            this.getMainQuestCounts.push(subHeader);

            // if (subHeader.entryorgin == 'Office') {
            //   this.getShipPreQuestCounts.push(subHeader);
            // }
            this.checkboxBoolean.push(subHeader.selected);
            this.pendingCount = this.checkboxBoolean.filter(
              (value: any) => value === false
            ).length;
            subHeader.subQuestion.forEach((mainQus: any) => {
              // console.log('1111', mainQus);

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
            // console.log('????', this.getShipPreQuestCounts);
            this.dynamicForms = new FormGroup(formGroupFields);
            // console.log('_______', this.getMainQuestCounts);
          });
        });
      });
      this.presetQuestCount = this.getPresetQuestCounts.length;
      this.selectValue(
        this.getAllDatas[0].values[0].subHeaders,
        this.getAllDatas[0].values[0]
      );
      this.BudgetService.setSummaryGridData(this.getAllDatas);
      this.mainQuestCounts = this.getMainQuestCounts.length;
      this.getAllDatas.forEach((heading: any) => {
        heading.expanded = true;
      });
      this.prTabEnabling(this.getAllDatas);
      // console.log("_____",this.getValues)
    });
  }

  headerListContainer: boolean = true;
  descriptionContainer: boolean = false;

  openDesc(event: Event, questID: any) {
    const idValue = questID;
    if (this.headerListContainer) {
      this.headerListContainer = false;
      this.descriptionContainer = true;
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
                this.enablePRTab=true;
                console.log('empty ah irukku');
              } else {
                this.enablePRTab=false;
                
                console.log('empty ah illa', this.vesselSelection);
              }
              this.BudgetService.setVesselTypeData(this.vesselSelection)
            }
          });
        });
      });
    });
    
  }

  closeDesc() {
    if ((this.descriptionContainer = true)) {
      this.headerListContainer = true;
      this.descriptionContainer = false;
    }
  }

  onClickGuideLine() {}

  selectValue(value: string, allvalues?: any) {
    // console.log('vvv', this.dynamicForms.value.Q133);

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
    this.scrollToElement(subIndex);
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
          } else {
            value.completed = false;
            value.inprogress = true;
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
    if (this.getAllDatas.length > 0 && this.getAllDatas[0].values.length > 0) {
      return this.getAllDatas[0].values[0];
    }
    return '';
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

  multiSelectedValue: string[] = [];
  toggleMultiSelection(
    controlname: any,
    value: any,
    mquest: any,
    entryorgin: any,
    subq: any,
    quest: any
  ) {
    // chip.toggleSelected();

    console.log('a', value);
    console.log('b', mquest);
    console.log('c', subq);
    console.log('d', quest);
    console.log('e', entryorgin);
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
    if (value != '' && value != undefined) {
      mquest.selected = true;
      const index = this.getMainQuestCounts.findIndex(
        (section: any) => section.mainQuestion === mquest.mainQuestion
      );
      this.getMainQuestCounts[index] = mquest;
      var booleanCount: any = [];
      this.getMainQuestCounts.forEach((element: any) => {
        booleanCount.push(element.selected);
      });
      this.pendingCount = booleanCount.filter(
        (value: any) => value === false
      ).length;
    }
  }

  toggleSingleSelection(
    value: string,
    ques: any,
    mainQue: any,
    subQue: any,
    allValues: any
  ): void {
    console.log('!!!!', ques);
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
      // Remove the oldest item (first item in the array)
      // this.lastModifiedData.shift();
      this.lastModifiedData.splice(5);
    }
    // this.lastModifiedData = [this.lastModifiedData.pop(), ...this.lastModifiedData];
    console.log(this.lastModifiedData);
    this.BudgetService.setModifiedData(this.lastModifiedData);
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
    if (value != '' && value != undefined) {
      mainQue.selected = true;
      const index = this.getMainQuestCounts.findIndex(
        (section: any) => section.mainQuestion === mainQue.mainQuestion
      );
      this.getMainQuestCounts[index] = mainQue;
      var booleanCount: any = [];
      this.getMainQuestCounts.forEach((element: any) => {
        booleanCount.push(element.selected);
      });
      this.pendingCount = booleanCount.filter(
        (value: any) => value === false
      ).length;
    } else {
      mainQue.selected = false;
    }
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

  openLookUp(event: any, Mquest: any) {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'grid-dialog-container';

    const dialogRef = this.dialog.open(LookupDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result: any) => {
      Mquest.subQuestion.forEach((response: any) => {
        if (Mquest && Mquest.qid === 'MQ6') {
          if (response && response.type === 'Select') {
            if (response && response.qid === 'Q7') {
              this.dynamicForms.controls[response.qid].patchValue(
                response.isCompleted
              );
              response.answer = result.isCompleted;
            }
          }
          if (response && response.qid === 'Q8') {
            this.dynamicForms.controls[response.qid].patchValue(
              result.visitfromdate
            );
            response.answer = result.visitfromdate;
          }
          if (response && response.qid === 'Q9') {
            this.dynamicForms.controls[response.qid].patchValue(
              result.visittodate
            );
            response.answer = result.visittodate;
          }
          if (response.answer) {
            response.inprogress = false;
            response.completed = true;
          } else {
            response.inprogress = true;
            response.completed = false;
          }
        }
      });
    });

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
    this.subHeaderCount();
    this.exceptionFn(quest, mquest, subq);
    if (value != '' && value != undefined) {
      mquest.selected = true;
      const index = this.getMainQuestCounts.findIndex(
        (section: any) => section.mainQuestion === mquest.mainQuestion
      );
      this.getMainQuestCounts[index] = mquest;
      var booleanCount: any = [];
      this.getMainQuestCounts.forEach((element: any) => {
        booleanCount.push(element.selected);
      });
      this.pendingCount = booleanCount.filter(
        (value: any) => value === false
      ).length;
    } else {
      mquest.selected = false;
    }
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

    this.subHeaderCount();
    this.exceptionFn(subQues, mquest, subq);
    if (selectedDate != null && selectedDate != undefined) {
      mquest.selected = true;
      const index = this.getMainQuestCounts.findIndex(
        (section: any) => section.mainQuestion === mquest.mainQuestion
      );
      this.getMainQuestCounts[index] = mquest;
      var booleanCount: any = [];
      this.getMainQuestCounts.forEach((element: any) => {
        booleanCount.push(element.selected);
      });
      this.pendingCount = booleanCount.filter(
        (value: any) => value === false
      ).length;
    } else {
      mquest.selected = false;
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
        var flag = true;
        this.locationCode = this.userDetails.companyCode;
        localStorage.setItem('locationCode', this.locationCode);
        return flag;
      } else if (this.userDetails?.cntrlType === 'CNT002') {
        var flag =
          entrylogin === 'Vessel' ||
          entrylogin === 'Auto or Preset' ||
          entrylogin === 'Preset';
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
