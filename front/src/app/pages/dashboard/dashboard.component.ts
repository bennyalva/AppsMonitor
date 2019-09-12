import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Application, Client, AffectedClient, AffectedClientType } from '../../model/rest.model';
import { ConsumeService } from '../../services/consume.service';
import { DataService } from '../../services/data.service';
import { StatType } from 'src/app/components/stats/stats.component';
import { TreeComponent } from 'src/app/components/tree/tree.component';
import { tap } from 'rxjs/operators';
import { EMPTY, forkJoin } from 'rxjs';
import { interval, Subscription } from 'rxjs';
import { CdkObserveContent } from '@angular/cdk/observers';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit,OnDestroy {
  //@ViewChild(TreeComponent) treeComponent: TreeComponent;

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
  requestInterval = interval(10000);//10 se
  subscriptionToRequest: Subscription;
  newAffectedClients = new Array<[]>(1);
  constructor(private _dataService: DataService, private _consumeService: ConsumeService) {
    this._dataService.getIsLoadingEvent().subscribe(load => {
      this.isLoading = load;
    });
  }

  ngOnInit() {
    this.loadData();
    this.subscriptionToRequest = this.requestInterval.subscribe(val => this.loadData())
  }
  ngOnDestroy(){
    this.subscriptionToRequest.unsubscribe();
  }
  loadData() {
    console.log('se ejecuta load data')
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
        this.newAffectedClients[0]= val.data;
        //console.log('new clientsAffected:: ',this.newAffectedClients)
        this.newAffectedClients.forEach(data =>{
          console.log('cuantas: ', data)
        })
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
