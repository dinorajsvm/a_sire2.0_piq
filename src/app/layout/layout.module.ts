import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../core/modules/material/angular-material.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { AlertsNotificationComponent } from './alerts-notification/alerts-notification.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
@NgModule({
  declarations: [SidebarComponent, NavbarComponent, AlertsNotificationComponent, NotificationsComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    PipesModule
  ],
  exports: [SidebarComponent, NavbarComponent]
})
export class LayoutModule { }
