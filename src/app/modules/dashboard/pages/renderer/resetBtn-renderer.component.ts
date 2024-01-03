import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BudgetService } from '../../services/budget.service';

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
      .disableBtns {
        background-color: gray !important;
        border: 1px solid gray;
        color: black !important;
      }
    </style>
    <button
      mat-button
      class="syncBtn"
      type="submit"
      [disabled]="disableBtns"
      [class.disableBtns]="disableBtns"
      (click)="onClick($event)"
    >
      Reset
    </button>
  `,
})
export class ResetBtnRendererComponent implements ICellRendererAngularComp {
  params: any;
  label!: string;
  disableBtns = false;
  constructor(private BudgetService: BudgetService) {

    this.disableBtns = localStorage.getItem('setDisable') === 'true';
  }

  agInit(params: any): void {
    this.params = params;
    this.label = this.params.label || null;

    this.BudgetService.getEnableBtn().subscribe((res: any) => {
      this.disableBtns = res;
    });
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event: any) {
    if (this.params.onClick instanceof Function) {
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
