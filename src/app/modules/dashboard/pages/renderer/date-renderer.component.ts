import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'date-cell',
  template: `
    <ng-container>
      <mat-form-field>
        <input
          matInput
          class="input-field"
          [(ngModel)]="inputDate"
          [matDatepicker]="picker"
          [readonly]="true"
          (click)="picker.open()"
        />
        <mat-datepicker-toggle matSuffix [for]="picker">
        </mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
    </ng-container>
  `,
  styles: [
    `
      .input-field {
        position: relative;
        bottom: 10px;
        font-size: px;
      }
      mat-datepicker-toggle {
        position: relative;
        bottom: 20px;
      }
    `,
  ],
  providers: [DatePipe],
})
export class DateRendererComponent implements ICellEditorAngularComp {
  constructor(private datePipe: DatePipe) {}

  params: any;
  inputDate: any;

  agInit(params: any): void {
    this.params = params;
    this.inputDate = this.params.value;
  }

  getValue() {
    return this.inputDate
      ? this.datePipe.transform(this.inputDate, 'dd-MMM-yyyy')
      : '';
  }
}
