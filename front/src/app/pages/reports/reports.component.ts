import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ReportType } from 'src/app/components/report/report.component';
import { ConsumeService } from 'src/app/services/consume.service';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportsType: ReportType [] = [
    { name: 'final_close', title: 'Cierre', icon: 'reporte.png', affected: 0 },
    { name: 'errors', title: 'Bitacora', icon: 'bitacora.png', affected: 0},
    { name: 'replications', title: 'Replicación', icon: 'database.png', affected: 0},
    { name: 'queues', title: 'Queues', icon: 'queues.png', affected: 0},
  ];
  isLoading = false;
  constructor(private _dataService: DataService, private _consumeService: ConsumeService) {
    this._dataService.getIsLoadingEvent().subscribe(load => {
      this.isLoading = load;
    });
  }

  ngOnInit() {
    this.loadData();
    console.log('reports:: ', this.reportsType);
  }

  loadData() {
    const loadRports = forkJoin(this.reportsType.map(x => {
      return this._consumeService.getReportByType(x.name).pipe(
        tap(val => {
          x.affected = val.data.affected;
          // console.log('val:: ', val.data.affected);
        })
      );
    }));

    this._dataService.setIsLoadingEvent(true);
    forkJoin(loadRports).subscribe(() => {
      this._dataService.setIsLoadingEvent(false);
    });
  }
}
