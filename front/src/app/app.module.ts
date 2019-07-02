import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntl } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppMaterialModule } from './app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogFormComponent } from './components/dialog-form/dialog-form.component';
import { SystemChartComponent } from './components/system-chart/system-chart.component';
import { AppListComponent } from './pages/app-list/app-list.component';
import { ApplicationComponent } from './pages/application/application.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ConsumeService } from './services/consume.service';
import { DataService } from './services/data.service';
import { PaginatorService } from './services/paginator.service';
import { RestInterceptor } from './utils/rest.interceptor';
import { ClientListComponent } from './pages/client-list/client-list.component';
import { ClientAppsComponent } from './components/client-apps/client-apps.component';
import { StatsComponent } from './components/stats/stats.component';
import { TreeComponent } from './components/tree/tree.component';
import { AppStatusComponent } from './components/app-status/app-status.component';
import { ClientStatusComponent } from './components/client-status/client-status.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SystemChartComponent,
    ApplicationComponent,
    AppListComponent,
    DialogFormComponent,
    ClientListComponent,
    ClientAppsComponent,
    StatsComponent,
    TreeComponent,
    AppStatusComponent,
    ClientStatusComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppMaterialModule,
    NgxChartsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    DataService,
    ConsumeService,
    {
      provide: MatPaginatorIntl,
      useClass: PaginatorService
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RestInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogFormComponent
  ]
})
export class AppModule { }
