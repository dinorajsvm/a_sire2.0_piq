import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MackComponent } from './mack.component';
import { UtilitiesComponent } from './utilities/utilities.component';
import { AngularMaterialModule } from '../material/angular-material.module';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { StageComponent } from './stage/stage.component';
import { ChatDialogComponent } from './utilities/chat-dialog/chat-dialog.component';
import { WorkflowDialogComponent } from './utilities/workflow-dialog/workflow-dialog.component';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [MackComponent, UtilitiesComponent,ToolbarComponent, StageComponent, ChatDialogComponent, WorkflowDialogComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    PipesModule
  ],
  exports: [MackComponent, UtilitiesComponent,ToolbarComponent, StageComponent]
})
export class MackModule { }
