import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PhotoRepositoryComponent } from '../photo-repository/photo-repository.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.css']
})
export class ImageDialogComponent implements OnInit {
  dynamicImageURL = `${environment.apiUrl}/`;
  imageScale = 100;
  originalImageSize=this.imageScale;
  constructor(public dialogRef: MatDialogRef<ImageDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
   }

  ngOnInit(): void {}

  zoomIn(): void {
    if (this.imageScale < 300) { // Limit the maximum zoom to 200%
      this.imageScale += 10; // Increase the scale by 10% (you can adjust the increment as per your requirement)
    }
  }

  zoomOut(): void {
    if (this.imageScale > 25) { // Limit the minimum zoom to 50%
      this.imageScale -= 10; // Decrease the scale by 10% (you can adjust the decrement as per your requirement)
    }
  }

  resetImage():void{
    this.imageScale=this.originalImageSize;
  }


  
  goToPreviousImage(): void {
   
  }

  goToNextImage(): void {
   
  }


}
