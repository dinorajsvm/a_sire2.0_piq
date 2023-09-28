import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-confirmation-dialog',
  templateUrl: './image-confirmation-dialog.component.html',
  styleUrls: ['./image-confirmation-dialog.component.css']
})
export class ImageConfirmationDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ImageConfirmationDialogComponent>) {}

  ngOnInit(): void {
  }

}
