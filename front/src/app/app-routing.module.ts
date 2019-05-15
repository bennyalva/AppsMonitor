import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppListComponent } from './app-list/app-list.component';
import { ApplicationComponent } from './application/application.component';
import { DashboardComponent } from './dashboard/dashboard.component';

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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
