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

@Component({
  selector: 'app-piqsummary',
  templateUrl: './piqsummary.component.html',
  styleUrls: ['./piqsummary.component.css'],
  providers: [DatePipe]
})
export class PIQSummaryComponent implements OnInit {
  @Input() getAllData: any;
  @Input() pendingQuestCount: any;
  @Input() totalQuestCount: any;
  @Input() presetQuestCounts: any;
  quickNotesInput = '';
  photoData: any = [
    {
      subTopics: [
        {
          subID: 'sub1',
          subTopicTitle: 'Bow area from dead ahead',
          relImages: [{}],
          photoAvailable: 'Yes',
          isNotMatching: 'Yes',
        },
        {
          subID: 'sub2',
          subTopicTitle: 'Hull forward end starboard side',
          relImages: [{}],
          photoAvailable: 'Yes',
          isNotMatching: 'No',
        },
        {
          subID: 'sub3',
          subTopicTitle: 'Hull forward end port side',
          relImages: [{}],
          photoAvailable: 'Yes',
          isNotMatching: 'Yes',
        },
        {
          subID: 'sub4',
          subTopicTitle: 'Hull aft end starboard side',
          relImages: [{}],
          photoAvailable: 'Yes',
          isNotMatching: 'Yes',
        },
        {
          subID: 'sub5',
          subTopicTitle: 'Hull aft end port side',
          relImages: [{}],
          photoAvailable: 'Yes',
          isNotMatching: 'Yes',
        },
        {
          subID: 'sub6',
          subTopicTitle: 'Forecastle port side looking towards fairleads',
          relImages: [{}],
          photoAvailable: 'Yes',
          isNotMatching: 'Yes',
        },
        {
          subID: 'sub7',
          subTopicTitle: 'Forecastle starboard side looking towards fairleads',
          relImages: [{}],
          photoAvailable: 'Yes',
          isNotMatching: 'Yes',
        },
      ],
      mID: 'PR1',
      topic: 'Core Photograph set',
    },
    {
      subTopics: [
        {
          subID: 'sub8',
          subTopicTitle: '',
          photoAvailable: 'Yes',
          isNotMatching: 'Yes',
        },
      ],
      mID: 'PR2',
      topic: 'Crude/ Product/ Chemical tankers/ OBO',
    },
    {
      subTopics: [
        {
          subID: 'sub9',
          subTopicTitle: '',
          relImages: [{}],
          photoAvailable: 'Yes',
          isNotMatching: 'Yes',
        },
      ],
      mID: 'PR3',
      topic: 'LPG Pressurised',
    },
    {
      subTopics: [
        {
          subID: 'sub10',
          subTopicTitle: '',
          relImages: [{}],
          photoAvailable: 'Yes',
          isNotMatching: 'Yes',
        },
      ],
      mID: 'PR4',
      topic: 'LPG refrigerated',
    },
    {
      subTopics: [
        {
          subID: 'sub11',
          subTopicTitle: '',
          relImages: [{}],
          photoAvailable: 'Yes',
          isNotMatching: 'Yes',
        },
      ],
      mID: 'PR5',
      topic: 'LNG Membrane type',
    },
  ];
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
  };
  public gridOptions: GridOptions = {
  };
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
    { field: 'subTopicTitle', headerName: 'Sub Topic Title' },
    { field: 'photoAvailable', headerName: 'Photo Available' },
    { field: 'isNotMatching', headerName: 'Is Not Matching' },
  ];
  
  expectedColumnDefs: ColDef[] = [
    { field: 'userName', headerName: 'User Name' },
    { field: 'userType', headerName: 'User Type' },
    { field: 'modifiedDateTime', headerName: 'Last Update' },
    // { field: 'mainQuestion', headerName: 'Question' },
    // { field: 'answer', headerName: 'Pre-set Value', width: 95 },
    // { field: 'selectedAnswer', headerName: 'User Selected Value', width: 95 },
    // { field: 'isNotMatching', headerName: 'Last Update', width: 90 },
  ];

  modifiedColumns: ColDef[] = [
    { field: 'mainQuestion', headerName: 'Main Question' },
    { field: 'subQuestion', headerName: 'Sub Question' },
    { field: 'userName', headerName: 'User Name' },
    // { field: 'userType', headerName: 'User Type' },
    // { field: 'header', headerName: 'Topic' },
    // { field: 'answer', headerName: 'Answer' },
    { field: 'modifiedDateTime', headerName: 'Modified Date / Time' },
  ];
  certificateColumns: ColDef[] = [
    {field: 'categoryname',headerName: 'Certificate Type',},
    { field: 'certificatename', headerName: 'Certificate Name' },
    { field: 'certificateAvailable', headerName: 'Certificate Available' },
  ];

  rowData: any[] = [];
  certificateRowData:any[]=[];
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
  syncedData:any[]=[]
  expectedRowData:any[]=[]

  constructor(
    public dialog: MatDialog,
    private BudgetService: BudgetService,
    private route: ActivatedRoute,
    private _storage: StorageService,
    private _snackBarService: SnackbarService,
    private datePipe: DatePipe
  ) {
  }
  
  // getSummaryGrid() {
  //   this.BudgetService.getsummaryGridList().subscribe((res: any) => {
  //     const grid = res.response;
  //     this.rowData = grid;
      
  //   });
  // }

  
  ngOnInit(): void {
    if(this.pendingQuestCount==undefined || this.totalQuestCount==undefined){
      this.pendingQuestCount=0
      this.totalQuestCount=0
    }
    this.referenceNumber = this.route.snapshot.paramMap.get('id');
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
      this.certficateGridDatas()
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
      this.certificateCounts= res;
    })
    this.BudgetService.getMappedCertificateData().subscribe((res: any) => {
      this.mappedCertificateCounts= res;
    })
    this.BudgetService.getExceptionGridData().subscribe((res: any) => {
      this.exceptionCounts=res;
    })
    this.BudgetService.getPhotoRepData().subscribe((res: any) => {
      this.photoRepCounts=res;
    })

    this.BudgetService.getModifiedData().subscribe((res:any)=>{
      this.modifiedrowData=[];
      this.modifiedrowData = [...this.modifiedrowData, ...res];
      
    })

    
  }

  certficateGridDatas(){
    this.BudgetService.getCertificateList().subscribe((res: any) => {
      console.log("$$$",res.response.piqmappinglist)
      this.certificateRowData = res.response.piqmappinglist;
      // if (res && res.response && res.response.piqmappinglist) {
      //   res.response.piqmappinglist.forEach((data: any) => {
      //     if (data.grid === null) {
      //       data.file = [];
      //       data.grid = [];
      //     } else {
      //       if (data && data.grid) {
      //         data.file = [];
      //         let gridResponse = JSON.parse(data.grid);
      //         data.grid =
      //           gridResponse.Response === 'No data'
      //             ? []
      //             : gridResponse.Response;
      //       } else {
      //         data.grid = JSON.parse(data.grid);
      //       }
      //     }
      //   });
      // }
      // res.response.piqmappinglist.forEach((ress: any) => {
      //   if (!this.isString(ress.grid)) {
      //     ress.grid.forEach((response: any, index: any) => {
      //       if (index === 0) {
      //         (ress.certificatenumber = response.certificatenumber),
      //           (ress.certificatename = response.certificatename),
      //           (ress.dateofissue = this.datePipe.transform(
      //             response.dateofissue,
      //             'dd-MMM-yyyy'
      //           )),
      //           (ress.validfrom = this.datePipe.transform(
      //             response.validfrom,
      //             'dd-MMM-yyyy'
      //           )),
      //           (ress.validto = this.datePipe.transform(
      //             response.validto,
      //             'dd-MMM-yyyy'
      //           ));
      //       }
      //       if (response && response.imagelist && response.imagelist.lenght > 0) {
      //         response.imagelist?.forEach((item: any) => {
      //           const output_string = item.filepath.replaceAll(/\\/g, '/');
      //           (item.filesize = this.convertFileSize(item.filesize)),
      //             (item.filepath = this.dynamicImageURL + output_string);
      //           ress.file.push(item);
      //         });
      //       }
      //     });
      //   }
      // });
      // this.rowData = res.response.piqmappinglist;
      // this.totalCertificateCount = this.rowData.length;
      // const mappingCercodeValues = this.rowData.map(
      //   (item) => item.mappingcercode
      // );
      // const filteredMappingCode = mappingCercodeValues.filter(
      //   (value) => value !== null
      // );
      // this.certificateCount = filteredMappingCode.length;

    });
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
          ansPayload = {
            instanceid: this.referenceNumber,
            action: 'SS',
            user: this.userDetails?.userCode,
            tenantIdentifier: '',
            answerdata: this.answerDetails,
            location: this.locationCode,
            mainQuestCheckbox: pendingResult,
          };
        } else {
          if (this.isNotNull && type === 'submit') {
            ansPayload = {
              instanceid: this.referenceNumber,
              action: 'S',
              user: this.userDetails?.userCode,
              tenantIdentifier: '',
              answerdata: this.answerDetails,
              location: this.locationCode,
              mainQuestCheckbox: pendingResult,
            };
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

  onSubmit(type: string) {
    this.getQuestionAnswerDatas(type);
    if (type === 'reUse') {
      this.getRefnImportDetails(this.instanceId);
    }

    const modifiedData = {
      userName: this.userDetails.userData.mdata.appInfo.userName,
      userType: this.userDetails.userData.mdata.userInfo.userType,
      sortingDate: new Date(),
      modifiedDateTime: this.datePipe.transform(
        new Date(),
        'dd-MMM-yyyy HH:mm:ss'
      ),
    };
    this.syncedData.push(modifiedData);
    this.syncedData.sort((a:any, b:any) => b.sortingDate - a.sortingDate);
    if (this.syncedData.length > 5) {
      this.syncedData.splice(5);
    }
    this.expectedRowData=[]
    this.expectedRowData=[...this.expectedRowData,...this.syncedData]    
    console.log("----===",this.expectedRowData)
  }

  onSubmitQuickNotes() {
    const payload = {
      instanceid: this.referenceNumber,
      usercode: this.userDetails?.userCode,
      quicknotes: this.quickNotesInput,
    };
    this.BudgetService.saveQuickNotes(payload).subscribe((res) => {});
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
