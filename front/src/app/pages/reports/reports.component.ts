import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ReportType } from 'src/app/components/report/report.component';
import { ConsumeService } from 'src/app/services/consume.service';
import { forkJoin, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})

export class ReportsComponent implements OnInit, OnDestroy {
  isLoading = false;
  subscriptions = new Subscription();
  reportName: string;
  displayedColumns: string[];
  dataSource = [];
  constructor(private _dataService: DataService,
    private _consumeService: ConsumeService, private _route: ActivatedRoute) {
    this._dataService.getIsLoadingEvent().subscribe(load => {
      this.isLoading = load;
    });
  }

  ngOnInit() {
    this.reportName = this._route.snapshot.paramMap.get('report');
    this.loadData(this.reportName);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  loadData(reportName: string) {
    this.subscriptions.add(this._consumeService.getReportDetailByType(reportName).subscribe(data => {
      this.dataSource = data.data;
    }));
    switch (reportName) {
      case 'final_close':
        this.displayedColumns = ['sucursal', 'name', 'till', 'date', 'opening',
          'closed', 'initial', 'final', 'transations', 'pendings',
          'consumed', 'errors', 'missing', 'delete'];
        break;
      case 'errors':
      case 'final_close':
        this.displayedColumns = ['sale', 'error', 'process', 'init', 'finish', 'times', 'delete'];
        break;
        break;
      case 'replications':
        this.displayedColumns = ['publiser', 'publiser-db', 'publication',
          'suscriber-name', 'status', 'last', 'sincronization','delete'];
        break;
      case 'queues':
        this.displayedColumns = ['sucursal', 'name', 'till', 'ip', 'version',
          'queue', 'message', 'delete'];
        break;
      default:
        console.log('No such name report exists!');
        break;
    }

  }

  delete(element: any) {
    this.subscriptions.add(this._dataService.confirm('¿Estás seguro?', 'Se eliminará el reporte!!!!')
      .subscribe(confirm => {
         if (confirm) {
          this._dataService.setIsLoadingEvent(true);
          this._consumeService.deleteReport(element._id.$oid, element).subscribe(res => {
                this.dataSource = this.dataSource.filter(x => x !== element);
                this._dataService.setIsLoadingEvent(false);
                this._dataService.setGeneralNotificationMessage(res.message);
          });
         }
      }));
  }
}
