import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard.component'
import { PiqReportComponent } from './pages/piq-report/piq-report.component';
import { ModuleGuard } from 'src/app/core/guard/module.guard';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'piq-landing',
        canActivate: [ModuleGuard],
        loadChildren: () => import('./pages/piq-landing-page/piq-landing-page.module').then(m => m.PiqLandingPageModule)
      },
      {
        path: 'piq-report',
        component: PiqReportComponent,
   
      },

      { path: 'piq-report/:id', component: PiqReportComponent },
      { path: 'piq-report/:id/:type', component: PiqReportComponent },
      { path: 'piq-report/:id/:type/:loadType', component: PiqReportComponent },
      {
        path: '',
        redirectTo: 'piq-landing',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
