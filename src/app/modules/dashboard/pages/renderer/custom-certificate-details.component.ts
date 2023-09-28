import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  // selector: 'app-custom-certificate-details',
  template: `<h1>My Custom Detail</h1>`,
})
export class CustomCertificateDetailsComponent implements ICellRendererAngularComp {

  agInit(params: any): void {
    
  }

  refresh(params: any): boolean {
    return false;
  }
}


