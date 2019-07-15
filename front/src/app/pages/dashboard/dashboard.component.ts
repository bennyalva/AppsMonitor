import { Component, OnInit, ViewChild } from '@angular/core';

import { Application, Client } from '../../model/rest.model';
import { ConsumeService } from '../../services/consume.service';
import { DataService } from '../../services/data.service';
import { StatType } from 'src/app/components/stats/stats.component';
import { TreeComponent } from 'src/app/components/tree/tree.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(TreeComponent) treeComponent: TreeComponent;

  types: StatType[] = [
    // { name: 'sites', title: 'Sitios', icon: 'site', affected: 0, total: 0 },
    // { name: 'databases', title: 'Bases de datos', icon: 'dns', affected: 0, total: 0 },
    // { name: 'services', title: 'Servicios', icon: 'dns', affected: 0, total: 0 },
    // { name: 'servicebus', title: 'Service bus', icon: 'dns', affected: 0, total: 0 },
  ];
  applications: Application[] = [];
  clients: Client[] = [];
  selectedClient;
  isLoading = true;
  statsAlerts = 0;
  statsApps = 0;

  constructor(private _dataService: DataService, private _consumeService: ConsumeService) {
    this._dataService.getIsLoadingEvent().subscribe(load => {
      this.isLoading = load;
    });
  }

  ngOnInit() {
    this._dataService.setIsLoadingEvent(true);
    this._consumeService.getClientsAppsEvents().subscribe(x => {
      this._dataService.setIsLoadingEvent(false);
      this.clients = x.data;
      this.treeComponent.clients.next(x.data);
      this.buildStats();
      if (this.clients.length > 0) {
        this.selectedClient = this.clients[0];
      }
    }, err => {
      this._dataService.setIsLoadingEvent(false);
      this._dataService.setGeneralNotificationMessage(err);
    });
    // this._consumeService.getApplications().subscribe(res => {
    //   this.applications = res.data;
    //   this._dataService.setIsLoadingEvent(false);
    // }, err => {
    //   this._dataService.setIsLoadingEvent(false);
    //   this._dataService.setGeneralNotificationMessage(err);
    // });
  }

  buildStats() {
    // let allEvents = this.clients.map(x => x.applications).reduce((a, b) => a.concat(b)).map(x => x.events).reduce((a, b) => a.concat(b));
    // console.log(allEvents);
    this.types = this.types.concat({
      name: 'sites',
      title: 'Sitios',
      icon: 'site',
      affected: this.clients.map(x => x.applications).reduce((a, b) => a.concat(b))
        .filter(x => x.events.filter(y => y.type === 'sites').length > 0 && x.sites.length > 0).length,
      total: this.clients.map(x => x.applications).reduce((a, b) => a.concat(b)).map(x => x.sites.length).reduce((a, b) => a + b)
    }).concat(
      {
        name: 'databases',
        title: 'Bases de datos',
        icon: 'database',
        affected: this.clients.map(x => x.applications).reduce((a, b) => a.concat(b))
          .filter(x => x.events.filter(y => y.type === 'databases').length > 0 && x.databases.length > 0).length,
        total: this.clients.map(x => x.applications).reduce((a, b) => a.concat(b)).map(x => x.databases.length).reduce((a, b) => a + b)
      }
    ).concat(
      {
        name: 'services',
        title: 'Servicios',
        icon: 'service',
        affected: this.clients.map(x => x.applications).reduce((a, b) => a.concat(b))
          .filter(x => x.events.filter(y => y.type === 'services').length > 0 && x.services.length > 0).length,
        total: this.clients.map(x => x.applications).reduce((a, b) => a.concat(b)).map(x => x.services.length).reduce((a, b) => a + b)
      }
    ).concat(
      {
        name: 'servicebus',
        title: 'Service bus',
        icon: 'servicebus',
        affected: this.clients.map(x => x.applications).reduce((a, b) => a.concat(b))
          .filter(x => x.events.filter(y => y.type === 'servicebus').length > 0 && x.servicebus.length > 0).length,
        total: this.clients.map(x => x.applications).reduce((a, b) => a.concat(b)).map(x => x.servicebus.length).reduce((a, b) => a + b)
      }
    );

    this.statsAlerts = this.clients.map(x => x.applications).reduce((a, b) => a.concat(b))
      .map(x => x.events.length).reduce((a, b) => a + b);

    this.statsApps = this.clients.map(x => x.applications).reduce((a, b) => a.concat(b)).filter(x => x.events.length > 0).length;
  }
}
