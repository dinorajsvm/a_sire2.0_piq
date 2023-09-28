import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Roles } from './core/mgntDBconstants';
import { mgntdbGuard } from './core/guard/mgntDb.guard';
import { GuestGuard } from './core/guard/guest.guard';
import { AuthGuard } from './core/guard/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    canLoad: [GuestGuard],
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'sire',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: '',
    redirectTo: 'sire',
    pathMatch: 'full',
  },
  {
    path: '404',
    loadChildren: () =>
      import('./core/modules/not-found/not-found.module').then(
        (m) => m.NotFoundModule
      ),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // initialNavigation: 'enabled',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
