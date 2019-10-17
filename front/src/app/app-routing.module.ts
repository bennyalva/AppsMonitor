import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApplicationComponent } from './pages/application/application.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientListComponent } from './pages/client-list/client-list.component';
import { ReportsComponent } from './pages/reports/reports.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'application',
    component: ApplicationComponent
  },
  {
    path: 'config',
    component: ClientListComponent
  },
  {
    path: 'reports',
    component: ReportsComponent
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
