import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-select-id-dialog',
  templateUrl: './select-id-dialog.component.html',
  styleUrls: ['./select-id-dialog.component.css']
})
export class SelectIdDialogComponent implements OnInit {
  selectedValue: any;
  selectedInstanceID:any
  subHeading: any;
  topic: any;

  constructor(public dialogRef: MatDialogRef<SelectIdDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.selectedValue = data.instanceID;
    this.topic=data.topic
    this.subHeading =data.subHead.subTopicTitle;
  }
  onClose(): void {
    this.dialogRef.close({id:this.selectedInstanceID,topic:this.topic,subHeading:this.subHeading}); // Pass the selected value back when closing the dialog
    // this.dialogRef.close(); // Pass the selected value back when closing the dialog
  }

  btnDisable(): boolean{
    if(this.selectedInstanceID==null){
      return true
    }
    else{
      return false
    }
  }

  ngOnInit(): void {
  }

}
