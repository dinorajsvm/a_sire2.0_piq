import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog-popup',
  templateUrl: './confirmation-dialog-popup.component.html',
  styleUrls: ['./confirmation-dialog-popup.component.css']
})
export class ConfirmationDialogPopupComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogPopupComponent>) {

    }
  saveData() {
    this.dialogRef.close(true)
  }

  cancel() {
    this.dialogRef.close(false)
  }
}
