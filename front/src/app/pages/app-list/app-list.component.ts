import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { Application, Pagination } from '../../model/rest.model';
import { ConsumeService } from '../../services/consume.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.css']
})
export class AppListComponent implements OnInit {
  data: Application[] = [];
  resultsLength = 0;

  displayedColumns = ['application', 'description', 'sites', 'databases', 'services', 'servicebus', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _dataService: DataService, private _consumeService: ConsumeService, private _router: Router) { }

  ngOnInit() {
    this.setupPaginator();
  }

  setupPaginator() {
    this.paginator.pageSize = 10;

    this._dataService.setIsLoadingEvent(true);
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          const pagination = new Pagination();
          pagination.page = this.paginator.pageIndex;
          pagination.items = this.paginator.pageSize;
          return this._consumeService.getApplications(pagination);
        }),
        map(data => {
          this.resultsLength = data.total;
          return data.data;
        }),
        catchError((error) => {
          return throwError(error);
        })
      ).subscribe(data => {
        this.data = data;
        this._dataService.setIsLoadingEvent(false);
      }, err => {
        this._dataService.setIsLoadingEvent(false);
        this._dataService.setGeneralNotificationMessage(err);
      });
  }

  add() {
    this._router.navigate(['application']);
  }

  edit(element: Application) {
    this._router.navigate(['application'], { queryParams: { id: element._id.$oid } });
  }

  delete(element: Application) {
    this._dataService.setIsLoadingEvent(true);
    this._consumeService.deleteApplication(element._id.$oid).subscribe(res => {
      this._dataService.setIsLoadingEvent(false);
      this._dataService.setGeneralNotificationMessage(res);
      this.paginator.page.emit();
    }, err => {
      this._dataService.setIsLoadingEvent(false);
      this._dataService.setGeneralNotificationMessage(err);
    });
  }
}
