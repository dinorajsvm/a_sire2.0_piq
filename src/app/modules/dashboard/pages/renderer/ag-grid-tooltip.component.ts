import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {ITooltipParams} from "ag-grid-community";
import {ITooltipAngularComp} from "ag-grid-angular";

@Component({
  selector: 'app-ag-grid-tooltip',
  template: `
  <style>
    .custom-tooltip{
        background-color: white;
        border:1px solid black;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
        height: fit-content;
    }
  </style>
  <div class="custom-tooltip">
          <span style="color:blue">{{ value }}</span>
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
