import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppListComponent } from './pages/app-list/app-list.component';
import { ApplicationComponent } from './pages/application/application.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'applications',
    component: AppListComponent
  },
  {
    path: 'application',
    component: ApplicationComponent
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
