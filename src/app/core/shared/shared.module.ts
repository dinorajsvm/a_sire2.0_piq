import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from './custom-table/custom-table.component';
import { AngularMaterialModule } from '../modules/material/angular-material.module';
import { LoaderComponent } from './loader/loader.component';
import { PromptComponent } from './prompt/prompt.component';
import { AgGridToolbarComponent } from './ag-grid-toolbar/ag-grid-toolbar.component';
import { PipesModule } from '../pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SaveAsTemplateComponent } from './save-as-template/save-as-template.component';
import { ToolTipComponent } from './tool-tip/tool-tip.component';

@NgModule({
  declarations: [
    CustomTableComponent,
    LoaderComponent,
    PromptComponent,
    AgGridToolbarComponent,
    SaveAsTemplateComponent,
    ToolTipComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    PipesModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    CustomTableComponent,
    LoaderComponent,
    PromptComponent,
    AgGridToolbarComponent,
    SaveAsTemplateComponent,
  ],
})
export class SharedModule {}
