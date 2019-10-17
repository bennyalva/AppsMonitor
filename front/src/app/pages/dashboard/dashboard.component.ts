import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Application, Client, AffectedClient, AffectedClientType } from '../../model/rest.model';
import { ConsumeService } from '../../services/consume.service';
import { DataService } from '../../services/data.service';
import { StatType } from 'src/app/components/stats/stats.component';
import { TreeComponent } from 'src/app/components/tree/tree.component';
import { tap } from 'rxjs/operators';
import { EMPTY, forkJoin } from 'rxjs';
import { Subscription } from 'rxjs';
import { CdkObserveContent } from '@angular/cdk/observers';
import { SocketService } from 'src/app/services/socket.service';
import { ReportType } from 'src/app/components/report/report.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  types: StatType[] = [
    { name: 'sites', title: 'Sitios', icon: 'site', affected: 0, total: 0 },
    { name: 'databases', title: 'Bases de datos', icon: 'database', affected: 0, total: 0 },
    { name: 'services', title: 'Servicios', icon: 'service', affected: 0, total: 0 },
    { name: 'servicebus', title: 'Service bus', icon: 'servicebus', affected: 0, total: 0 },
  ];

  reportsType: ReportType [] = [
    { name: 'final_close', title: 'Cierre', icon: 'reporte.png', affected: 0 },
    { name: 'errors', title: 'Bitacora', icon: 'bitacora.png', affected: 0},
    { name: 'replications', title: 'Replicación', icon: 'database.png', affected: 0},
    { name: 'queues', title: 'Queues', icon: 'queues.png', affected: 0},
  ];
  applications: Application[] = [];
  affectedClients: AffectedClient[] = [];
  affectedClientTypes: AffectedClientType[] = [];
  selectedClient;
  isLoading = false;
  statsAlerts = 0;
  statsApps = 0;
  subscriptions = new Subscription();
  newAffectedClients = new Array<[]>(1);
  constructor(private _dataService: DataService, private _consumeService: ConsumeService,
               private _socketService: SocketService, private router: Router
              ) {
    this._dataService.getIsLoadingEvent().subscribe(load => {
      this.isLoading = load;
    });

    this.subscriptions.add(this._socketService.listenFinishChecking().subscribe( dataFinish => {
       // console.log('data finish: ', dataFinish);
       this.loadData();
    }));
  }

  ngOnInit() {
    this.loadData();
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  loadData() {
    const loadStats = forkJoin(this.types.map(x => {
      return this._consumeService.getStatsByType(x.name).pipe(
        tap(val => {
          x.total = val.data.total;
          x.affected = val.data.affected;
        })
      );
    }));
    const loadReports = forkJoin(this.reportsType.map(x => {
      return this._consumeService.getReportByType(x.name).pipe(
        tap(val => {
          x.affected = val.data.affected;
          // console.log('val:: ', val.data.affected);
        })
      );
    }));
    const loadAffected = this._consumeService.getAffectedApps().pipe(
      tap(val => {
        this.statsApps = val.data.total;
      })
    );

    const loadAlerts = this._consumeService.getTotalAlerts().pipe(
      tap(val => {
        this.statsAlerts = val.data.total;
      })
    );

    const loadClients = this._consumeService.getAffectedClients().pipe(
      tap(val => {
        this.affectedClients = val.data;
        this.newAffectedClients[0] = val.data;
      })
    );

    const loadClientTypes = this._consumeService.getClientAffectedTypes().pipe(
      tap(val => {
        this.affectedClientTypes = val.data;
      })
    );

    this._dataService.setIsLoadingEvent(true);
    forkJoin(loadStats, loadAffected, loadAlerts, loadClients, loadClientTypes , loadReports).subscribe(() => {
      this._dataService.setIsLoadingEvent(false);
    });
  }

  detail(name: string) {
     console.log('name.. ', name)
     // tslint:disable-next-line: no-unused-expression
     this.router.navigate['/reports'];
  }
}
