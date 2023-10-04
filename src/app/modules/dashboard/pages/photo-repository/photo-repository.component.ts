import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PrDialogComponent } from '../pr-dialog/pr-dialog.component';
import { BudgetService } from '../../services/budget.service';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { ImageConfirmationDialogComponent } from '../image-confirmation-dialog/image-confirmation-dialog.component';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import { environment } from 'src/environments/environment';
import { NameConfirmationDialogComponent } from '../name-confirmation-dialog/name-confirmation-dialog.component';
import { SelectIdDialogComponent } from '../select-id-dialog/select-id-dialog.component';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-photo-repository',
  templateUrl: './photo-repository.component.html',
  styleUrls: ['./photo-repository.component.css'],
})
export class PhotoRepositoryComponent implements OnInit {
  @Input() getVesselType: any;
  dynamicImageURL = `${environment.apiUrl}/`;
  imageUrl: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef;
  images: any[] = [];
  showDragDropZone: boolean = false;
  listDatas: any[] = [];
  loadPhotoRep: any[] = [];
  showIcons: boolean[] = [];
  invalidImg = false;
  subheads: any[] = [];
  getSubTopicTitle: any = [];
  allExpanded: boolean = false;
  selectedCheckListID: string | null = null;
  selectedSubTopic: any | null = null; // Add this property to store the selected subTopic
  selectedInstanceID: any;
  value: any;
  imageNames: any;
  uploadedImgDatas: any[] = [];
  getdetails:any[]=[]
  getPRGriddetails:any
  getFilteredID: any;
  getFilteredSubHeading: any;
  userDetails: any;
  referenceNumber: any;
  getFilteredTopic: any;
  isDialogOpen = false;
  subTopicCounts: any;
  getvslCode: any;
  getTopicList: any;
  trimmedVslType: any;
  isVslTypeSame!: boolean;

  constructor(
    public dialog: MatDialog,
    private BudgetService: BudgetService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private _storage: StorageService
  ) {
    this.userDetails = this._storage.getUserDetails();
  }

  ngOnInit(): void {
    this.referenceNumber = this.route.snapshot.paramMap.get('id');
    this.getPrDataLists();
    this.getImageName();
    this.getVesselTypeData();
  }
  getVesselTypeData() {
    this.BudgetService.getVesselTypeData().subscribe((res: any) => {
      this.getvslCode = res;
      if (this.getvslCode == undefined || this.getvslCode === '') {
        console.log('No Vessel Type is Selected');
      } else {
        this.trimmedVslType = this.getvslCode.split(' ')[0];
        if (this.selectedInstanceID == undefined) {
          this.getPrDataLists();
        } else {
          this.getPRImgLists();
        }
      }
    });
  }

