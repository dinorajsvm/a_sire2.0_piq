import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PIQLandingPageComponent } from './piq-landing-page.component';
import { AgGridModule } from 'ag-grid-angular';
import { AngularMaterialModule } from 'src/app/core/modules/material/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/core/shared/shared.module';

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
    SharedModule,
    AngularMaterialModule,ReactiveFormsModule,
    NgxDaterangepickerMd.forRoot(),
    RouterModule.forChild(routes)
    
  ]
})
export class PiqLandingPageModule { }
