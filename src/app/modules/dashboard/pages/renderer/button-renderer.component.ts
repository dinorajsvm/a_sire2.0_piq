import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-button-renderer',
  template: `
    <style>
      .downloadBtn {
        background-color: #19c37d;
        color: white;
        line-height: 19px;
        margin: 0 5px;
        padding: 0px 10px;
        font-size: 12px;
        border: 1px solid #19c37d;
      }
    </style>
    <button
      mat-button
      class="downloadBtn"
      type="submit"
      (click)="onClick($event)"
    >
      Apply
    </button>
  `,
})
export class ButtonRendererComponent implements ICellRendererAngularComp {
  params: any;
  label!: string;
  hideReqBtns = false;

  agInit(params: any): void {
    this.params = params;
    this.label = this.params.label || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event: any) {
    if (this.params.onClick instanceof Function) {
      this.params.node.data.visitfromdate = new Date(
        this.params.node.data.visitfromdate
      );
      this.params.node.data.visittodate = new Date(
        this.params.node.data.visittodate
      );
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
