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
import { GlobalSearchComponent } from './pages/global-search/global-search.component';
import { PiqReportComponent } from './pages/piq-report/piq-report.component';
import { PhotoRepositoryComponent } from './pages/photo-repository/photo-repository.component';
import { PrDialogComponent } from './pages/pr-dialog/pr-dialog.component';
import { ImageDialogComponent } from './pages/image-dialog/image-dialog.component';
import { ImageConfirmationDialogComponent } from './pages/image-confirmation-dialog/image-confirmation-dialog.component';
import { PIQSummaryComponent } from './pages/piqsummary/piqsummary.component';
import { ExceptionQuestionComponent } from './pages/exception-question/exception-question.component';
import { ChipFilterPipe } from './services/chip-filter.pipe';
import { LookupDialogComponent } from './pages/lookup/lookup-dialog/lookup-dialog.component';
import { ReuseConfirmationDialogComponent } from './pages/reuse-confirmation-dialog/reuse-confirmation-dialog.component';
import { NewmericDirective } from './pages/directives/numbers.directives';
import { TwoDigitDecimaNumberDirective } from './pages/directives/twoDecimal.directives';
import { OneDigitDecimaNumberDirective } from './pages/directives/oneDecimal.directives';
import { DigitDirective } from './pages/directives/digit.directives';
import { CertificateRepositoryComponent } from './pages/certificate-repository/certificate-repository.component';
import { ReferenceComponent } from './pages/reference/reference.component';
import { NameConfirmationDialogComponent } from './pages/name-confirmation-dialog/name-confirmation-dialog.component';
import { SelectIdDialogComponent } from './pages/select-id-dialog/select-id-dialog.component';
import { MocComponent } from './pages/lookup/moc/moc.component';
import { PscComponent } from './pages/lookup/psc/psc.component';
import { VesselSelectionDialogComponent } from './pages/vessel-selection-dialog/vessel-selection-dialog.component';
import { PercentageDirective } from './pages/directives/percentage.directives';
import { TMSAComponent } from './pages/lookup/tmsa/tmsa.component';
import { selectSearchPipe } from './services/select-search-filter.pipe';

import { SafetyManagementComponent } from './pages/lookup/safety-management/safety-management.component';
import { DateRendererComponent } from './pages/renderer/date-renderer.component';
import { DDCellRendererComponent } from './pages/renderer/dd-renderer.component';
import { PmsLookupComponent } from './pages/lookup/pms-lookup/pms-lookup.component';
import { ManualLookUpComponent } from './pages/lookup/manual-look-up/manual-look-up.component';
import { selectSearchVslPipe } from './services/select-search-vsl-filter.pipe';
import { UnsaveConfirmationDialogPopupComponent } from './pages/unsave-confirmation-dialog-popup/unsave-confirmation-dialog-popup.component';
import { ConfirmationDialogPopupComponent } from './pages/confirmation-dialog-popup/confirmation-dialog-popup.component';
import { NumberSpecDirective } from './pages/directives/numberSpec.directives';
import { SwitchVesselTypeComponent } from './pages/switch-vessel-type/switch-vessel-type.component';
import { ExceptionRemarkComponent } from './pages/exception-remark/exception-remark.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MatBadgeModule } from '@angular/material/badge';
import { AlphanumericDirective } from './pages/directives/alphanumeric.directive';

@NgModule({
  declarations: [
    DashboardComponent,
    GlobalSearchComponent,
    PiqReportComponent,
    ChipFilterPipe,
    selectSearchPipe,
    selectSearchVslPipe,
    PhotoRepositoryComponent,
    PrDialogComponent,
    ImageDialogComponent,
    ImageConfirmationDialogComponent,
    PIQSummaryComponent,
    ExceptionQuestionComponent,
    LookupDialogComponent,
    ReuseConfirmationDialogComponent,
    NewmericDirective,
    NumberSpecDirective,
    TwoDigitDecimaNumberDirective,
    OneDigitDecimaNumberDirective,
    DigitDirective,
    PercentageDirective,
    AlphanumericDirective,
    DDCellRendererComponent,
    CertificateRepositoryComponent,
    ReferenceComponent,
    NameConfirmationDialogComponent,
    SelectIdDialogComponent,
    MocComponent,
    PscComponent,
    VesselSelectionDialogComponent,
    TMSAComponent,
    SafetyManagementComponent,
    DateRendererComponent,
    PmsLookupComponent,
    ManualLookUpComponent,
    UnsaveConfirmationDialogPopupComponent,
    ConfirmationDialogPopupComponent,
    SwitchVesselTypeComponent,
    ExceptionRemarkComponent,
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
    MatBadgeModule,
    FormsModule,
    NgxDaterangepickerMd.forRoot(),
  ],
  exports: [AngularMaterialModule],
})
export class DashboardModule {}
