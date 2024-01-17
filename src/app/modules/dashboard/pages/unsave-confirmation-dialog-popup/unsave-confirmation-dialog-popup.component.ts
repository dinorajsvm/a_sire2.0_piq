import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-unsave-confirmation-dialog-popup',
  templateUrl: './unsave-confirmation-dialog-popup.component.html',
  styleUrls: ['./unsave-confirmation-dialog-popup.component.css']
})
export class UnsaveConfirmationDialogPopupComponent {
  constructor(
    private dialogRef: MatDialogRef<UnsaveConfirmationDialogPopupComponent>) {

    }
  saveData() {
    this.dialogRef.close(true)
  }
 
  cancel() {
    this.dialogRef.close(false)
  }
}
