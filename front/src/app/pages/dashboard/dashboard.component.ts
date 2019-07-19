import { Component, OnInit, ViewChild } from '@angular/core';

import { Application, Client, AffectedClient, AffectedClientType } from '../../model/rest.model';
import { ConsumeService } from '../../services/consume.service';
import { DataService } from '../../services/data.service';
import { StatType } from 'src/app/components/stats/stats.component';
import { TreeComponent } from 'src/app/components/tree/tree.component';
import { tap } from 'rxjs/operators';
import { EMPTY, forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(TreeComponent) treeComponent: TreeComponent;

  types: StatType[] = [
    { name: 'sites', title: 'Sitios', icon: 'site', affected: 0, total: 0 },
    { name: 'databases', title: 'Bases de datos', icon: 'database', affected: 0, total: 0 },
    { name: 'services', title: 'Servicios', icon: 'service', affected: 0, total: 0 },
    { name: 'servicebus', title: 'Service bus', icon: 'servicebus', affected: 0, total: 0 },
  ];
  applications: Application[] = [];
  affectedClients: AffectedClient[] = [];
  affectedClientTypes: AffectedClientType[] = [];
  selectedClient;
  isLoading = false;
  statsAlerts = 0;
  statsApps = 0;

  constructor(private _dataService: DataService, private _consumeService: ConsumeService) {
    this._dataService.getIsLoadingEvent().subscribe(load => {
      this.isLoading = load;
    });
  }

  ngOnInit() {
    this.loadData();
    // this._dataService.setIsLoadingEvent(true);
    // this._consumeService.getClientsAppsEvents().subscribe(x => {
    //   this._dataService.setIsLoadingEvent(false);
    //   this.clients = x.data;
    //   this.treeComponent.clients.next(x.data);
    //   this.buildStats();
    //   if (this.clients.length > 0) {
    //     this.selectedClient = this.clients[0];
    //   }
    // }, err => {
    //   this._dataService.setIsLoadingEvent(false);
    //   this._dataService.setGeneralNotificationMessage(err);
    // });

    // this._consumeService.getApplications().subscribe(res => {
    //   this.applications = res.data;
    //   this._dataService.setIsLoadingEvent(false);
    // }, err => {
    //   this._dataService.setIsLoadingEvent(false);
    //   this._dataService.setGeneralNotificationMessage(err);
    // });
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
        this.treeComponent.clients.next(val.data);
      })
    );

    const loadClientTypes = this._consumeService.getClientAffectedTypes().pipe(
      tap(val => {
        this.affectedClientTypes = val.data;
      })
    );

    this._dataService.setIsLoadingEvent(true);
    forkJoin(loadStats, loadAffected, loadAlerts, loadClients, loadClientTypes).subscribe(() => {
      this._dataService.setIsLoadingEvent(false);
    });
  }
}
