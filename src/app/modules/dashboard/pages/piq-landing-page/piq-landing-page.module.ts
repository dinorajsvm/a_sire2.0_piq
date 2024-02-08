import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PIQLandingPageComponent } from './piq-landing-page.component';
import { AgGridModule } from 'ag-grid-angular';
import { AngularMaterialModule } from 'src/app/core/modules/material/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path: '',
    component: PIQLandingPageComponent
     
  }
]

@NgModule({
  declarations: [PIQLandingPageComponent],
  imports: [
    CommonModule,
    AgGridModule,
    AngularMaterialModule,ReactiveFormsModule,
    NgxDaterangepickerMd.forRoot(),
    RouterModule.forChild(routes)
    
  ]
})
export class PiqLandingPageModule { }
