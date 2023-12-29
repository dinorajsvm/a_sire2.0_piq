import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PrDialogComponent } from '../pr-dialog/pr-dialog.component';
import { BudgetService } from '../../services/budget.service';
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

@Component({
  selector: 'app-photo-repository',
  templateUrl: './photo-repository.component.html',
  styleUrls: ['./photo-repository.component.css'],
})
export class PhotoRepositoryComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  dynamicImageURL = `${environment.apiUrl}/`;
  selectedFile: File | null = null;
  imageUrl: string = '';
  listDatas: any[] = [];
  loadPhotoRep: any[] = [];
  showIcons: boolean[] = [];
  invalidImg = false;
  getSubTopicTitle: any = [];
  allExpanded: boolean = false;
  selectedSubTopic: any | null = null; // Add this property to store the selected subTopic
  selectedInstanceID: any;
  imageNames: any;
  actualPhotoCount = 0;
  getPRGriddetails: any[] = [];
  userDetails: any;
  referenceNumber: any;
  subTopicCounts = 0;
  getvslCode: any;
  trimmedVslType: any;
  isVslTypeSame!: boolean;
  getImagesCount: any;
  hideReqBtns = false;
  disableBtns = false;

  constructor(
    public dialog: MatDialog,
    private BudgetService: BudgetService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private _storage: StorageService,
    private _snackBarService: SnackbarService
  ) {
    this.userDetails = this._storage.getUserDetails();
  }

  ngOnInit(): void {
    this.referenceNumber = this.route.snapshot.paramMap.get('id');
    this.getDefaultImageName();
    if (this.route.snapshot.paramMap.get('type') == 'view') {
      this.disableBtns = true;
      this.invalidImg = true;
    }
    this.BudgetService.getEnableBtn().subscribe((res: any) => {
      this.disableBtns = res;
      this.invalidImg = res;
    });
    this.BudgetService.getEditVisible().subscribe((res: any) => {
      this.hideReqBtns = res;
    });
    this.getSelectedCheckListId();
    this.getSavedPRData();
    this.getVesselTypeData();
    this.summaryGridCount();
  }

  getSelectedCheckListId() {
    let getSelectedCheckListID: any = localStorage.getItem(
      'getSelectedCheckListID'
    );
    if (getSelectedCheckListID) {
      const getinstanceID = JSON.parse(getSelectedCheckListID);
      this.selectedInstanceID = getinstanceID;
    } else {
      this.selectedInstanceID = [];
    }
  }
  getVesselTypeData() {
    this.getSelectedCheckListId();
    this.BudgetService.getVesselTypeData().subscribe((res: any) => {
      console.log("res",res);
      this.getvslCode = res;
      this.trimmedVslType = this.getvslCode.split(' ');
      console.log("this.trimmedVslType",this.trimmedVslType);
      
      if (this.selectedInstanceID) {
        this.getPRImgLists();
      }
    });
  }

  getPRImgLists() {
    this.getSelectedCheckListId();
    const payload = { instanceid: this.selectedInstanceID };
    this.BudgetService.getPhotoRepGridListImg(payload).subscribe((res: any) => {
      if (this.selectedInstanceID && this.selectedInstanceID.length > 0) {
        const response = JSON.parse(res.response);
        this.listDatas = response[0].topiclist.filter((resData: any) => {
          console.log("resData.topic",resData.topic);
          
          return (
            resData.topic === 'Core photograph set' ||
            resData.topic.includes(this.trimmedVslType)
          );
        });

        this.listDatas.forEach((list) => {
          list.subTopics.forEach((subTopics: any) => {
            subTopics['imagelist'] = subTopics.relImages;
            subTopics['imagelist'].forEach((img: any) => {
              img.sizeCheck = img.sizeinbytes;
              (img.formattedName = img.localfilename),
                (img.sizeinbytes = img.sizeinMB.toFixed(2) + ' ' + 'MB');
            });
          });
        });
      }
    });
    this.allExpanded = true;
  }

  setDefaultName(img: any, defaultName: string, formattedname: any) {
    img.localfilename = formattedname;
    img.formattedName = defaultName;
    this.summaryGridCount();
  }

  resetAllImageFilenames(allListData: any) {
    const dialogRef = this.dialog.open(NameConfirmationDialogComponent, {
      panelClass: 'confirm-dialog-container',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        allListData.forEach((sub: any) => {
          sub.subTopics.forEach((img: any) => {
            img.imagelist.forEach((data: any) => {
              data.localfilename = data.formattedDefName;
              data.formattedName = data.defaultImageName;
            });
          });
        });
        this.summaryGridCount();
      }
    });
  }

  getDefaultImageName() {
    const companyCode = this.userDetails.companyCode;
    this.BudgetService.getPRImagename(
      companyCode,
      this.referenceNumber
    ).subscribe((res: any) => {
      if (res && typeof res.Response === 'string') {
        let object = JSON.parse(res.Response);
        this.imageNames = object;
      }
    });
  }
  getSavedPRData() {
    this.BudgetService.getSavedPRData(this.referenceNumber).subscribe(
      (res: any) => {
        if (res && res.response && res.response.length > 0) {
          let prData = JSON.parse(res.response[0].photorepojson);
          this.listDatas = prData.imagelist;
          this.summaryGridCount();
        } else {
          this.getPrDataLists();
        }
      }
    );
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

    this.BudgetService.setPrGridData(this.getPRGriddetails);
    this.BudgetService.setImgCount(this.actualPhotoCount);
    this.BudgetService.setPhotoRepData(this.subTopicCounts);
  }

  getPrDataLists() {
    this.BudgetService.getDefaultImageTemplate().subscribe((res: any) => {
      this.listDatas = [];
      const staticData = JSON.parse(res.response);
      staticData.forEach((res: any) => {
        res.subTopics.forEach((sub: any) => {
          sub['imagelist'] = [];
        });
        if (this.trimmedVslType) {
          this.isVslTypeSame = res.topic.includes(this.trimmedVslType);
        }
        console.log("res.topic",res.topic);
        
        if (res.topic === 'Core photograph set' || this.isVslTypeSame) {
          this.listDatas.push(res);
          this.summaryGridCount();
        }
      });
    });

    this.allExpanded = true;
  }

  downloadAll() {
    for (const topic of this.listDatas) {
      for (const subTopic of topic.subTopics) {
        this.downloadAllTopicImages(
          topic.topic,
          subTopic.subTopicTitle,
          subTopic.imagelist
        );
      }
    }
  }

  removeImage(imagesArray: any[], index: number) {
    const dialogRef = this.dialog.open(ImageConfirmationDialogComponent, {
      panelClass: 'confirm-dialog-container',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        imagesArray.splice(index, 1);
      }
    });
  }

  openFullscreenDialog(
    imageUrl: string,
    topic: string,
    subTopicTitle: string,
    filename: string
  ): void {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl, topic, subTopicTitle, filename },
      panelClass: 'fullscreen-dialog-container',
    });
  }

  // download all topic images
  downloadAllTopicImages(topic: any, subTopicTitle: string, imagelist: any[]) {
    const zip = new JSZip();
    const promises: Promise<void>[] = [];

    for (const image of imagelist) {
      const imageUrl = image.filepath
        ? this.dynamicImageURL + image.filepath
        : image.url;
      promises.push(
        this.addImageToZip(
          zip,
          imageUrl,
          this.getFilenameFromUrl(image.formattedName, image.localfilename)
        )
      );
    }

    // Wait for all promises to resolve, then generate and trigger the download of the zip file
    Promise.all(promises).then(() => {
      zip.generateAsync({ type: 'blob' }).then((content) => {
        const folderName = `${topic}`;
        const filename = `${folderName}/${subTopicTitle}.zip`;
        saveAs(content, filename);
      });
    });
  }

  // download all subtopic images
  downloadAllSubTopicImages(subTopicTitle: string, imagelist: any[]) {
    const zip = new JSZip();
    const promises: Promise<void>[] = [];

    for (const image of imagelist) {
      const imageUrl = image.filepath
        ? this.dynamicImageURL + image.filepath
        : image.url;
      promises.push(
        this.addImageToZip(
          zip,
          imageUrl,
          this.getFilenameFromUrl(image.formattedName, image.localfilename)
        )
      );
    }

    // Wait for all promises to resolve, then generate and trigger the download of the zip file
    Promise.all(promises).then(() => {
      zip.generateAsync({ type: 'blob' }).then((content) => {
        const filename = `${subTopicTitle}.zip`;
        saveAs(content, filename);
      });
    });
  }

  addImageToZip(zip: JSZip, imageUrl: string, filename: string): Promise<void> {
    return this.getImageData(imageUrl).then((blob) => {
      zip.file(filename, blob, { binary: true });
    });
  }

  getImageData(url: string): Promise<Blob> {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .catch((error) => {
        throw error;
      });
  }

  getFilenameFromUrl(url: string, extension?: any): string {
    if (!url) {
      return '';
    }
    const splitExtension = extension.split('.');
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1] + '.' + splitExtension[1];
  }

  downloadImage(image: any) {
    const imageUrl = image.filepath
      ? this.dynamicImageURL + image.filepath
      : image.url;
    this.fetchImageBlob(imageUrl).then((blob) => {
      const filename = this.getFilenameFromUrl(
        image.formattedName,
        image.localfilename
      );
      saveAs(blob, filename);
    });
  }

  fetchImageBlob(imageUrl: string): Promise<Blob> {
    return fetch(imageUrl).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      return response.blob();
    });
  }

  openDialog(): void {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'gridSelection-dialog-container';
    const dialogRef = this.dialog.open(PrDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getPRImgLists();
      }
    });
  }

  toggleAllExpanded() {
    this.allExpanded = !this.allExpanded;
    if (this.allExpanded) {
      this.expandedSectionIndex = -1; // Collapse all topics
    } else {
      this.expandedSectionIndex = -1; // Expand all topics
    }
  }

  expandedSectionIndex: number = -1;

  toggleExpand(index: number) {
    this.expandedSectionIndex =
      this.expandedSectionIndex === index ? -1 : index;
  }

  selectFile(subHead: any, selectedID: any, topic: any, event: any) {
    this.fileInput.nativeElement.value = '';
    this.fileInput.nativeElement.click();
    this.selectedSubTopic = subHead;
  }

  savePhoto() {
    const payload = {
      instanceid: this.referenceNumber,
      usercode: this.userDetails?.userCode,
      imagelist: this.listDatas,
    };
    this.BudgetService.savePhotoRep(payload).subscribe((res: any) => {
      this._snackBarService.loadSnackBar('Saved Successfully', colorCodes.INFO);
      this.getSavedPRData();
    });
  }

  onFileSelected(event: any) {
    if (event && event.target && event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
      const splitString = event.target.files[0].name.split('.')[0];
      if (splitString.length >= 80) {
        this._snackBarService.loadSnackBar(
          'File Name length should be or less than 80 Characters.',
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
        .subscribe(
          (response) => {
            setTimeout(() => {
              this.uploadedData();
            }, 300);
          },
          (error) => {
            console.error('Image upload failed', error);
          }
        );
    }
  }

  uploadedData() {
    const payload = {
      instanceid: this.referenceNumber,
      usercode: this.userDetails?.userCode,
      type: 'photo',
    };
    this.BudgetService.getUploadData(payload).subscribe((res: any) => {
      if (res && res.responsse) {
        const data = JSON.parse(res.responsse);
        this.listDatas.forEach((res: any) => {
          if (res) {
            let findValue = res.subTopics.find(
              (sub: any) =>
                this.selectedSubTopic.subTopicTitle === sub.subTopicTitle
            );

            const formattedName = data.localfilename.split('.')[0];
            const formattedExtension = data.localfilename.split('.')[1];
            const image = {
              filepath: data.filepath,
              localfilename: data.localfilename,
              formattedName: formattedName,
              formattedExtension: formattedExtension,
              sizeinbytes: data.sizeinMB.toFixed(2) + ' ' + 'MB',
            };
            if (findValue && findValue.imagelist) {
              findValue.imagelist.push(image);
            }
          }
        });
        this.summaryGridCount();
        if (this.imageNames) {
          this.imageNames.forEach((data: any) => {
            this.listDatas.forEach((res: any) => {
              res.subTopics.forEach((sub: any, index: any) => {
                if (data.subtopic === sub.subTopicTitle) {
                  sub.imagelist.forEach((list: any) => {
                    const formattedExtension = list.localfilename.split('.')[1];
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
      }
    });
  }
  handleImageError(event: Event) {
    // Handle image loading error
    console.error('Image failed to load:', event);
  }

  handleFiles(files: FileList | null, subHead: any) {
    if (!files) return;
    const file: any = files;
    file.forEach((element: any, index: any) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = {
          filepath: e.target.result.split(',')[1], // Extract the base64 data from the result
          filename: files[index].name,
          docsize: this.formatSize(files[index].size),
        };

        subHead.imagelist = subHead.imagelist || [];
        subHead.imagelist.push(image);
      };
      reader.readAsDataURL(files[index]);
    });
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files || null;
    if (this.selectedSubTopic && files) {
      this.handleFiles(files, this.selectedSubTopic); // Pass the selected subTopic to the handleFiles function
    }
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
  }

  handleDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2))
      ? parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
      : '0 KB';
  }

  updateImageName(subHead: any, imgIndex: number) {
    subHead.imagelist[imgIndex].filename = this.sanitizedFileName(
      subHead.imagelist[imgIndex].filename
    );
  }

  sanitizedFileName(filename: string): string {
    return filename;
  }
}
