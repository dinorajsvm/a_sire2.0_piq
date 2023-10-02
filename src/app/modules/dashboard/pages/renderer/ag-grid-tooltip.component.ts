import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {ITooltipParams} from "ag-grid-community";
import {ITooltipAngularComp} from "ag-grid-angular";

@Component({
  selector: 'app-ag-grid-tooltip',
  template: `
  <style>
    .custom-tooltip{
        background-color: white !important;
        border:1px solid black !important;
        white-space: nowrap !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        height: fit-content !important;
        padding: 3px !important;
        border-radius: 3px !important;
    }
  </style>
  <div class="custom-tooltip">
          <span style="color:black !important;">{{ value }}</span>
      </div>`,
})
export class agGridTooltipComponent implements ITooltipAngularComp{
  params: any;
  value: any;
  constructor() {}

  agInit(params: any): void {
    this.value = params.value;
  }

  refresh(params: any): boolean {
    return false;
  }
  
}
