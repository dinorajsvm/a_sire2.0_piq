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
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { colorCodes } from 'src/app/core/constants';
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
import { filter } from 'rxjs/operators';

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
export class PiqReportComponent implements OnInit {
  @ViewChild('expandedSection', { static: false }) expandedSection!: ElementRef;
  @ViewChild('globalSearchComponent') globalSearchComponent: any;
  @ViewChild('comExpColBtn') comExpColBtn!: ElementRef;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  rowSummaryData: any[] = [];
  emptyRemark: any;
  totalRowCount = 0;
  locationCode: any;
  selectedValue: string = '';
  selectedQuestion: any;
  dynamicForms!: FormGroup;
  findResponse: any;
  expandAll: boolean = true;
  allQuestion: any;
  getPresetQuestCounts: string[] = [];
  headerListContainer: boolean = true;
  descriptionContainer = false;
  searchText: string = '';
  getAllDatas: any;
  isSearchActive = false;
  referenceNumber: any;
  userDetails: any;
  mainQuestCounts: any;
  subq = { responsearry: [] };
  pendingCount: any;
  getMainQuestCounts: any = [];
  exceptionList: any[] = [];
  viewMode?: boolean;
  memoVisible: boolean = false;
  checkboxBoolean: any = [];
  filterResponse: any[] = [];
  vesselCode: any;
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
  initialMultiAns = true;
  selectedMultiAns = false;
  showPendingQuest: boolean = false;
  AllQuestions: boolean = true;
  formattedDate: any = '';
  allExpansionPanelsExpanded = true;
  getVesselCode: any;
  getExceptionGridData: any;
  lookUpEnable: boolean = false;
  isLeftIcon = true;
  hideEditbutton = false;
  saveDisable = true;
  saveMappedCertificateData: any;
  getSearch: any;
  hideReqBtns: boolean = false;
  gridApi: any;
  isLoader = false;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private BudgetService: BudgetService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private _storage: StorageService,
    private _snackBarService: SnackbarService,
    private datePipe: DatePipe,
    private el: ElementRef
  ) {
    this.userDetails = this._storage.getUserDetails();
  }

  ngOnInit(): void {
    this.referenceNumber = this.route.snapshot.paramMap.get('id');

    this.getworkflowStatus();
    this.getWrkFlSummary();
    this.getQuestionAnswerDatas();
    this.getGuideLinesData();
    this.BudgetService.getEnableViewMode().subscribe((res: any) => {
      if (this.userDetails?.cntrlType === 'CNT001') {
        this.disableEditMode = res;
      }
    });
    this.BudgetService.getEditVisible().subscribe((res: any) => {
      this.hideEditbutton = res;
      this.hideReqBtns = res;
    });
    this.BudgetService.getSearch().subscribe((res: any) => {
      this.getSearch = res;
      if (this.getSearch == false) {
        this.onSearchTextChanged('');
      }
    });

    this.onTabChanged(event);
    this.BudgetService.getExceptionRowData().subscribe((res: any) => {
      this.getExceptionGridData = [];
      this.getExceptionGridData = res && res.length > 0 ? res : [];
    });

    this.BudgetService.getSavedMappedCertificateData().subscribe((res: any) => {
      this.saveMappedCertificateData = res;
    });
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
    });
    this.BudgetService.getExceptionResetData().subscribe((resetData) => {
      this.getAllDatas.forEach((value1: any) => {
        if (value1 && value1.values) {
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
        }
      });
      this.subHeaderCount();
    });
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/sire/piq-landing') {
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      });
  }

  getTopBarDatas() {
    this.isLoader = true;
    this.BudgetService.getTopBarData(this.vesselCode).subscribe((res: any) => {
      const data = res.response;
      this.topbarData = data;
      this.isLoader = false;
    });
  }

  getworkflowStatus() {
    this.isLoader = true;
    this.BudgetService.getworkFlowStatus().subscribe((res: any) => {
      let val = res.workflowmaster;
      const getAppRank = val&& val[0]&&val[0].approvers?val[0].approvers.find((x: any) => x === this.userDetails?.rankCode):""
      this.getApproveRank = getAppRank !== undefined ? getAppRank : 0;
      this.isLoader = false;
    });
  }
  getWrkFlSummary() {
    this.isLoader = true;
    this.BudgetService.getWorkFlowSummary(this.referenceNumber).subscribe(
      (res: any) => {
        this.getWrkFlSummaryData = res.response;
        this.isLoader = false;
      }
    );
  }
  arrayObj: any[] = [];
  getGuideLinesData() {
    this.isLoader = true;
    this.BudgetService.getGuidelineData().subscribe((res: any) => {
      const data = res;
      this.getGuideLines = data;
      this.isLoader = false;
    });
  }

  ishighlightQuest(guidesId: any): boolean {
    return guidesId.qid === this.infoMQuestId;
  }
  showGuideQuestion(questID: any) {
    this.scrollToElement(questID);
  }

  submitFormAll(value: any) {
    if (this.getExceptionGridData && this.getExceptionGridData.length > 0) {
      this.emptyRemark = this.getExceptionGridData.find(
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
    this.isLoader = true;
    var pendingResult: any = [];
    this.getMainQuestCounts.forEach((element: any) => {
      pendingResult.push({
        mainQuesId: element.qid,
        selected: element.selected,
      });
    });
    this.BudgetService.setPiqQuestionData(value.value)
    var ansPayload = {
      chapterdata: JSON.stringify(this.rowSummaryData),
      instanceid: this.referenceNumber,
      action: 'I',
      user: this.userDetails?.userCode,
      tenantIdentifier: '',
      answerdata: value.value,
      location: this.locationCode,
      mainQuestCheckbox: pendingResult,
      exceptionjson: this.getExceptionGridData,
      wfaction: '',
      lastmodifieddata: JSON.stringify(this.lastModifiedData),
      duplicateDetails: this.arrayObj,
      certificatetab: this.saveMappedCertificateData,
    };
    this.chapterGrid();
    this.BudgetService.getSaveValues(ansPayload).subscribe((res: any) => {
      this._snackBarService.loadSnackBar('Saved Successfully', colorCodes.INFO);
      this.isLoader = false;
    });
  }

  toggleMemo() {
    this.memoVisible = !this.memoVisible;
  }

  exceptionCount() {
    this.BudgetService.setExceptionData(this.exceptionList);
    const rowCount =
      this.exceptionList && this.exceptionList.length > 0
        ? this.exceptionList.length
        : 0;
    this.BudgetService.setExceptionGridData(rowCount);
  }

  getQuestionAnswerDatas() {
    const payload = {
      instanceid: this.referenceNumber,
      presettype: 'n',
      companycode: this.userDetails.companyCode,
    };
    let formGroupFields: any = {};
    this.getMainQuestCounts = [];
    this.getPresetQuestCounts = [];
    this.BudgetService.getPiqQuestAns(payload).subscribe((res: any) => {
      if (res && res.exceptionlist != '') {
        let exceptionData = JSON.parse(res.exceptionlist);
        this.BudgetService.setExceptionData(exceptionData);
      }
      let object = JSON.parse(res.response);
      this.getOrigination = res.orginator;
      this.getVesselCode = res.vesselcode;
      localStorage.setItem('masterVesselCode', res.vesselcode);
      this.vesselSelection = res.vesseltypename;
      this.selectedMultiAns = false;
      this.initialMultiAns = true;

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

      this.BudgetService.setVesselTypeData(this.vesselSelection);
      this.BudgetService.setVslCodeData(this.getVesselCode);
      this.getStatus = res.wrkflow;

      if (this.route.snapshot.paramMap.get('type') == 'view') {
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
          if (
            this.getOrigination == 'CNT002' &&
            this.getStatus != 'Submitted'
          ) {
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

      if (this.getAllDatas) {
        this.selectValue(
          this.getAllDatas[0].values[0].subHeaders,
          this.getAllDatas[0].values[0]
        );
      }
      if (res && res.exceptionlist) {
        let exceptionListObject = JSON.parse(res.exceptionlist);
        this.exceptionList = exceptionListObject.response
          ? exceptionListObject.response
          : [];
        this.exceptionCount();
      }

      if (res && res.guidence) {
        let guidenceObject = JSON.parse(res.guidence);
        let guidance = guidenceObject ? guidenceObject : [];
        this.BudgetService.setGuidelineData(guidance);
      }
      object.forEach((value1: any) => {
        value1.filledCount = 0;
        value1.values.forEach((value: any) => {
          value.question.forEach((subHeader: any) => {
            if (subHeader && subHeader.qid) {
              formGroupFields[subHeader.qid] = new FormControl(
                subHeader.answer
              );
            }
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

              if (mainQus.type === 'MultiSelect') {
                const ans = mainQus.answer.replace(/\[|\]/g, '');
                const trimedAns = ans.replace(/\[|\]/g, '');
                mainQus.answer = trimedAns;

              }
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
            this.dynamicForms.patchValue({ Q133: this.vesselSelection });

            if (subHeader && subHeader.qid === 'MQ1') {
              subHeader.answer = this.vesselSelection;
            }
          });
        });
      });
      this.getAllDatas = object;

      this.chapterGrid();
      this.subHeaderCount();
      this.presetQuestCount = this.getPresetQuestCounts.length;
      this.selectValue(
        this.getAllDatas[0].values[0].subHeaders,
        this.getAllDatas[0].values[0]
      );
      setTimeout(() => {
        this.toggleSingleSelection(
          this.vesselSelection,
          this.getAllDatas[0].values[0],
          this.getAllDatas[0].values[0].question[0],
          this.getAllDatas[0].values[0].question[0].subQuestion[0]
        );
      }, 500);
      this.mainQuestCounts = this.getMainQuestCounts.length;
      this.getAllDatas.forEach((heading: any) => {
        heading.expanded = true;
      });
      this.vesselCode = this.getVesselCode;
      this.getTopBarDatas();
      this.isLoader = false;
    });
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

  selectValue(value: string, allvalues?: any) {
    this.selectedValue = value;
    const targetSubHeaders = value;
    this.AllQuestions = true;
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
    }, 100);
    this.subHeaderCount();
  }

  subHeaderCount() {
    this.getAllDatas.forEach((value1: any) => {
      if (value1 && value1.values) {
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
            if (subHeader.selected) {
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
            }
          });
        });
      }
      // filledCount
      if (value1 && value1.values) {
        const filledCountDetails = value1.values.filter((a1: any) => {
          return a1.completed === true;
        });
        value1.filledCount =
          filledCountDetails && filledCountDetails.length > 0
            ? filledCountDetails.length
            : 0;
      }
    });
    this.getAllDatas.forEach((ids: any) => {
      if (ids && ids.values) {
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
      }
    });
    this.BudgetService.setPiqQuestionData(this.dynamicForms.value)
    
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
      this.exceptionCount();
    }
  }

  exceptionDateFn(ques: any, mquest: any, quest: any) {
    if (quest && quest.type === 'Date') {
      quest.answer = this.datePipe.transform(quest.answer, 'dd-MMM-yyyy');

      const duplicateResponse = this.exceptionList.find(
        (x) => x.qid === quest.qid
      );
      if (duplicateResponse === undefined) {
        this.exception(ques, mquest, quest);
      } else {
        duplicateResponse.answer = quest.answer;
      }
      this.exceptionCount();
    } else if (quest && quest.type === 'Select') {
      const duplicateResponse = this.exceptionList.find(
        (x) => x.qid === quest.qid
      );
      if (duplicateResponse === undefined) {
        this.exception(ques, mquest, quest);
      } else {
        duplicateResponse.answer = quest.answer;
      }
      this.exceptionCount();
    }
  }

  scrollToElement(elementId: string): void {
    const element = document.getElementById(`${elementId}`);
    if (element && element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  isOptionSelected(selecVal: any, answer: any): boolean {
    return answer.includes(selecVal);
  }

  toggleMultiSelection(
    controlname: any,
    value: any,
    mquest: any,
    entryorgin: any,
    subq: any,
    quest: any
  ) {
    quest.lastModified = this.datePipe.transform(
      new Date(),
      'dd-MMM-yyyy HH:mm'
    );
    if (Array.isArray(entryorgin.answer)) {
      if (entryorgin.answer.includes(value)) {
        entryorgin.answer = entryorgin.answer.filter(
          (item: any) => item !== value
        );
        this.dynamicForms.controls[controlname].setValue(entryorgin.answer);
      }
      // else {
      //   entryorgin.answer.push(value);
      //   const ans = entryorgin.answer;
      //   this.dynamicForms.controls[controlname].setValue(entryorgin.answer);
      // }
    } else {
      entryorgin.answer = [value];
      this.dynamicForms.controls[controlname].setValue(entryorgin.answer);
    }

    if (entryorgin.answer.length > 0) {
      entryorgin.inprogress = false;
      entryorgin.completed = true;
    } else {
      entryorgin.inprogress = true;
      entryorgin.completed = false;
    }
    this.selectedValue = quest.subHeaders;

    this.subHeaderCount();
    this.chapterGrid();
    if (subq && subq.presetvalue === subq.answer) {
      this.restoreOriginal(subq);
    } else {
      this.exceptionFn(subq, mquest, quest);
    }
  }
  onFilterChanged() {
    this.totalRowCount = this.gridApi.getDisplayedRowCount();
  }
  toggleSingleSelection(
    value: string,
    ques: any,
    mainQue: any,
    subQue: any
  ): void {
    ques.lastModified = this.datePipe.transform(
      new Date(),
      'dd-MMM-yyyy HH:mm'
    );
    const mQuestion = mainQue.mainQuestion;
    const str = mQuestion.split(' ');
    let questionId = '';
    if (str && str.length > 0) {
      if (str[0].endsWith('.')) {
        const stringWithoutLastDot = str[0].slice(0, -1);
        str[0] = stringWithoutLastDot;
      }
      questionId = str[0];
    }
    if (questionId === '2.8.2') {
      this.getPscDetail(questionId, ques, mainQue, subQue);
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
        'dd-MMM-yyyy HH:mm'
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
    if (subQue && subQue.presetvalue === subQue.answer) {
      this.restoreOriginal(subQue);
    } else {
      this.exceptionFn(ques, mainQue, subQue);
    }
    this.dynamicForms.controls[subQue.qid].setValue(value);
    this.subHeaderCount();
    this.chapterGrid();
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

    this.exceptionCount();
  }

  resetDate(event: any, subq: any, quest: any, mquest: any) {
    var getresetID = event.target.id;
    var getId = subq.qid;
    const areIdsEqual = getresetID === getId;
    if (areIdsEqual == true) {
      this.dynamicForms.controls[subq.qid].setValue('');
      subq.answer = '';
      subq.completed = false;
      mquest.selected = false;
    }

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
    // this.subHeaderCount();
    this.chapterGrid();
    this.subHeaderCount();
  }

  restoreOriginal(subq: any) {
    const objWithIdIndex = this.exceptionList.findIndex(
      (obj) => obj.qid === subq.qid
    );
    if (objWithIdIndex > -1) {
      this.exceptionList.splice(objWithIdIndex, 1);
      this.exceptionCount();
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

  restoreLookUp(subq: any) {
    const objWithIdIndex = this.exceptionList.findIndex(
      (obj) => obj.qid === subq.qid
    );
    if (objWithIdIndex > -1) {
      this.exceptionList.splice(objWithIdIndex, 1);
      this.exceptionCount();
    }
    subq.answer = '';
    if (subq.answer) {
      subq.inprogress = false;
      subq.completed = true;
    } else {
      subq.inprogress = true;
      subq.completed = false;
    }
    this.subHeaderCount();
  }
  expandAllMainquestions(event: any, quest: any, index: any) {
    quest['expand' + index] = !quest['expand' + index];
  }

  openLookUp(event: any, quest: any, mainQuest?: any) {
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
      questionId = str[0];
    }
    if (quest && quest.subheadid === 'SH1') {
      this.manualLookUp(dialogConfig);
    } else if (quest && quest.subheadid === 'SH29') {
      this.mocLookUp(quest, questionId);
    } else if (quest && quest.subheadid === 'SH2') {
      this.lookUpDialog(mainQuest, questionId);
    } else if (
      mainQuest &&
      (mainQuest.qid === 'MQ26' ||
        mainQuest.qid === 'MQ29' ||
        mainQuest.qid === 'MQ32')
    ) {
      this.pmsLookup(mainQuest, questionId);
    } else if (quest && quest.subheadid === 'SH32') {
      this.pscLookUp(dialogConfig, quest, mainQuest, questionId);
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
      this.tmsaLookUp(mainQuest, questionId);
    } else if (quest && quest.subheadid === 'SH14') {
      const dialogRef = this.dialog.open(SafetyManagementComponent, {
        panelClass: 'sm-dialog-container',
        data: {
          qid: '5.7.2',
          questionId: questionId,
          referenceId: this.referenceNumber,
        },
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result !== 'Reset') {
          this.lookupReset(questionId, '', result);
          const rowKeys = [
            'MQ337',
            'MQ343',
            'MQ349',
            'MQ355',
            'MQ361',
            'MQ367',
            'MQ373',
            'MQ379',
            'MQ385',
            'MQ391',
            'MQ397',
            'MQ403',
            'MQ409',
            'MQ415',
            'MQ421',
            'MQ427',
            'MQ433',
            'MQ439',
            'MQ445',
            'MQ451',
            'MQ457',
            'MQ463',
            'MQ469',
            'MQ475',
            'MQ481',
            'MQ487',
            'MQ493',
            'MQ499',
            'MQ505',
          ];
          let insertQuest: any;
          this.arrayObj = [];
          let tempRowData: any[] = [];
          let modifiedSubQuestion: any;
          rowKeys.forEach((row) => {
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
                              duplicatePayload.qid = row;
                              duplicatePayload.ivrid = ivrid;
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
                                const valuesToCheckDD = [
                                  'Q341',
                                  'Q347',
                                  'Q353',
                                  'Q359',
                                  'Q365',
                                  'Q371',
                                  'Q377',
                                  'Q383',
                                  'Q389',
                                  'Q395',
                                  'Q401',
                                  'Q407',
                                  'Q413',
                                  'Q419',
                                  'Q425',
                                  'Q431',
                                  'Q437',
                                  'Q443',
                                  'Q449',
                                  'Q455',
                                  'Q461',
                                  'Q467',
                                  'Q473',
                                  'Q479',
                                  'Q485',
                                  'Q491',
                                  'Q497',
                                  'Q503',
                                  'Q509',
                                ];

                                if (
                                  valuesToCheckDD.some((value) =>
                                    temp.qid.includes(value)
                                  )
                                ) {
                                  this.dynamicForms.controls[
                                    `${temp.qid}`
                                  ].patchValue(resultResponse.dropdown);
                                }
                                const valuesToCheckDate = [
                                  'Q342',
                                  'Q348',
                                  'Q354',
                                  'Q360',
                                  'Q366',
                                  'Q372',
                                  'Q378',
                                  'Q384',
                                  'Q390',
                                  'Q396',
                                  'Q402',
                                  'Q408',
                                  'Q414',
                                  'Q420',
                                  'Q426',
                                  'Q432',
                                  'Q438',
                                  'Q444',
                                  'Q450',
                                  'Q456',
                                  'Q462',
                                  'Q468',
                                  'Q474',
                                  'Q480',
                                  'Q486',
                                  'Q492',
                                  'Q498',
                                  'Q504',
                                  'Q510',
                                ];

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
                                }
                              });
                            }
                          }
                        });
                      }
                    });
                  }
                }
              });
            });

            tempRowData = [];
          });
        } else if (result === 'Reset') {
          this.lookupReset(questionId, 'Reset', '');
        }
      });
    }

    event.preventDefault();
    event.stopPropagation();
  }

  manualLookUp(dialogConfig: any) {
    this.dialog.open(ManualLookUpComponent, dialogConfig);
  }

  mocLookUp(quest: any, questionId: any) {
    const mocDialog = this.dialog.open(MocComponent, {
      panelClass: 'moc-dialog-container',
      data: {
        questionId: questionId,
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
        this.lookupReset(questionId, '', payloadDetails);
        quest.question.forEach((Mquest: any) => {
          Mquest.subQuestion.forEach((response: any) => {
            if (response && response.type === 'Select') {
              result.data.forEach((result: any) => {
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
          });
        });
      }
    });
  }

  lookUpDialog(mainQuest: any, questionId: any) {
    const dialogRef = this.dialog.open(LookupDialogComponent, {
      panelClass: 'lookUp-dialog-container',
      data: {
        qid: mainQuest.qid,
        questionId: questionId,
        referenceId: this.referenceNumber,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result !== 'Reset') {
        this.lookupReset(questionId, result.refno, '');
        const timeDifference = result.auditfromdate
          ? new Date(result.audittodate).getTime() -
            new Date(result.auditfromdate).getTime()
          : new Date(result.actualtodate).getTime() -
            new Date(result.actualfromdate).getTime();

        const dateCount = timeDifference
          ? Math.floor(timeDifference / (1000 * 3600 * 24))
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
              Q8: new Date(result.actualfromdate),
              Q9: new Date(result.actualtodate),
              Q10: dateCount,
            });
          } else if (mainQuest && mainQuest.qid === 'MQ20') {
            this.dynamicForms.patchValue({
              Q22: result.auditfromdate
                ? new Date(result.auditfromdate)
                : new Date(result.actualfromdate),
              Q23: result.audittodate
                ? new Date(result.audittodate)
                : new Date(result.actualtodate),
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
                if (response.answer) {
                  response.inprogress = false;
                  response.completed = true;
                } else {
                  response.inprogress = true;
                  response.completed = false;
                }
              });
            }
          }
        }
      } else if (result === 'Reset') {
        this.lookupReset(questionId, 'Reset', '');
      }
    });
  }

  pmsLookup(mainQuest: any, questionId: any) {
    const dialogRef = this.dialog.open(PmsLookupComponent, {
      panelClass: 'pmsLookUp-dialog-container',
      data: {
        moduleName:
          mainQuest && mainQuest.qid === 'MQ26'
            ? 'Cargo Tanks'
            : mainQuest.qid === 'MQ29'
            ? 'Ballast Tanks'
            : 'Void Spaces',
        qid: mainQuest.qid,
        questionId: questionId,
        referenceId: this.referenceNumber,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      const lookUp = result !== 'Reset' ? result.jobid : 'Reset';
      this.lookupReset(questionId, lookUp, '');
    });
  }
  pscLookUp(dialogConfig: any, quest: any, mainQuest: any, questionId: any) {
    const dialogRef = this.dialog.open(PscComponent, {
      panelClass: 'psc-dialog-container',
      data: {
        qid: mainQuest.qid,
        questionId: questionId,
        referenceId: this.referenceNumber,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result !== 'Reset') {
        this.lookupReset(questionId, result.extrfid, '');

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
              this.restoreLookUp(response);
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
      } else if (result === 'Reset') {
        this.lookupReset(questionId, 'Reset', '');
      }
    });
  }

  tmsaLookUp(mainQuest: any, questionId: any) {
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
      if (result !== 'Reset') {
        if (mainQuest && mainQuest.qid === 'MQ115') {
          this.mq115LookUp(mainQuest, result, questionId);
        } else if (mainQuest && mainQuest.qid === 'MQ97') {
          this.mq97LookUp(mainQuest, result, questionId);
        } else if (mainQuest && mainQuest.qid === 'MQ100') {
          this.mq100LookUp(mainQuest, result, questionId);
        } else if (mainQuest && mainQuest.qid === 'MQ105') {
          this.mq105LookUp(mainQuest, result, questionId);
        } else if (mainQuest && mainQuest.qid === 'MQ111') {
          this.mq111LookUp(mainQuest, result, questionId);
        } else if (mainQuest && mainQuest.qid === 'MQ120') {
          this.mq120LookUp(mainQuest, result, questionId);
        } else if (mainQuest && mainQuest.qid === 'MQ125') {
          this.mq125LookUp(mainQuest, result, questionId);
        }
      } else if (result === 'Reset') {
        this.lookupReset(questionId, 'Reset', '');
      }
    });
  }

  mq115LookUp(mainQuest: any, result: any, questionId: any) {
    this.lookupReset(questionId, result.refno, '');
    if (result && result.hasOwnProperty('auditfromdate')) {
      this.dynamicForms.patchValue({
        Q117: result.auditfromdate,
        Q118: result.audittodate,
      });

      mainQuest.subQuestion.forEach((response: any) => {
        this.restoreLookUp(response);
        if (response && response.qid === 'Q117') {
          response.answer = result.auditfromdate;
        } else if (response && response.qid === 'Q118') {
          response.answer = result.audittodate;
        }
        if (response.answer) {
          response.inprogress = false;
          response.completed = true;
        } else {
          response.inprogress = true;
          response.completed = false;
        }
      });
    } else if (result && result.hasOwnProperty('actualfromdate')) {
      this.dynamicForms.patchValue({
        Q117: result.actualfromdate,
        Q118: result.actualtodate,
      });
      mainQuest.subQuestion.forEach((response: any) => {
        this.restoreLookUp(response);
        if (response && response.qid === 'Q117') {
          response.answer = result.actualfromdate;
        } else if (response && response.qid === 'Q118') {
          response.answer = result.actualtodate;
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
  }

  mq97LookUp(mainQuest: any, result: any, questionId: any) {
    this.lookupReset(questionId, result.refno, '');
    if (result && result.hasOwnProperty('actualfromdate')) {
      this.dynamicForms.patchValue({
        Q99: result.actualfromdate,
      });
      mainQuest.subQuestion.forEach((response: any) => {
        this.restoreLookUp(response);
        if (response && response.qid === 'Q99') {
          response.answer = result.actualfromdate;
        }
        if (response.answer) {
          response.inprogress = false;
          response.completed = true;
        } else {
          response.inprogress = true;
          response.completed = false;
        }
      });
    } else {
      this.dynamicForms.patchValue({
        Q99: result.auditfromdate,
      });
      mainQuest.subQuestion.forEach((response: any) => {
        this.restoreLookUp(response);
        if (response && response.qid === 'Q99') {
          response.answer = result.auditfromdate;
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
  }

  mq100LookUp(mainQuest: any, result: any, questionId: any) {
    this.lookupReset(questionId, result.refno, '');

    if (result && result.hasOwnProperty('actualfromdate')) {
      const timeDifference =
        new Date(result.actualtodate).getTime() -
        new Date(result.actualfromdate).getTime();
      const dateCount = Math.floor(timeDifference / (1000 * 3600 * 24));
      this.dynamicForms.patchValue({
        Q101: result.actualfromdate,
        Q102: result.actualtodate,
        Q103: dateCount,
      });
      if (mainQuest && mainQuest.qid === 'MQ100') {
        mainQuest.subQuestion.forEach((response: any) => {
          this.restoreLookUp(response);
          if (response && response.qid === 'Q101') {
            response.answer = result.actualfromdate;
          } else if (response && response.qid === 'Q102') {
            response.answer = result.actualtodate;
          } else if (response && response.qid === 'Q103') {
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
    } else if (result.hasOwnProperty('auditfromdate')) {
      const timeDifference =
        new Date(result.audittodate).getTime() -
        new Date(result.auditfromdate).getTime();
      const dateCount = Math.floor(timeDifference / (1000 * 3600 * 24));
      this.dynamicForms.patchValue({
        Q101: result.auditfromdate,
        Q102: result.audittodate,
        Q103: dateCount,
      });
      if (mainQuest && mainQuest.qid === 'MQ100') {
        mainQuest.subQuestion.forEach((response: any) => {
          this.restoreLookUp(response);
          if (response && response.qid === 'Q101') {
            response.answer = result.auditfromdate;
          } else if (response && response.qid === 'Q102') {
            response.answer = result.audittodate;
          } else if (response && response.qid === 'Q103') {
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
    }
  }

  mq105LookUp(mainQuest: any, result: any, questionId: any) {
    if (result && result.hasOwnProperty('actualfromdate')) {
      this.lookupReset(questionId, result.refno, '');

      const timeDifference =
        new Date(result.actualtodate).getTime() -
        new Date(result.actualfromdate).getTime();
      const dateCount = Math.floor(timeDifference / (1000 * 3600 * 24));
      this.dynamicForms.patchValue({
        Q107: result.actualfromdate,
        Q108: result.actualtodate,
        Q109: dateCount,
      });
      mainQuest.subQuestion.forEach((response: any) => {
        this.restoreLookUp(response);
        if (response && response.qid === 'Q107') {
          response.answer = result.actualfromdate;
        } else if (response && response.qid === 'Q108') {
          response.answer = result.actualtodate;
        } else if (response && response.qid === 'Q109') {
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
    } else if (result.hasOwnProperty('auditfromdate')) {
      this.lookupReset(questionId, result.extrfid, '');

      const timeDifference =
        new Date(result.audittodate).getTime() -
        new Date(result.auditfromdate).getTime();
      const dateCount = Math.floor(timeDifference / (1000 * 3600 * 24));
      this.dynamicForms.patchValue({
        Q107: result.auditfromdate,
        Q108: result.audittodate,
        Q109: dateCount,
      });
      mainQuest.subQuestion.forEach((response: any) => {
        this.restoreLookUp(response);
        if (response && response.qid === 'Q107') {
          response.answer = result.auditfromdate;
        } else if (response && response.qid === 'Q108') {
          response.answer = result.audittodate;
        } else if (response && response.qid === 'Q109') {
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
  }

  mq111LookUp(mainQuest: any, result: any, questionId: any) {
    this.lookupReset(questionId, result.refno, '');

    if (result && result.hasOwnProperty('actualfromdate')) {
      this.dynamicForms.patchValue({
        Q113: result.actualfromdate,
      });
      mainQuest.subQuestion.forEach((response: any) => {
        this.restoreLookUp(response);
        if (response && response.qid === 'Q113') {
          response.answer = result.actualfromdate;
        }
        if (response.answer) {
          response.inprogress = false;
          response.completed = true;
        } else {
          response.inprogress = true;
          response.completed = false;
        }
      });
    } else if (result.hasOwnProperty('auditfromdate')) {
      this.dynamicForms.patchValue({
        Q113: result.auditfromdate,
      });
      mainQuest.subQuestion.forEach((response: any) => {
        this.restoreLookUp(response);
        if (response && response.qid === 'Q113') {
          response.answer = result.auditfromdate;
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
  }

  mq120LookUp(mainQuest: any, result: any, questionId: any) {
    this.lookupReset(questionId, result.refno, '');
    if (result && result.hasOwnProperty('actualfromdate')) {
      this.dynamicForms.patchValue({
        Q122: result.actualfromdate,
        Q123: result.actualtodate,
      });
      mainQuest.subQuestion.forEach((response: any) => {
        this.restoreLookUp(response);
        if (response && response.qid === 'Q122') {
          response.answer = result.actualfromdate;
        } else if (response && response.qid === 'Q123') {
          response.answer = result.actualtodate;
        }
        if (response.answer) {
          response.inprogress = false;
          response.completed = true;
        } else {
          response.inprogress = true;
          response.completed = false;
        }
      });
    } else if (result && result.hasOwnProperty('auditfromdate')) {
      this.dynamicForms.patchValue({
        Q122: result.auditfromdate,
        Q123: result.audittodate,
      });
      mainQuest.subQuestion.forEach((response: any) => {
        this.restoreLookUp(response);
        if (response && response.qid === 'Q122') {
          response.answer = result.auditfromdate;
        } else if (response && response.qid === 'Q123') {
          response.answer = result.audittodate;
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
  }

  mq125LookUp(mainQuest: any, result: any, questionId: any) {
    this.lookupReset(questionId, result.refno, '');
    if (result && result.hasOwnProperty('actualfromdate')) {
      this.dynamicForms.patchValue({
        Q127: result.actualfromdate,
        Q128: result.actualtodate,
      });
      mainQuest.subQuestion.forEach((response: any) => {
        this.restoreLookUp(response);
        if (response && response.qid === 'Q127') {
          response.answer = result.actualfromdate;
        } else if (response && response.qid === 'Q128') {
          response.answer = result.actualtodate;
        }
        if (response.answer) {
          response.inprogress = false;
          response.completed = true;
        } else {
          response.inprogress = true;
          response.completed = false;
        }
      });
    } else if (result && result.hasOwnProperty('auditfromdate')) {
      this.dynamicForms.patchValue({
        Q127: result.auditfromdate,
        Q128: result.audittodate,
      });
      mainQuest.subQuestion.forEach((response: any) => {
        this.restoreLookUp(response);
        if (response && response.qid === 'Q127') {
          response.answer = result.auditfromdate;
        } else if (response && response.qid === 'Q128') {
          response.answer = result.audittodate;
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
      let time: any;
      if (data && data.values) {
        data.values.forEach((filledQus: any, index: any) => {
          if (!(filledQus && filledQus.lastModified)) {
            filledQus.lastModified = '';
          }

          if (
            data &&
            data.values &&
            data.values[index] &&
            data.values[index].lastModified
          ) {
            time = Math.max(
              new Date(data.values[index].lastModified).getTime()
            );
          }

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
        // serialNumber: data.id,
        topics: data && data.header ? data.header.replace(pattern, '') : '',
        status: status,
        totalQuestion: totalQuestCount,
        filledQuestion: filledQuestionCount,
        pendingQuestion: totalQuestCount - filledQuestionCount,
        lastModified: time
          ? this.datePipe.transform(new Date(time), 'dd-MMM-yyyy HH:mm')
            ? this.datePipe.transform(new Date(time), 'dd-MMM-yyyy HH:mm')
            : ''
          : '',
      });
      this.BudgetService.setSummaryGridData(this.rowSummaryData);
    });
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
        'dd-MMM-yyyy HH:mm'
      ),
    };
    this.lastModifiedData.push(modifiedData);
    this.lastModifiedData.sort((a, b) => b.sortingDate - a.sortingDate);
    if (this.lastModifiedData.length > 5) {
      this.lastModifiedData.splice(5);
    }
  }
  inputChanges(event?: any, subq?: any, quest?: any, mquest?: any, type?: any) {
    let value =
      event && event.target && event.target.value ? event.target.value : event;
    quest.lastModified = this.datePipe.transform(
      new Date(),
      'dd-MMM-yyyy HH:mm'
    );

    subq.answer = value;
    if (subq.answer === 0 || subq.answer) {
      subq.inprogress = false;
      subq.completed = true;
    } else {
      subq.inprogress = true;
      subq.completed = false;
    }
    if (subq && subq.presetvalue === subq.answer) {
      this.restoreOriginal(subq);
    } else {
      this.exceptionFn(quest, mquest, subq);
    }

    this.selectedValue = quest.subHeaders;
    this.chapterGrid();

    this.subHeaderCount();
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
    subQues.lastModified = this.datePipe.transform(
      new Date(),
      'dd-MMM-yyyy HH:mm'
    );
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
        'dd-MMM-yyyy HH:mm'
      ),
    };

    this.lastModifiedData.push(modifiedData);
    this.lastModifiedData.sort((a, b) => b.sortingDate - a.sortingDate);
    if (this.lastModifiedData.length > 5) {
      this.lastModifiedData.splice(5);
    }
    const mQuestion = mquest.mainQuestion;
    const str = mQuestion.split(' ');
    let questionId = '';
    if (str && str.length > 0) {
      if (str[0].endsWith('.')) {
        const stringWithoutLastDot = str[0].slice(0, -1);
        str[0] = stringWithoutLastDot;
      }
      questionId = str[0];
    }
    if (questionId === '2.2.1' || questionId === '2.2.2') {
      this.getLookUpVisit(questionId, subQues, mquest, subq);
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
    }

    subq.answer = this.datePipe.transform(event.value, 'dd-MMM-yyyy');
    this.selectedValue = subQues.subHeaders;

    if (subq.answer) {
      subq.inprogress = false;
      subq.completed = true;
    } else {
      subq.inprogress = true;
      subq.completed = false;
    }
    this.subHeaderCount();
    this.chapterGrid();
    this.dateCount(mquest);
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
      subcheckbox: false,
      inprogress: false,
      completed: false,
      isshipvisit: false,
      isinternal: false,
      isexternal: false,
      ismanagment: false,
      isvslcertificate: false,
      isincident: false,
      ispms: false,
      answer: '',
    };
    const quest = {
      lastModified: '',
    };
    this.inputChanges(daysDifference, subq, quest);
    this.chapterGrid();
    this.subHeaderCount();
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
      subcheckbox: false,
      inprogress: false,
      completed: false,
      isshipvisit: false,
      isinternal: false,
      isexternal: false,
      ismanagment: false,
      isvslcertificate: false,
      isincident: false,
      ispms: false,
      answer: '',
    };
    const quest = {
      lastModified: '',
    };
    this.inputChanges(daysDifference, subq, quest);
    this.chapterGrid();
    this.subHeaderCount();
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
      subcheckbox: false,
      inprogress: false,
      completed: false,
      isshipvisit: false,
      isinternal: false,
      isexternal: false,
      ismanagment: false,
      isvslcertificate: false,
      isincident: false,
      ispms: false,
      answer: '',
    };
    const quest = {
      lastModified: '',
    };
    this.inputChanges(daysDifference, subq, quest);
    this.chapterGrid();
    this.subHeaderCount();
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
      subcheckbox: false,
      inprogress: false,
      completed: false,
      isshipvisit: false,
      isinternal: false,
      isexternal: false,
      ismanagment: false,
      isvslcertificate: false,
      isincident: false,
      ispms: false,
      answer: '',
    };
    const quest = {
      lastModified: '',
    };
    this.inputChanges(daysDifference, subq, quest);
    this.chapterGrid();
    this.subHeaderCount();
  }
  getLookUpVisit(questionId: any, subQues: any, mquest: any, subq: any) {
    // this.isLoader = true;
    const vesselCode = localStorage.getItem('masterVesselCode');
    this.BudgetService.getLookupVisitData(
      vesselCode,
      this.referenceNumber,
      questionId
    ).subscribe((data) => {
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
                'dd-MMM-yyyy HH:mm'
              )
            : '';
          const toDate = this.dynamicForms.value.Q9
            ? this.datePipe.transform(
                new Date(this.dynamicForms.value.Q9),
                'dd-MMM-yyyy HH:mm'
              )
            : '';
          const lookUpFromDate = findLookUpDate.plannedfromdate
            ? this.datePipe.transform(
                new Date(findLookUpDate.plannedfromdate),
                'dd-MMM-yyyy HH:mm'
              )
            : '';
          const lookUpToDate = findLookUpDate.plannedtodate
            ? this.datePipe.transform(
                new Date(findLookUpDate.plannedtodate),
                'dd-MMM-yyyy HH:mm'
              )
            : '';

          if (!(fromDate === lookUpFromDate && toDate === lookUpToDate)) {
            this.exceptionDateFn(subQues, mquest, subq);
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
                'dd-MMM-yyyy HH:mm'
              )
            : '';
          const toDate = this.dynamicForms.value.Q23
            ? this.datePipe.transform(
                new Date(this.dynamicForms.value.Q23),
                'dd-MMM-yyyy HH:mm'
              )
            : '';
          const lookUpFromDate = lookUpShipDate.actualfromdate
            ? this.datePipe.transform(
                new Date(lookUpShipDate.actualfromdate),
                'dd-MMM-yyyy HH:mm'
              )
            : '';
          const lookUpToDate = lookUpShipDate.actualtodate
            ? this.datePipe.transform(
                new Date(lookUpShipDate.actualtodate),
                'dd-MMM-yyyy HH:mm'
              )
            : '';

          if (!(fromDate === lookUpFromDate && toDate === lookUpToDate)) {
            this.exceptionDateFn(subQues, mquest, subq);
          }
        }

        if (lookUpInternDate) {
          const fromDate = this.dynamicForms.value.Q22
            ? this.datePipe.transform(
                new Date(this.dynamicForms.value.Q22),
                'dd-MMM-yyyy HH:mm'
              )
            : '';
          const toDate = this.dynamicForms.value.Q23
            ? this.datePipe.transform(
                new Date(this.dynamicForms.value.Q23),
                'dd-MMM-yyyy HH:mm'
              )
            : '';
          const lookUpFromDate = lookUpInternDate.auditfromdate
            ? this.datePipe.transform(
                new Date(lookUpInternDate.auditfromdate),
                'dd-MMM-yyyy HH:mm'
              )
            : '';
          const lookUpToDate = lookUpInternDate.audittodate
            ? this.datePipe.transform(
                new Date(lookUpInternDate.audittodate),
                'dd-MMM-yyyy HH:mm'
              )
            : '';

          if (!(fromDate === lookUpFromDate && toDate === lookUpToDate)) {
            this.exceptionDateFn(subQues, mquest, subq);
          }
        }
      }
    });
  }

  getPscDetail(questionId: any, subQues: any, mquest: any, subq: any) {
    // this.isLoader = true;
    const vesselCode = localStorage.getItem('masterVesselCode');
    this.BudgetService.getPscDetails(
      vesselCode,
      this.referenceNumber,
      questionId
    ).subscribe((data) => {
      if (questionId === '2.8.2') {
        let lookUpPSCDate: any;
        let lookUpNonPSCDate: any;
        if (data && data.response) {
          lookUpPSCDate = data.response['Non-sPSC'].find((x: any) => x.highlight);
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
                'dd-MMM-yyyy HH:mm'
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
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
            lookUpQ155 = 'Yes';
            lookUpQ158 = lookUpPSCDate.authoritycode;
            lookUpQ160 = lookUpPSCDate.isnon_nc_def_obs === 'N' ? 'No' : 'Yes';
            lookUpQ161 = lookUpPSCDate.deficiencycount === '1' ? 'Yes' : 'No';
          } else {
            lookUpFromDate = lookUpNonPSCDate.q156
              ? this.datePipe.transform(
                  new Date(lookUpNonPSCDate.q156),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
            lookUpQ155 = 'Yes';
            lookUpQ158 = lookUpNonPSCDate.authoritycode;
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
            if (
              fromDate !== '' &&
              q155Field !== '' &&
              q158Field !== '' &&
              q160Field !== '' &&
              q161Field !== ''
            ) {
              this.exceptionDateFn(subQues, mquest, subq);
            }
          }
        }
      }
    });
  }

  getTmsaDetail(questionId: any, subQues: any, mquest: any, subq: any) {
    const vesselCode = localStorage.getItem('masterVesselCode');
    this.BudgetService.getLookupDetail(
      questionId,
      vesselCode,
      questionId,
      this.referenceNumber
    ).subscribe((data) => {
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
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
          } else if (questionId === '3.2.2') {
            fromDate = this.dynamicForms.value.Q101
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q101),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
            toDate = this.dynamicForms.value.Q102
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q102),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
          } else if (questionId === '3.2.5') {
            fromDate = this.dynamicForms.value.Q117
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q117),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
            toDate = this.dynamicForms.value.Q118
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q118),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
          } else if (questionId === '3.2.6') {
            fromDate = this.dynamicForms.value.Q122
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q122),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
            toDate = this.dynamicForms.value.Q123
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q123),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
          } else if (questionId === '3.2.7') {
            fromDate = this.dynamicForms.value.Q127
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q127),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
            toDate = this.dynamicForms.value.Q128
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q128),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
          }
        }

        if (questionId === '3.2.1') {
          if (lookUpInternalDate && lookUpInternalDate.auditfromdate) {
            lookUpFromDate = lookUpInternalDate.auditfromdate
              ? this.datePipe.transform(
                  new Date(lookUpInternalDate.auditfromdate),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
          } else if (
            lookUpShipVisitDate &&
            lookUpShipVisitDate.actualfromdate
          ) {
            lookUpFromDate = lookUpShipVisitDate.actualfromdate
              ? this.datePipe.transform(
                  new Date(lookUpShipVisitDate.actualfromdate),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
          }
          if (!(lookUpFromDate === fromDate)) {
            if (fromDate !== '') {
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
            lookUpFromDate = lookUpInternalDate.auditfromdate
              ? this.datePipe.transform(
                  new Date(lookUpInternalDate.auditfromdate),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
            lookUpToDate = lookUpInternalDate.audittodate
              ? this.datePipe.transform(
                  new Date(lookUpInternalDate.audittodate),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
          } else {
            lookUpFromDate = lookUpShipVisitDate.actualfromdate
              ? this.datePipe.transform(
                  new Date(lookUpShipVisitDate.actualfromdate),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
            lookUpToDate = lookUpShipVisitDate.actualtodate
              ? this.datePipe.transform(
                  new Date(lookUpShipVisitDate.actualtodate),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
          }

          if (!(lookUpFromDate === fromDate && lookUpToDate === toDate)) {
            if (fromDate !== '' && toDate !== '') {
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
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
            toDate = this.dynamicForms.value.Q108
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q108),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
          } else if (questionId === '3.2.4') {
            fromDate = this.dynamicForms.value.Q113
              ? this.datePipe.transform(
                  new Date(this.dynamicForms.value.Q113),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
          }
        }
        if (questionId === '3.2.3') {
          if (lookUpInternalDate) {
            lookUpFromDate = lookUpInternalDate.auditfromdate
              ? this.datePipe.transform(
                  new Date(lookUpInternalDate.auditfromdate),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
            lookUpToDate = lookUpInternalDate.audittodate
              ? this.datePipe.transform(
                  new Date(lookUpInternalDate.audittodate),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
          } else {
            lookUpFromDate = lookUpShipVisitDate.actualfromdate
              ? this.datePipe.transform(
                  new Date(lookUpShipVisitDate.actualfromdate),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
            lookUpToDate = lookUpShipVisitDate.actualtodate
              ? this.datePipe.transform(
                  new Date(lookUpShipVisitDate.actualtodate),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
          }

          if (!(lookUpFromDate === fromDate && lookUpToDate === toDate)) {
            if (fromDate !== '' && toDate !== '') {
              this.exceptionDateFn(subQues, mquest, subq);
            }
          }
        } else if (questionId === '3.2.4') {
          if (lookUpInternalDate) {
            lookUpFromDate = lookUpInternalDate.auditfromdate
              ? this.datePipe.transform(
                  new Date(lookUpInternalDate.auditfromdate),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
          } else {
            lookUpFromDate = lookUpShipVisitDate.actualfromdate
              ? this.datePipe.transform(
                  new Date(lookUpShipVisitDate.actualfromdate),
                  'dd-MMM-yyyy HH:mm'
                )
              : '';
          }

          if (!(lookUpFromDate === fromDate)) {
            if (fromDate !== '') {
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

  openOriginalQuest(
    mQuest: any,
    allValues: any,
    mQuestIndex: any,
    question: any
  ) {
    this.selectValue(allValues.subHeaders, allValues);
    setTimeout(() => {
      this.scrollToElement(question.qid);
    }, 100);
    this.isSearchActive = false;
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
        this.lookUpEnable = false;
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
            this.getStatus == 'Submitted' &&
            this.getApproveRank != this.userDetails?.rankCode) ||
          (this.getOrigination == 'CNT002' &&
            this.getStatus != 'Inprogress' &&
            this.getApproveRank != this.userDetails?.rankCode) ||
          (this.getOrigination == 'CNT001' && this.getStatus == 'Approved') ||
          (this.getOrigination == 'CNT002' &&
            (this.getStatus == 'ReAssigned' || this.getStatus == 'Approved'))
        ) {
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
          this.BudgetService.setEnableBtn(disableFields);
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
    localStorage.removeItem('getSelectedCheckListID')
    this.BudgetService.setEditVisible(false);
    localStorage.setItem('setEditVisible', 'false');
    this.router.navigate(['/sire/piq-landing/']);
 
  }
  disableBtn = false;
  edit() {
    if (this.route.snapshot.paramMap.get('type') == 'view') {
      this.BudgetService.setEnableBtn(this.disableBtn);
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
      this.BudgetService.setEnableBtn(this.disableBtn);
    }
  }

  showpendQues() {
    this.showPendingQuest = true;
    this.AllQuestions = false;
  }

  ShowAllQuest() {
    this.AllQuestions = true;
    this.showPendingQuest = false;
  }

  onTabChanged(event: any) {
    this.BudgetService.getTabChangeData().subscribe((res: any) => {
      this.tabGroup.selectedIndex = res;
    });
    if (event && event.index === 0) {
      this.BudgetService.setRemarksCountData(this.getExceptionGridData);
    }
  }

  lookupReset(questionId: any, lookup: any, payloadDetails: any) {
    this.isLoader = true;
    const payload = {
      instanceid: this.referenceNumber,
      questionid: questionId,
      lookupid: lookup,
      lookupjson: payloadDetails,
      user: this.userDetails?.userCode,
    };
    this.BudgetService.saveLookUp(payload).subscribe((data) => {
      this.isLoader = false;
    });
  }
}
