// import { Component, OnInit } from '@angular/core'; 
// import { AgRendererComponent,} from 'ag-grid-angular'; 
// import { BudgetService } from '../../../modules/dashboard/services/budget.service';


// @Component({ 
//   selector: 'app-custom-drop-down-editor', 
//   template: `
//   <style>
//     .dropdown{
//         width: 100%;
//     }

//   </style> 

//   <div>Test</div>
//     <!-- <select class="ui search dropdown"  > 
//       <option *ngFor="let opt of data" [value]="opt.value">{{ opt.viewValue }}</option> 
//     </select>  -->

//   `, 
// })


// export class CustomDropDownEditorComponent implements AgRendererComponent, OnInit {

//     data =[
//         { value: 'productChemicalTanker', viewValue: 'Products/Chemical Tanker' },
//         { value: 'productsTanker', viewValue: 'Products Tanker' },
//         { value: 'chemicalCarrierType1', viewValue: 'Chemical Carrier Type 1' },
//         { value: 'chemicalCarrierType', viewValue: 'Chemical Carrier Type 2' },
//         { value: 'chemicalCarrierType3', viewValue: 'Chemical Carrier Type 3' },
//       ];
//   refresh(params: any): boolean {
//       throw new Error('Method not implemented.');
//   } 
//   public selectedValue!: string; 
//   public options!: string[]; 
//   constructor() {}

// ngOnInit(): void {
//   console.log(this.data, 'data');
  
// }
 
//   agInit(params: any): void { 
//     this.selectedValue = params.value; 
//     this.options = params.options; 
//   } 
 
//   getValue(): any { 
//     return this.selectedValue; 
//   } 
 
//   isPopup(): boolean { 
//     return true; 
//   } 
// } 


// src/app/dropdown-cell-renderer.component.ts

