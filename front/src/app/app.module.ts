import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntl } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppListComponent } from './pages/app-list/app-list.component';
import { AppMaterialModule } from './app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApplicationComponent } from './pages/application/application.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ConsumeService } from './services/consume.service';
import { DataService } from './services/data.service';
import { PaginatorService } from './services/paginator.service';
import { SystemChartComponent } from './components/system-chart/system-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SystemChartComponent,
    ApplicationComponent,
    AppListComponent
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
