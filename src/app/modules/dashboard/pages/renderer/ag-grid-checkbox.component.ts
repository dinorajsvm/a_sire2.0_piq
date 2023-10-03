import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-ag-grid-checkbox',
  template: ` <div>
    <input
      type="checkbox"
      [id]="checkBoxId"
      [checked]="isChecked"
      (change)="onCheckboxChange($event)"
    />
  </div>`,
})
export class AgGridCheckboxComponent implements ICellRendererAngularComp {
  private params: any;
  checkBoxId: any;
  isChecked = false;

  agInit(params: any): void {
    this.params = params;
    this.checkBoxId = this.params.colDef.field;
    this.isChecked = params.value === true;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onCheckboxChange(event: any) {
    this.isChecked = event.target.checked;
    this.params.node.data[`${event.target.id}`] = this.isChecked
    if (this.params.onClick instanceof Function) {
      const params = {
        event,
        rowData: this.params.node.data,
        // ...other data you want to pass to the parent component
      };
      this.params.onClick(params);
    }
  }
}
