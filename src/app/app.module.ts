import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularMaterialModule } from './core/modules/material/angular-material.module';
import { TokenInterceptor } from './core/services/interceptors/token.interceptor';
import { SharedModule } from './core/shared/shared.module';
import { AgGridMenuComponent } from './core/shared/ag-grid/ag-grid-menu.component';
import { AgGridChipComponent } from './core/shared/ag-grid/ag-grid-chip.components';
import { MackModule } from './core/modules/mack/mack.module';
import { AgGridLinkComponent } from './core/shared/ag-grid/ag-grid-link.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    AppComponent,
    AgGridMenuComponent,
    AgGridChipComponent,
    AgGridLinkComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    MackModule,
    SharedModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    MatButtonModule,
    MatTabsModule,
    MatSidenavModule,
    MatListModule,
    FormsModule,
    MatSelectModule,
    MatExpansionModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: CancellationInterceptor,
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
