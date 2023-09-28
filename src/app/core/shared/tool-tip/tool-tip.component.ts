import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-tool-tip',
  templateUrl: './tool-tip.component.html',
  styleUrls: ['./tool-tip.component.css']
})
export class ToolTipComponent implements ICellRendererAngularComp {

  constructor() { }
  displayParam:any;
  tooltipParam:any;

  agInit(params: any) {
    this.displayParam = params.displayParam;
    this.tooltipParam = params.tooltipParam;
  }

  getData(){
    return this.tooltipParam;
  }

  refresh() {
    return false;
  }
}
