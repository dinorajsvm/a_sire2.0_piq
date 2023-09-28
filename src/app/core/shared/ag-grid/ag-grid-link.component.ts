import { Component, NgZone } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  template: `<ng-container>
                    <span class="cursor-pointer" (click)="params.onMenuAction(params.data)">
                    <span *ngIf="params.data.verRequired == 'Y' && params.data.status=='Need Verification'">
                    <img *ngIf="params.data.verifiedBy==null" src='assets/cmb-icons/verify.png' alt='Not Verified' class='verify'/>
                    </span>
                    <span *ngIf="params.data.verRequired == 'Y' && params.data.status=='Close'">
                    <img *ngIf="params.data.verifiedBy" src='assets/cmb-icons/verified-doc.png' alt='Verified' class='verify'/>
                    </span>
                    <span class='pl-3'>
                    {{params.value}}
                    </span>
                    </span>
            </ng-container>`,
  styles: ['.icon-width {width:19px}']
})

export class AgGridLinkComponent implements AgRendererComponent {
  params: any;
  constructor() { }

  refresh(params: any): boolean {
   return false
  }
  agInit(params: import("ag-grid-community").ICellRendererParams): void {
    this.params = params;
  }
}