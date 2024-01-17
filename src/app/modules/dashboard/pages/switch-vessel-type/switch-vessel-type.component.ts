import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-switch-vessel-type',
  templateUrl: './switch-vessel-type.component.html',
  styleUrls: ['./switch-vessel-type.component.css']
})
export class SwitchVesselTypeComponent {
  constructor(
    private dialogRef: MatDialogRef<SwitchVesselTypeComponent>) {

    }
  saveData() {
    this.dialogRef.close(true)
  }

  cancel() {
    this.dialogRef.close(false)
  }
}
