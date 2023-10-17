import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-dropdown-cell-renderer',
  template: `
    <style>
      .selectDropDown {
        border: 1px solid gray;
        width: 150px;
        border-radius: 5px;
      }
    </style>
    <select
      class="selectDropDown"
      [(ngModel)]="selectedValue"
      (change)="onSelectChange($event)"
    >
      <option value="">Select dropdown</option>
      <option
        class="selectOptions"
        *ngFor="let option of dropDown"
        [value]="option"
      >
        {{ option }}
      </option>
    </select>
  `,
})
export class DDCellRendererComponent implements ICellRendererAngularComp {
  public params: any;
  selectedValue: any = '';
  dropDown: any[] = ['Yes', 'No'];

  agInit(params: any): void {
    this.params = params;
    this.selectedValue = this.params.data.dropdown
      ? this.params.data.dropdown
      : '';
  }

  refresh(): boolean {
    return false;
  }

  onSelectChange(event: any) {
    this.params.data.dropdown = this.selectedValue;
  }
}
