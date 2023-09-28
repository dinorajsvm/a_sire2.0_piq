import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BudgetService } from '../../services/budget.service';

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
      (ngModelChange)="onSelectChange()"
    >
      <option value="">Select Code</option>
      <option
        class="selectOptions"
        *ngFor="let option of certificatDDList"
        [value]="option.certificatecode"
      >
        {{ option.certificatename }}
      </option>
    </select>
  `,
})
export class DropdownCellRendererComponent
  implements ICellRendererAngularComp, OnInit
{
  public params: any;
  public selectedValue = '';
  certificatDDList: any[] = [];
  constructor(private BudgetService: BudgetService) {}

  ngOnInit(): void {
    this.getCertificateList();
  }

  getCertificateList() {
    this.BudgetService.getCertificateList().subscribe((res: any) => {
      this.certificatDDList = res.response.certificatemasterlist;
    });
  }
  agInit(params: any): void {
    this.params = params;
    this.params.data.mappingcode = '';
  }

  refresh(): boolean {
    return false;
  }

  onSelectChange() {
    this.params.data.mappingcode = this.selectedValue;
  }
}