  getPRImgLists() {
    let getSelectedCheckListID: any = localStorage.getItem(
      'getSelectedCheckListID'
    );
    const getinstanceID = JSON.parse(getSelectedCheckListID);
    this.selectedInstanceID = getinstanceID;
    const payload = { instanceid: getinstanceID };
    this.BudgetService.getPhotoRepGridListImg(payload).subscribe((res: any) => {
      // this.listDatas = [];
      if (getinstanceID && getinstanceID?.length != 0) {
        this.loadPhotoRep = JSON.parse(res.response);
        this.listDatas = JSON.parse(res.response);
        var mergedImg = this.listDatas.reduce(
          (acc, obj) => acc.concat(obj.topiclist),
          []
        );
        let getNewData: any = [];
        this.getTopicList = mergedImg;
        this.getTopicList.forEach((item: any) => {
          if (this.trimmedVslType == undefined || this.trimmedVslType === '') {
            console.log('no trimmed value');
          } else {
            this.isVslTypeSame = item.topic.includes(this.trimmedVslType);
          }
          if (
            item.topic === 'Core photograph set' 
            || this.isVslTypeSame == true
            ) {
              getNewData.push(item);
            }
          });
        var imageCombined: any = [];
        const groupedData: any = {};
        for (const item of getNewData) {
          if (!groupedData[item.topic]) {
            groupedData[item.topic] = [];
          }
          groupedData[item.topic].push(...item.subTopics);
        }

        for (const topic of Object.keys(groupedData)) {
          const mergedObject = {
            topic,
            subTopics: groupedData[topic],
          };
          imageCombined.push(mergedObject);
        }
        
        this.getSubTopicTitle = [];
       
        imageCombined.forEach((element: any) => {
          element.subTopics.forEach((subtitle: any, index: any) => {
            this.getSubTopicTitle.push(subtitle.subTopicTitle);
            
            const subheader: any = element.subTopics.find(
              (sub: any) => sub.subTopicTitle === subtitle.subTopicTitle
            );
            subtitle['imagelist'] = [...subheader.relImages];
            const unique = element.subTopics.filter((obj: any, index: any) => {
              return (
                index ===
                element.subTopics.findIndex(
                  (o: any) => obj.subTopicTitle === o.subTopicTitle
                )
              );
            });
            element.subTopics = unique;
          });
        });
        this.subTopicCounts = this.getSubTopicTitle.length;
        this.BudgetService.setPhotoRepData(this.subTopicCounts);
        this.listDatas = imageCombined;
        this.imageNames.forEach((data: any) => {
          this.listDatas.forEach((res: any) => {
            res.subTopics.forEach((sub: any, index: any) => {              
              if (data.subTopicName === sub.subTopicTitle) {
                sub.imagelist.forEach((list: any) => {
                  const formattedName=list.localfilename.split('.')[0]
                  const formattedExtension=list.localfilename.split('.')[1]
                  const formattedDefName=data.imageName.split('.')[0]
                  list['formattedName']=formattedName;
                  list['formattedExtension']=formattedExtension;
                  list['formattedDefName']=formattedDefName;
                  list['defaultImageName'] = data.imageName;
                });
              }
            });
          });
        });
        this.createPRDetails()
        this.listDatas.forEach((data) => {
          data.subTopics.forEach((data1: any) => {
            const invalidImg = data1.imagelist.find((x: any) => {
              x.sizeinMB > 100 * 1024 * 1024;
            });
            if (invalidImg) {
              this.invalidImg = true;
              return;
            }
          });
        });
      } else {
        this.getPrDataLists();
      }
    });
    this.allExpanded = true;
  }

  createPRDetails() {
    this.getdetails=[];
    const duplicatedList=this.listDatas
    duplicatedList.forEach((res: any) => {
      res.subTopics.forEach((sub: any) => {
        if(sub.imagelist.length==0){
          sub['imgAvailable']="No"
          sub['nameMatch']=""
        }else{
          sub['imgAvailable']="Yes"
        }
        sub.imagelist.forEach((img:any)=>{
          if(img.localfilename===img.defaultImageName){
            sub['nameMatch']="Yes"
          }else{
            sub['nameMatch']="No"
          }
        })
      })
    })
    this.getdetails=duplicatedList
    this.getPhotoRepDetails()
  }

  getPhotoRepDetails(){
    this.getPRGriddetails=[]
    this.getdetails.forEach((res:any) => {
      res.subTopics.forEach((item:any)=>{
        this.getPRGriddetails.push({subTopicTitle:item.subTopicTitle,photoAvailable:item.imgAvailable,isNotMatching:item.nameMatch})
      })
    })
    this.BudgetService.setPrGridData(this.getPRGriddetails);    
  }

