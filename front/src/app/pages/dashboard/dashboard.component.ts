import { Component, OnInit } from '@angular/core';

import { Application } from '../../model/rest.model';
import { ConsumeService } from '../../services/consume.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  applications: Application[];

  constructor(private _dataService: DataService, private _consumeService: ConsumeService) { }

  ngOnInit() {
    this._dataService.setIsLoadingEvent(true);
    this._consumeService.getApplications().subscribe((res: Application[]) => {
      this.applications = res;
      this._dataService.setIsLoadingEvent(false);

    }, err => {
      this._dataService.setIsLoadingEvent(false);
      this._dataService.setGeneralNotificationMessage(err);
    });
  }
}
