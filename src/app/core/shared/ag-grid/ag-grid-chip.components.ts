import { Component, NgZone } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { Router } from '@angular/router';

@Component({
  template: `<ng-container *ngFor="let chipset of params.value">
                    <span class="chip mr-2 cursor-pointer" *ngIf="chipset" (click)="params.onMenuAction(chipset)">{{ chipset }}</span>
            </ng-container>`,
  styles: ['']
})

export class AgGridChipComponent implements AgRendererComponent {
  params: any;
  public id: any;
  constructor(private ngZone: NgZone,
    private router: Router) { }

  refresh(params: any): boolean {
   return false
  }
  agInit(params: import("ag-grid-community").ICellRendererParams): void {
    this.params = params;
    this.id = this.params.navigateId ? this.params.data[this.params.navigateId]  :  this.params.data.id ;
  }
  navigate(link: any, id: any) {
    this.ngZone.run(() => {
        this.router.navigate([link, id]);
    });
  }
}