  setDefaultName(img: any, defaultName: string,formattedname:any) {
    img.localfilename = defaultName;
    img.formattedName = formattedname;
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
              data.localfilename = data.defaultImageName;
              data.formattedName = data.formattedDefName;
            });
          });
        });
      }
    });
  }

  getImageName() {
    this.BudgetService.getPRImageName().subscribe((res: any) => {
      this.imageNames = res;
    });
  }

  getPrDataLists() {
    this.BudgetService.getDefaultImageTemplate().subscribe((res: any) => {
      this.listDatas = [];
      const staticData = JSON.parse(res.response);

      staticData.forEach((res: any) => {
        if (this.trimmedVslType == undefined || this.trimmedVslType === '') {
          console.log('no trimmed value');
        } else {
          this.isVslTypeSame = res.topic.includes(this.trimmedVslType);
        }
        if (res.topic === 'Core photograph set' || this.isVslTypeSame == true) {
          this.listDatas.push(res);
        }
      });

      this.listDatas.forEach((res: any) => {
        res.subTopics.forEach((item: any) => {
          this.getSubTopicTitle.push(item.subTopicTitle);
        });
      });
      this.subTopicCounts = this.getSubTopicTitle.length;
      this.BudgetService.setPhotoRepData(this.subTopicCounts);
      this.subheads.forEach((data) => {
        data.forEach((data1: any) => {
          const invalidImg = data1.imagelist.find(
            (x: any) => x.sizeinMB > 100 * 1024 * 1024
          );
          if (invalidImg) {
            this.invalidImg = true;
            return;
          }
        });
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
          this.getFilenameFromUrl(image.localfilename)
        )
      );
    }
    // Loop through each newly uploaded image and add them to the zip
    for (const image of this.images) {
      if (!image.filepath) {
        promises.push(
          this.addImageToZip(zip, image.url, this.getFilenameFromUrl(image.url))
        );
      }
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
          this.getFilenameFromUrl(image.localfilename)
        )
      );
    }
    // Loop through each newly uploaded image and add them to the zip
    for (const image of this.images) {
      if (!image.filepath) {
        promises.push(
          this.addImageToZip(zip, image.url, this.getFilenameFromUrl(image.url))
        );
      }
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

  getFilenameFromUrl(url: string): string {
    if (!url) {
      return '';
    }
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  }

  downloadImage(image: any) {
    const imageUrl = image.filepath
      ? this.dynamicImageURL + image.filepath
      : image.url;

    this.fetchImageBlob(imageUrl).then((blob) => {
      const filename = this.getFilenameFromUrl(image.localfilename);
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
    dialogConfig.panelClass = 'grid-dialog-container';
    const getSelectedCheckList = localStorage.getItem('getSelectedCheckListID');
    const getSelectedChecked =
      getSelectedCheckList && getSelectedCheckList.length > 0
        ? JSON.parse(getSelectedCheckList)
        : [];

    this.selectedCheckListID = getSelectedChecked;
    const dialogRef = this.dialog.open(PrDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.getPRImgLists();
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

  getBase64ImageFromCache(imageName: string): string {
    const uploadedImage = this.images.find((img) => img.name === imageName);
    return uploadedImage ? uploadedImage.url : '';
  }

  selectFile(subHead: any, selectedID: any, topic: any, event: any) {
    if (selectedID && selectedID?.length == 0) {
      this.fileInput.nativeElement.click();
      this.selectedSubTopic = subHead;
    } else if (selectedID && selectedID?.lenght != 0) {
      this.isDialogOpen = true;
      const dialogRef = this.dialog.open(SelectIdDialogComponent, {
        data: { instanceID: selectedID, subHead, topic },
        panelClass: 'select-dialog-container',
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.isDialogOpen = false;
        if (result) {
          this.getFilteredID = result?.id;
          this.getFilteredSubHeading = result?.subHeading;
          this.getFilteredTopic = result?.topic;
          if (this.getFilteredID) {
            this.fileInput.nativeElement.click();
            this.onFileSelected(event);
          }
        }
      });
    }
  }

  savePhoto() {
    const payload = {
      instanceid: this.referenceNumber,
      usercode: this.userDetails?.userCode,
      imagelist: this.loadPhotoRep,
    };
    this.BudgetService.savePhotoRep(payload).subscribe((res: any) => {
      const data = res;
    });
  }
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    if (event && event.target && event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
    }
    if (this.selectedFile) {
      const files = event.target.files;
      if (this.selectedSubTopic) {
        this.handleFiles(files, this.selectedSubTopic); // Pass the selected subTopic to the handleFiles function
      } else {
      }
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.http
        .post(
          'https://mackdevship.solverminds.net/PIQ/event/attachmentupload',
          formData
        )
        .subscribe(
          (response) => {
            this.uploadedData();
            // Handle success, e.g., show a success message
          },
          (error) => {
            console.error('Image upload failed', error);
            // Handle error, e.g., show an error message
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
    // this.uploadedImgDatas.push({
    //   relImages: [],
    //   subTopics: [],
    //   topiclist: [],
    //   filesize: '',
    //   filename: '',
    //   instanceid: this.getFilteredID,
    //   filepath: '',
    //   localfilename: 'cascasccccccccccc',
    //   sizeinbytes: '',
    //   sizeinMB: '',
    // });
    this.BudgetService.getUploadData(payload).subscribe((res: any) => {
      var data = JSON.parse(res.responsse);

      this.uploadedImgDatas.push({
        relImages: [],
        subTopics: [],
        topiclist: [],
        filesize: '',
        filename: '',
        instanceid: this.getFilteredID,
        filepath: data.filepath,
        localfilename: data.localfilename,
        sizeinbytes: data.sizeinbytes,
        sizeinMB: data.sizeinmb,
      });
      const filterInstanceId = this.loadPhotoRep.find(
        (res: any) => res.instanceid == this.getFilteredID
      );
      const filteredTopic = filterInstanceId.topiclist.find(
        (item: any) => item.topic == this.getFilteredTopic
      );

      // const subtopicData = {
      //   subid: '',
      //   subTopicTitle: this.getFilteredSubHeading,
      //   relImages: this.uploadedImgDatas,
      //   subTopics: '',
      //   topiclist: '',
      //   sizeinbytes: '',
      //   sizeinMB: '',
      // };
      // filteredTopic.subTopics.push(subtopicData);

      var mergedImg = this.loadPhotoRep.reduce(
        (acc, obj) => acc.concat(obj.topiclist),
        []
      );
      var imageCombined: any = [];
      const groupedData: any = {};
      for (const item of mergedImg) {
        if (!groupedData[item.topic]) {
          groupedData[item.topic] = [];
        }
        groupedData[item.topic].push(...item.subTopics);
      }

      for (const topic of Object.keys(groupedData)) {
        const mergedObject = {
          topic,
          subTopics: groupedData[topic],
        };
        imageCombined.push(mergedObject);
      }
      imageCombined.forEach((element: any) => {
        element.subTopics.forEach((subtitle: any, index: any) => {
          const subheader: any = element.subTopics.find(
            (sub: any) => sub.subTopicTitle === subtitle.subTopicTitle
          );
          subtitle['imagelist'] = [...subheader.relImages];
          if (subtitle.subTopicTitle === this.getFilteredSubHeading) {
            subtitle.imagelist.push(...this.uploadedImgDatas);
            this.uploadedImgDatas = [];
          }

          const unique = element.subTopics.filter((obj: any, index: any) => {
            return (
              index ===
              element.subTopics.findIndex(
                (o: any) => obj.subTopicTitle === o.subTopicTitle
              )
            );
          });
          element.subTopics = unique;
        });
      });
      this.listDatas = imageCombined;
      this.imageNames.forEach((data: any) => {
        this.listDatas.forEach((res: any) => {
          res.subTopics.forEach((sub: any, index: any) => {
            if (data.subTopicName === sub.subTopicTitle) {
              sub.imagelist.forEach((list: any) => {
                list['defaultImageName'] = data.imageName;
              });
            }
          });
        });
      });
    });

    this.listDatas.forEach((data) => {
      data.subTopics.forEach((data1: any) => {
        const invalidImg = data1.imagelist.find((x: any) => {
          x.sizeinMB > 100 * 1024 * 1024;
        });
        if (invalidImg) {
          this.invalidImg = true;
          return;
        }
      });
    });
  }

  onSubmit() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.http.post('your-server-upload-endpoint', formData).subscribe(
        (response) => {
          // Handle success, e.g., show a success message
        },
        (error) => {
          // Handle error, e.g., show an error message
        }
      );
    }
  }

  handleFileInput(event: any) {
    const inputElement = event.target as HTMLInputElement;

    const file = inputElement.files?.[0];

    if (file && file.size <= 100 * 1024 * 1024) {
      const files = event.target.files;
      if (this.selectedSubTopic) {
        this.handleFiles(files, this.selectedSubTopic); // Pass the selected subTopic to the handleFiles function
      } else {
      }
    } else {
      return;
    }
  }

  handleFiles(files: FileList | null, subHead: any) {
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = {
          filepath: e.target.result.split(',')[1], // Extract the base64 data from the result
          filename: files[i].name,
          docsize: this.formatSize(files[i].size),
        };
        subHead.imagelist.push(image);
      };
      reader.readAsDataURL(files[i]);
    }
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files || null;
    if (this.selectedSubTopic && files) {
      this.handleFiles(files, this.selectedSubTopic); // Pass the selected subTopic to the handleFiles function
    } else {
    }
    this.showDragDropZone = false;
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    this.showDragDropZone = true;
  }

  handleDragLeave(event: DragEvent) {
    event.preventDefault();
    this.showDragDropZone = false;
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  convertFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    const unit = sizes[i];

    return size ? `${size} ${unit}` : '0 KB';
  }

  updateImageName(subHead: any, imgIndex: number) {
    // You can save the updated filename here, for example:
    subHead.imagelist[imgIndex].filename = this.sanitizedFileName(
      subHead.imagelist[imgIndex].filename
    );
  }

  sanitizedFileName(filename: string): string {
    // Implement any sanitization logic you need for the filename here
    // For example, you can remove special characters or limit the length
    return filename;
  }
}