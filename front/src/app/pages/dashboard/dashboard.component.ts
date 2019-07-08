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
    { name: 'sites', title: 'Sitios', icon: 'dns', affected: 0, total: 0 },
    { name: 'databases', title: 'Bases de datos', icon: 'dns', affected: 0, total: 0 },
    { name: 'services', title: 'Servicios', icon: 'dns', affected: 0, total: 0 },
    { name: 'servicebus', title: 'Service bus', icon: 'dns', affected: 0, total: 0 },
  ];
  applications: Application[] = [];
  clients: Client[] = [];
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
    this._dataService.setIsLoadingEvent(true);
    this._consumeService.getClients().subscribe(x => {
      this.clients = x.data;
      this.treeComponent.clients.next(x.data);
      if (this.clients.length > 0) {
        this.selectedClient = this.clients[0];
      }
    });
    this._consumeService.getApplications().subscribe(res => {
      this.applications = res.data;
      this._dataService.setIsLoadingEvent(false);
    }, err => {
      this._dataService.setIsLoadingEvent(false);
      this._dataService.setGeneralNotificationMessage(err);
    });
  }
}
