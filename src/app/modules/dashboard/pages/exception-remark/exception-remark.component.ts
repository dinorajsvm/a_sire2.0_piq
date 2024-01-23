import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-exception-remark',
  templateUrl: './exception-remark.component.html',
  styleUrls: ['./exception-remark.component.css']
})
export class ExceptionRemarkComponent {
  remarks = ''
  constructor(
    private dialogRef: MatDialogRef<ExceptionRemarkComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
      this.remarks = data
    }
  saveData() {
    this.dialogRef.close(this.remarks)
  }

  cancel() {
    this.dialogRef.close(false)
  }
}
