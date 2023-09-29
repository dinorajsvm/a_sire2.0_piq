import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { AngularMaterialModule } from 'src/app/core/modules/material/angular-material.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { MackModule } from 'src/app/core/modules/mack/mack.module';
import { LayoutModule } from 'src/app/layout/layout.module';
import { AgGridModule } from 'ag-grid-angular';
import { DashboardRoutingModule } from './dashboard-routing.component';

import { MasterScreenComponent } from './pages/Components-List/master-screen/master-screen.component';
import { GlobalSearchComponent } from './pages/global-search/global-search.component';
import { PiqReportComponent } from './pages/piq-report/piq-report.component';
import { PhotoRepositoryComponent } from './pages/photo-repository/photo-repository.component';
import { PrDialogComponent } from './pages/pr-dialog/pr-dialog.component';
import { ImageDialogComponent } from './pages/image-dialog/image-dialog.component';
import { ImageConfirmationDialogComponent } from './pages/image-confirmation-dialog/image-confirmation-dialog.component';
import { PIQLandingPageComponent } from './pages/piq-landing-page/piq-landing-page.component';
import { PIQSummaryComponent } from './pages/piqsummary/piqsummary.component';
import { ExceptionQuestionComponent } from './pages/exception-question/exception-question.component';
import { ChipFilterPipe } from './services/chip-filter.pipe';
import { LookupDialogComponent } from './pages/lookup-dialog/lookup-dialog.component';
import { ReuseConfirmationDialogComponent } from './pages/reuse-confirmation-dialog/reuse-confirmation-dialog.component';
import { NewmericDirective } from './pages/directives/numbers.directives';
import { TwoDigitDecimaNumberDirective } from './pages/directives/twoDecimal.directives';
import { OneDigitDecimaNumberDirective } from './pages/directives/oneDecimal.directives';
import { DigitDirective } from './pages/directives/digit.directives';
import { DropdownCellRendererComponent } from './pages/renderer/dropdown-renderer.component';
import { CertificateRepositoryComponent } from './pages/certificate-repository/certificate-repository.component';
import { ReferenceComponent } from './pages/reference/reference.component';
import { CustomCertificateDetailsComponent } from './pages/renderer/custom-certificate-details.component';
import { NameConfirmationDialogComponent } from './pages/name-confirmation-dialog/name-confirmation-dialog.component';
import { SelectIdDialogComponent } from './pages/select-id-dialog/select-id-dialog.component';
// import { agGridTooltipComponent } from './pages/renderer/ag-grid-tooltip.component';


@NgModule({
  declarations: [
    DashboardComponent,
    MasterScreenComponent,
    GlobalSearchComponent,
    PiqReportComponent,
    ChipFilterPipe,
    PhotoRepositoryComponent,
    PrDialogComponent,
    ImageDialogComponent,
    ImageConfirmationDialogComponent,
    PIQLandingPageComponent,
    PIQSummaryComponent,
    ExceptionQuestionComponent,
    LookupDialogComponent,
    ReuseConfirmationDialogComponent,
    NewmericDirective,
    TwoDigitDecimaNumberDirective,
    OneDigitDecimaNumberDirective,
    DigitDirective,
    DropdownCellRendererComponent,
    CertificateRepositoryComponent,
    ReferenceComponent,
    CustomCertificateDetailsComponent,
    NameConfirmationDialogComponent,
    SelectIdDialogComponent,
    // agGridTooltipComponent
    
  ],
  imports: [
    DashboardRoutingModule,
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    PipesModule,
    SharedModule,
    MackModule,
    LayoutModule,
    AgGridModule,
    FormsModule
  ],
})
export class DashboardModule {}
