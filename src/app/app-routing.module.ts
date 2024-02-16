import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { ModuleGuard } from './core/guard/module.guard';

const routes: Routes = [
  {
    path: '',
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'sire',
    canActivate: [ModuleGuard],
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
