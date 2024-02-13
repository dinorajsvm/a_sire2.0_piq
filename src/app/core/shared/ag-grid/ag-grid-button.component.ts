import { Component } from '@angular/core'; 
import { AgRendererComponent,} from 'ag-grid-angular'; 
import { AppService } from '../../../modules/dashboard/services/app.service';
interface names {
    value: string;
    viewValue: string;
  }

@Component({ 
  selector: 'app-custom-button', 
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
    </style>
    <button mat-button class="syncBtn" type="submit">
      button
    </button>
  `,
})


export class CustomButtonComponent implements AgRendererComponent {

  refresh(params: any): boolean {
      throw new Error('Method not implemented.');
  } 
  public selectedValue!: string; 
  public options!: string[]; 
  constructor() {}



 
  agInit(params: any): void { 
    this.selectedValue = params.value; 
    this.options = params.options; 
  } 
 
  getValue(): any { 
    return this.selectedValue; 
  } 
 
  isPopup(): boolean { 
    return true; 
  } 
} 