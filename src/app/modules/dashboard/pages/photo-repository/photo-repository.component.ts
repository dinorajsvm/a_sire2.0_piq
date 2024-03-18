import {
  AfterContentChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PrDialogComponent } from '../pr-dialog/pr-dialog.component';
import { AppService } from '../../services/app.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { environment } from 'src/environments/environment';
import { NameConfirmationDialogComponent } from '../name-confirmation-dialog/name-confirmation-dialog.component';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { ActivatedRoute } from '@angular/router';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { colorCodes } from 'src/app/core/constants';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { ImageConfirmationDialogComponent } from '../image-confirmation-dialog/image-confirmation-dialog.component';
import { forkJoin, map } from 'rxjs';
import { CancellationService } from '../../services/cancellation.service';
import { LoaderService } from 'src/app/core/services/utils/loader.service';
@Component({
  selector: 'app-photo-repository',
  templateUrl: './photo-repository.component.html',
  styleUrls: ['./photo-repository.component.css'],
})
export class PhotoRepositoryComponent
  implements OnInit, OnDestroy, AfterContentChecked
{
  @ViewChild('fileInput') fileInput!: ElementRef;
  dynamicImageURL = `${environment.apiUrl}/`;
  selectedFile: File | null = null;
  listDatas: any[] = [];
  showIcons: boolean[] = [];
  invalidImg = false;
  allExpanded: boolean = false;
  selectedSubTopic: any | null = null; // Add this property to store the selected subTopic
  selectedTitle = '';
  expandedSectionIndex: number = -1;
  selectedInstanceID: any;
  imageNames: any;
  actualPhotoCount = 0;
  getPRGriddetails: any[] = [];
  userDetails: any;
  referenceNumber: any;
  subTopicCounts = 0;
  isProceedImageLoad = false;
  getvslCode: any;
  hideReqBtns = false;
  disableBtns = false;
  regexValidation: any;
  constructor(
    public dialog: MatDialog,
    private appServices: AppService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private _storage: StorageService,
    private _snackBarService: SnackbarService,
    private cancellationService: CancellationService,
    private loaderService: LoaderService,
    private el: ElementRef
  ) {
    this.userDetails = this._storage.getUserDetails();
  }
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  scrollValue = 0;
  onScrolled(event: any) {
    this.scrollValue = event;
  }
  onScrollEvent(elements?: string) {
    if (elements) {
      const data = elements;
      this.appServices.getServerFileFromStream(data).subscribe((res: Blob) => {
        if (res) {
          let srcUrl: any;
          const blob = new Blob([res]);
          srcUrl = URL.createObjectURL(blob);
          this.listDatas.forEach((res: any) => {
            res.subTopics.forEach((sub: any, index: any) => {
              sub.imagelist.forEach((list: any) => {
                if (list.systemfilename === data) {
                  list.imagePreviewSrc = srcUrl;
                }
              });
            });
          });
        }
      });
    } else {
      const scrollPosition =
        window.scrollY || document.documentElement.scrollTop;
      const elementsInView =
        this.el.nativeElement.querySelectorAll('.imgContainer');
      elementsInView.forEach((element: any) => {
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        let elementId: any;
        if (element && element.id) {
          elementId = element.id;
        }
        if (elementPosition <= scrollPosition + 1000 && elementId) {
          const data = elementId;
          const removeElement = document.getElementById(elementId);
          if (removeElement) {
            removeElement.removeAttribute('id');
          }
          this.appServices
            .getServerFileFromStream(data)
            .subscribe((res: Blob) => {
              if (res) {
                let srcUrl: any;
                const blob = new Blob([res]);
                srcUrl = URL.createObjectURL(blob);
                this.listDatas.forEach((res: any) => {
                  res.subTopics.forEach((sub: any) => {
                    sub.imagelist.forEach((list: any) => {
                      if (list.systemfilename === data) {
                        list.imagePreviewSrc = srcUrl;
                      }
                    });
                  });
                });
              }
            });
        }
      });
    }
  }

  ngOnInit(): void {
    localStorage.removeItem('getSelectedCheckListID');
    this.referenceNumber = this.route.snapshot.paramMap.get('id');
    this.selectedInstanceID = [];
    this.appServices.getVesselTypeData().subscribe((res: any) => {
      this.getvslCode = res;
      if (this.getvslCode) {
        this.selectedInstanceID = [];
        this.getDefaultImageName();
        const vesselType = localStorage.getItem('vesselType');
        if (vesselType) {
          this.getPrDataLists();
        } else {
          this.getSavedPR();
        }
      }
    });

    if (this.route.snapshot.paramMap.get('type') == 'view') {
      this.disableBtns = true;
      this.invalidImg = true;
    }
    this.appServices.getEnableBtn().subscribe((res: any) => {
      this.disableBtns = res;
      this.invalidImg = res;
    });
    this.appServices.getEditVisible().subscribe((res: any) => {
      this.hideReqBtns = res;
    });
    this.appServices.getRegex().subscribe((res: any) => {
      this.regexValidation = res;
    });
    this.summaryGridCount();
  }

  ngAfterContentChecked(): void {
    if (this.isProceedImageLoad) {
      this.processElementsInView();
    }
  }

  processElementsInView() {
    const elementsInView =
      this.el.nativeElement.querySelectorAll('.imgContainer');
    if (elementsInView && elementsInView.length > 0) {
      this.isProceedImageLoad = false;
      const firstFiveElements = Array.from(elementsInView).slice(0, 5); // Select the first 5 elements
      firstFiveElements.forEach((element: any) => {
        const elementId = element.id;
        if (elementId) {
          this.onScrollEvent(elementId);
        }
      });
    }
  }

  getPRImgLists() {
    const payload = {
      instanceid: this.selectedInstanceID,
      vesseltype: this.getvslCode,
    };

    this.appServices.getPhotoRepGridListImg(payload).subscribe((res: any) => {
      if (this.selectedInstanceID && this.selectedInstanceID.length > 0) {
        this.listDatas = [];
        const response = JSON.parse(res.response);
        this.listDatas = response[0].topiclist;
        this.listDatas.forEach((list) => {
          list.subTopics.forEach((subTopics: any) => {
            subTopics['imagelist'] = subTopics.relImages;
            subTopics['imagelist'].forEach((img: any) => {
              let extensionvalue: any;
              let formattedExtension: any;
              if (img && img.localfilename) {
                extensionvalue = img.localfilename.split('.');
              }
              if (extensionvalue && extensionvalue.length === 1) {
                formattedExtension = extensionvalue[extensionvalue.length];
              } else {
                if (extensionvalue && extensionvalue.length > 1) {
                  formattedExtension =
                    extensionvalue[extensionvalue.length - 1];
                }
              }
              let fileSizeConvert = '0.00 KB';
              if (img && +img.filesize <= 1048576) {
                fileSizeConvert =
                  (+img.filesize / 1024).toFixed(2) + ' ' + 'KB';
              } else {
                fileSizeConvert =
                  (+img.filesize / (1024 * 1024)).toFixed(2) + ' ' + 'MB';
              }

              img.imagePreviewSrc = null;
              img.sizeCheck = img.sizeinbytes;
              img.formattedName = img.localfilename.split('.')[0];
              img.formattedExtension = formattedExtension;
              img.fileSizeConvert = fileSizeConvert;
              img.systemfilename = img.systemfilename;
            });
          });
        });

        if (this.imageNames) {
          this.imageNames.forEach((data: any) => {
            this.listDatas.forEach((res: any) => {
              res.subTopics.forEach((sub: any) => {
                if (data.subtopic === sub.subTopicTitle) {
                  sub.imagelist.forEach((list: any) => {
                    let extensionvalue: any;
                    let formattedExtension: any;
                    if (list && list.localfilename) {
                      extensionvalue = list.localfilename.split('.');
                    }
                    if (extensionvalue && extensionvalue.length === 1) {
                      formattedExtension =
                        extensionvalue[extensionvalue.length];
                    } else {
                      if (extensionvalue && extensionvalue.length > 1) {
                        formattedExtension =
                          extensionvalue[extensionvalue.length - 1];
                      }
                    }
                    const formattedDefName =
                      data.imagename + '.' + formattedExtension;
                    list['formattedDefName'] = formattedDefName;
                    list['defaultImageName'] = data.imagename;
                  });
                }
              });
            });

            this.summaryGridCount();
          });
        }
        this.summaryGridCount();
      }
    });
    this.isProceedImageLoad = true;

    this.allExpanded = true;
  }

  setDefaultName(img: any, defaultName: string, formattedname: any) {
    img.localfilename = formattedname ? formattedname : '';
    img.formattedName = defaultName ? defaultName : '';
    this.summaryGridCount();
  }

  resetAllImageFilenames() {
    const dialogRef = this.dialog.open(NameConfirmationDialogComponent, {
      panelClass: 'confirm-dialog-container',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.imageNames && this.imageNames.length > 0) {
        this.imageNames.forEach((data: any) => {
          this.listDatas.forEach((res: any) => {
            res.subTopics.forEach((sub: any) => {
              if (
                sub &&
                sub.subTopicTitle &&
                sub.subTopicTitle.lastIndexOf('.') !== -1
              ) {
                sub.subTopicTitle = sub.subTopicTitle.slice(0, -1); // Remove the last character
              }

              if (data.subtopic === sub.subTopicTitle) {
                sub.imagelist.forEach((list: any) => {
                  let extensionvalue: any;
                  let formattedExtension: any;
                  if (list && list.localfilename) {
                    extensionvalue = list.localfilename.split('.');
                  }
                  if (extensionvalue && extensionvalue.length === 1) {
                    formattedExtension = extensionvalue[extensionvalue.length];
                  } else {
                    if (extensionvalue && extensionvalue.length > 1) {
                      formattedExtension =
                        extensionvalue[extensionvalue.length - 1];
                    }
                  }
                  const formattedDefName =
                    data.imagename + '.' + formattedExtension;
                  list['localfilename'] = formattedDefName;
                  list['formattedName'] = data.imagename;
                  list['defaultImageName'] = data.imagename;
                });
              }
            });
          });
          this.summaryGridCount();
        });
      }
    });
  }

  getDefaultImageName() {
    const companyCode = this.userDetails.companyCode;
    this.referenceNumber = this.route.snapshot.paramMap.get('id');
    this.appServices
      .getPRImagename(companyCode, this.referenceNumber)
      .subscribe((res: any) => {
        if (res && typeof res.Response === 'string') {
          let object = JSON.parse(res.Response);
          this.imageNames = object;
          if (this.imageNames) {
            this.imageNames.forEach((data: any) => {
              this.listDatas.forEach((res: any) => {
                res.subTopics.forEach((sub: any) => {
                  if (
                    sub &&
                    sub.subTopicTitle &&
                    sub.subTopicTitle.lastIndexOf('.') !== -1
                  ) {
                    sub.subTopicTitle = sub.subTopicTitle.slice(0, -1); // Remove the last character
                  }

                  if (data.subtopic === sub.subTopicTitle) {
                    if (sub && sub.imagelist) {
                      sub.imagelist.forEach((list: any) => {
                        let extensionvalue: any;
                        let formattedExtension: any;
                        if (list && list.localfilename) {
                          extensionvalue = list.localfilename.split('.');
                        }
                        if (extensionvalue && extensionvalue.length === 1) {
                          formattedExtension =
                            extensionvalue[extensionvalue.length];
                        } else {
                          if (extensionvalue && extensionvalue.length > 1) {
                            formattedExtension =
                              extensionvalue[extensionvalue.length - 1];
                          }
                        }
                        if (data) {
                          const formattedDefName =
                            data.imagename + '.' + formattedExtension;
                          list.formattedDefName = formattedDefName;
                          list.defaultImageName = data.imagename;
                        }
                      });
                    }
                  }
                });
              });
              this.summaryGridCount();
            });
          }
        }
      });
  }

  getSavedPR() {
    this.referenceNumber = this.route.snapshot.paramMap.get('id');
    this.appServices
      .getSavedPRData(this.referenceNumber)
      .subscribe((res: any) => {
        if (res && res.response && res.response.length > 0) {
          let prData = JSON.parse(res.response[0].photorepojson);
          this.listDatas = prData.imagelist;
          this.listDatas.forEach((res: any) => {
            res.subTopics.forEach((sub: any) => {
              sub.imagelist.forEach((list: any) => {
                let extensionvalue: any;
                let formattedExtension: any;
                if (list && list.localfilename) {
                  extensionvalue = list.localfilename.split('.');
                }
                if (extensionvalue && extensionvalue.length === 1) {
                  formattedExtension = extensionvalue[extensionvalue.length];
                } else {
                  if (extensionvalue && extensionvalue.length > 1) {
                    formattedExtension =
                      extensionvalue[extensionvalue.length - 1];
                  }
                }

                const formattedName =
                  list && list.localfilename
                    ? list.localfilename.split('.')[0]
                    : '';
                let fileSizeConvert = '0.00 KB';
                if (list && +list.sizeinbytes <= 1048576) {
                  fileSizeConvert =
                    (+list.sizeinbytes / 1024).toFixed(2) + ' ' + 'KB';
                } else {
                  fileSizeConvert =
                    (+list.sizeinbytes / (1024 * 1024)).toFixed(2) + ' ' + 'MB';
                }
                list.imagePreviewSrc = null;
                list.systemfilename = list.systemfilename;
                list.localfilename = list.localfilename;
                list.formattedName = formattedName;
                list.formattedExtension = formattedExtension;
                list.fileSizeConvert = list.fileSizeConvert;
              });
            });
          });
          this.summaryGridCount();
        } else {
          this.getPrDataLists();
        }
      });
    this.allExpanded = true;
  }

  summaryGridCount() {
    this.subTopicCounts = 0;
    this.actualPhotoCount = 0;
    this.getPRGriddetails = [];

    this.listDatas.forEach((res: any, index: any) => {
      this.subTopicCounts =
        this.subTopicCounts +
        (this.listDatas[index] &&
        this.listDatas[index].subTopics &&
        this.listDatas[index].subTopics.length > 0
          ? this.listDatas[index].subTopics.length
          : 0);

      const photoCount = res.subTopics.filter((count: any) => {
        return count && count.imagelist && count.imagelist.length > 0;
      });
      this.actualPhotoCount =
        this.actualPhotoCount +
        (photoCount && photoCount.length > 0 ? photoCount.length : 0);

      res.subTopics.forEach((data: any) => {
        if (
          data &&
          data.subTopicTitle &&
          data.subTopicTitle.lastIndexOf('.') !== -1
        ) {
          data.subTopicTitle = data.subTopicTitle.slice(0, -1); // Remove the last character
        }
        const photoDetails = {
          topic: data.subTopicTitle,
          image:
            data && data.imagelist && data.imagelist.length > 0 ? 'Yes' : 'No',
          nameMismatch: 'No',
        };
        if (data && data.imagelist && data.imagelist.length > 0) {
          data.imagelist.forEach((img: any) => {
            photoDetails.nameMismatch =
              img.defaultImageName === img.formattedName ? 'No' : 'Yes';
          });
        }
        this.getPRGriddetails.push(photoDetails);
      });
    });
    this.appServices.setPrGridData(this.getPRGriddetails);
    this.appServices.setImgCount(this.actualPhotoCount);
    this.appServices.setPhotoRepData(this.subTopicCounts);
  }

  getPrDataLists() {
    this.appServices
      .getDefaultImageTemplate(this.getvslCode)
      .subscribe((res: any) => {
        const staticData = JSON.parse(res.response);
        staticData.forEach((res: any) => {
          res.subTopics.forEach((sub: any) => {
            sub['imagelist'] = [];
          });
        });
        this.listDatas = [];
        this.listDatas = staticData;
        this.summaryGridCount();
      });
    this.allExpanded = true;
  }

  removeImage(imagesArray: any[], index: number) {
    const dialogRef = this.dialog.open(ImageConfirmationDialogComponent, {
      panelClass: 'confirm-dialog-container',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        imagesArray.splice(index, 1);
        this.summaryGridCount();
      }
    });
  }

  openFullscreenDialog(
    imagePreviewSrc: string,
    topic: string,
    subTopicTitle: string,
    filename: string
  ): void {
    this.dialog.open(ImageDialogComponent, {
      data: { imagePreviewSrc, topic, subTopicTitle, filename },
      panelClass: 'fullscreen-dialog-container',
    });
  }

  downloadAll() {
    this.loaderService.loaderShow();
    const zip = new JSZip();
    const requests: any[] = [];
    this.listDatas.forEach((element) => {
      let topicFolder: any;
      const photoCount = element.subTopics.filter((count: any) => {
        return count && count.imagelist && count.imagelist.length > 0;
      });
      if (photoCount && photoCount.length > 0) {
        const topicFolderName = element.topic.toString().includes('/')
          ? element.topic.toString().replaceAll('/', '-')
          : element.topic.toString();
        topicFolder = zip.folder(topicFolderName);
      }
      if (element && element.subTopics && element.subTopics.length > 0) {
        element.subTopics.forEach((subTopic: any) => {
          if (subTopic && subTopic.imagelist && subTopic.imagelist.length > 0) {
            subTopic.imagelist.forEach((img: any, index: any) => {
              if (img && img.systemfilename) {
                requests.push(
                  this.appServices
                    .getServerFileFromStream(img.systemfilename)
                    .toPromise()
                    .then((blob: any) => {
                      const subTopicFolderName = subTopic.subTopicTitle
                        .toString()
                        .includes('/')
                        ? subTopic.subTopicTitle.toString().replaceAll('/', '-')
                        : subTopic.subTopicTitle.toString();

                      const subTopicFolder = topicFolder
                        ? topicFolder.folder(subTopicFolderName)
                        : null;
                      if (!(img && img.localfilename)) {
                        img.localfilename =
                          'empty_default_name' + '.' + img.formattedExtension;
                      }
                      if (subTopicFolder) {
                        let fileName: any;
                        const splitLocalName =
                          img && img.localfilename
                            ? img.localfilename.split('.')[0]
                            : '';
                        if (index) {
                          fileName = splitLocalName
                            ? splitLocalName +
                              ' ' +
                              '(' +
                              index +
                              ')' +
                              '.' +
                              img.formattedExtension
                            : 'empty_default_name' +
                              ' ' +
                              '(' +
                              index +
                              ')' +
                              '.' +
                              img.formattedExtension;
                        } else {
                          fileName = splitLocalName
                            ? splitLocalName + '.' + img.formattedExtension
                            : 'empty_default_name' +
                              '.' +
                              img.formattedExtension;
                        }
                        subTopicFolder.file(fileName, blob);
                      }
                    })
                );
              }
            });
          }
        });
      }
    });
    forkJoin(requests).subscribe(() => {
      this.referenceNumber = this.route.snapshot.paramMap.get('id');
      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `${this.referenceNumber}.zip`);
        this.loaderService.loaderHide();
      });
    });
  }

  downloadAllSubTopicImages(subTopicTitle: string, imagelist: any[]) {
    this.loaderService.loaderShow();
    const zip = new JSZip();
    const requests: any[] = imagelist.map((img: any, index: any) =>
      this.appServices
        .getServerFileFromStream(img.systemfilename)
        .toPromise()
        .then((blob: any) => {
          let fileName: any;
          const splitLocalName =
            img && img.localfilename ? img.localfilename.split('.')[0] : '';
          if (index) {
            fileName = splitLocalName
              ? splitLocalName +
                ' ' +
                '(' +
                index +
                ')' +
                '.' +
                img.formattedExtension
              : 'empty_default_name' +
                ' ' +
                '(' +
                index +
                ')' +
                '.' +
                img.formattedExtension;
          } else {
            fileName = splitLocalName
              ? splitLocalName + '.' + img.formattedExtension
              : 'empty_default_name' + '.' + img.formattedExtension;
          }
          zip.file(fileName, blob);
        })
    );

    forkJoin(requests).subscribe(() => {
      zip.generateAsync({ type: 'blob' }).then((content: any) => {
        saveAs(content, `${subTopicTitle}.zip`);
        this.loaderService.loaderHide();
      });
    });
  }

  getFilenameFromUrl(url: string, extension?: any): string {
    if (!url) {
      return '';
    }
    const splitExtension = extension.split('.');
    const urlParts = url.split('/');
    const finalValue = urlParts[urlParts.length - 1] + '.' + splitExtension[1];
    return finalValue ? finalValue : '';
  }

  downloadImage(image: any) {
    this.appServices
      .getServerFileFromStream(image.systemfilename)
      .subscribe((res: Blob) => {
        const splitLocalName =
          image && image.localfilename ? image.localfilename.split('.')[0] : '';
        const fileName = splitLocalName
          ? splitLocalName + '.' + image.formattedExtension
          : 'empty_default_name' + '.' + image.formattedExtension;
        saveAs(res, fileName);
      });
  }

  openDialog(): void {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'gridSelection-dialog-container';
    const dialogRef = this.dialog.open(PrDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        this.selectedInstanceID = [];
        this.getDefaultImageName();
        this.getSavedPR();
      } else if (result) {
        this.getCheckListDetailsOnly();
      }
    });
  }

  getCheckListDetailsOnly() {
    let getSelectedCheckListID: any = localStorage.getItem(
      'getSelectedCheckListID'
    );
    if (getSelectedCheckListID) {
      const getinstanceID = JSON.parse(getSelectedCheckListID);
      this.selectedInstanceID = getinstanceID;
    } else {
      this.selectedInstanceID = [];
    }
    if (this.selectedInstanceID && this.selectedInstanceID.length > 0) {
      this.getPRImgLists();
    }
  }

  toggleAllExpanded() {
    this.allExpanded = !this.allExpanded;
    if (this.allExpanded) {
      this.expandedSectionIndex = -1; // Collapse all topics
    } else {
      this.expandedSectionIndex = -1; // Expand all topics
    }
  }

  toggleExpand(index: number) {
    this.expandedSectionIndex =
      this.expandedSectionIndex === index ? -1 : index;
  }

  selectFile(subHead: any, title: any) {
    this.fileInput.nativeElement.value = '';
    this.fileInput.nativeElement.click();
    this.selectedSubTopic = subHead;
    this.selectedTitle = title;
  }

  savePhoto() {
    this.referenceNumber = this.route.snapshot.paramMap.get('id');
    const payload = {
      instanceid: this.referenceNumber,
      usercode: this.userDetails?.userCode,
      imagelist: this.listDatas,
    };
    this.appServices.savePhotoRep(payload).subscribe((res: any) => {
      this._snackBarService.loadSnackBar('Saved Successfully', colorCodes.INFO);
      localStorage.removeItem('getSelectedCheckListID');
      this.selectedInstanceID = [];
    });
  }

  onFileSelected(event: any) {
    if (event && event.target && event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
      const splitString = event.target.files[0].name;
      const splitData = splitString.split('.')[0];
      const pattern = new RegExp(this.regexValidation);
      if (!pattern.test(splitData)) {
        this._snackBarService.loadSnackBar(
          'Invalid File Format / Extension',
          colorCodes.INFO
        );
        return;
      }
      if (splitString.length >= 70) {
        this._snackBarService.loadSnackBar(
          'Image Name length should be or less than 70 Characters.',
          colorCodes.INFO
        );
        return;
      }
      if (event.target.files[0].size >= 10000000) {
        this._snackBarService.loadSnackBar(
          'The maximum image size is 10MB.',
          colorCodes.INFO
        );
        return;
      }
    }
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Image = e.target.result;
        const imgElement = new Image();
        imgElement.src = base64Image;
      };
      reader.readAsDataURL(this.selectedFile);

      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.http
        .post(this.dynamicImageURL + 'PIQ/event/attachmentupload', formData)
        .subscribe((response) => {
          this.uploadedData();
        });
    }
  }

  uploadedData() {
    this.referenceNumber = this.route.snapshot.paramMap.get('id');
    const payload = {
      instanceid: this.referenceNumber,
      usercode: this.userDetails?.userCode,
      type: 'photo',
    };
    this.appServices.getUploadData(payload).subscribe((res: any) => {
      if (res && res.responsse) {
        const data = JSON.parse(res.responsse);
        this.listDatas.forEach((res: any) => {
          if (res) {
            let findValue = res.subTopics.find((sub: any) => {
              if (
                sub &&
                sub.subTopicTitle &&
                sub.subTopicTitle.lastIndexOf('.') !== -1
              ) {
                (sub: any) =>
                  (sub.subTopicTitle = sub.subTopicTitle.slice(0, -1)); // Remove the last character
              }
              return (
                this.selectedSubTopic.subTopicTitle === sub.subTopicTitle &&
                this.selectedTitle === res.topic
              );
            });

            const formattedName =
              data && data.localfilename
                ? data.localfilename.split('.')[0]
                : '';
            let extensionvalue: any;
            let formattedExtension: any;
            if (data && data.localfilename) {
              extensionvalue = data.localfilename.split('.');
            }
            if (extensionvalue && extensionvalue.length === 1) {
              formattedExtension = extensionvalue[extensionvalue.length];
            } else {
              if (extensionvalue && extensionvalue.length > 1) {
                formattedExtension = extensionvalue[extensionvalue.length - 1];
              }
            }
            let srcUrl: any;
            this.appServices
              .getServerFileFromStream(data.systemfilename)
              .subscribe((res: Blob) => {
                const blob = new Blob([res]);
                srcUrl = URL.createObjectURL(blob);
                let fileSizeConvert = '0.00 KB';
                if (data && +data.sizeinbytes <= 1048576) {
                  fileSizeConvert =
                    (+data.sizeinbytes / 1024).toFixed(2) + ' ' + 'KB';
                } else {
                  fileSizeConvert =
                    (+data.sizeinbytes / (1024 * 1024)).toFixed(2) + ' ' + 'MB';
                }
                const image = {
                  imagePreviewSrc: srcUrl,
                  systemfilename: data.systemfilename,
                  localfilename: data.localfilename,
                  formattedName: formattedName,
                  formattedExtension: formattedExtension,
                  sizeinbytes: data.sizeinbytes,
                  fileSizeConvert: fileSizeConvert,
                };
                if (findValue && findValue.imagelist) {
                  findValue.imagelist.push(image);
                  if (this.imageNames) {
                    this.imageNames.forEach((data: any) => {
                      this.listDatas.forEach((res: any) => {
                        res.subTopics.forEach((sub: any, index: any) => {
                          if (data.subtopic === sub.subTopicTitle) {
                            sub.imagelist.forEach((list: any) => {
                              let extensionvalue: any;
                              let formattedExtension: any;
                              if (list && list.localfilename) {
                                extensionvalue = list.localfilename.split('.');
                              }
                              if (
                                extensionvalue &&
                                extensionvalue.length === 1
                              ) {
                                formattedExtension =
                                  extensionvalue[extensionvalue.length];
                              } else {
                                if (
                                  extensionvalue &&
                                  extensionvalue.length > 1
                                ) {
                                  formattedExtension =
                                    extensionvalue[extensionvalue.length - 1];
                                }
                              }
                              const formattedDefName =
                                data.imagename + '.' + formattedExtension;
                              list['formattedDefName'] = formattedDefName;
                              list['defaultImageName'] = data.imagename;
                            });
                          }
                        });
                      });
                    });
                  }
                }
                this.summaryGridCount();
              });
          }
        });
      }
    });
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    return;
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    return;
  }

  handleDragLeave(event: DragEvent) {
    event.preventDefault();
    return;
  }

  updateImageName(subHead: any, imgIndex: number) {
    subHead.imagelist[imgIndex].filename = this.sanitizedFileName(
      subHead.imagelist[imgIndex].filename
    );
  }

  sanitizedFileName(filename: string): string {
    return filename;
  }

  ngOnDestroy(): void {
    this.cancellationService.cancel();
  }
}
