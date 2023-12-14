import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-button-renderer',
  template: `
    <style>
      .syncBtn {
        background-color: #19c37d;
        color: white;
        line-height: 19px;
        margin: 0 5px;
        padding: 0px 10px;
        font-size: 12px;
        border: 1px solid #19c37d;
      }
    </style>
    <button mat-button class="syncBtn" type="submit" (click)="onClick($event)">
      Apply
    </button>
  `,
})
export class ApplyRendererComponent implements ICellRendererAngularComp {
  params: any;
  label!: string;
  hideReqBtns = false

  agInit(params: any): void {
    this.params = params;
    this.label = this.params.label || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event: any) {
    if (this.params.onClick instanceof Function) {
      this.params.node.data.q156 = new Date(this.params.node.data.q156);
      this.params.node.data.q156 =
        this.params.node.data.q156 === 'N' ? 'No' : 'Yes';
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data,
        // ...something
      };
      this.params.onClick(params);
    }
  }
}
