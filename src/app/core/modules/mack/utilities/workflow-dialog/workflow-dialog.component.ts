import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { SummaryService } from 'src/app/modules/cmb/services/summary.service';

@Component({
  selector: 'app-workflow-dialog',
  templateUrl: './workflow-dialog.component.html',
  styleUrls: ['./workflow-dialog.component.css']
})
export class WorkflowDialogComponent implements OnInit {
  workflowHistory:any;
    
  constructor(@Inject(MAT_DIALOG_DATA) public popupData: any,
              public dialogRef : MatDialogRef<WorkflowDialogComponent>,)
              // private _summaryService: SummaryService)
            { }

  ngOnInit(): void {
    this.getWorkflowHistory();
  }

  getWorkflowHistory() {
    let payload = {
      "serialId": this.popupData.bpmSerialId
    }
    // this._summaryService.workflowHistory(payload, (res:any) => {
    //   this.workflowHistory = res.result.reverse();
    // });
  }

}
