import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { iif, of, throwError, Subscription } from 'rxjs';
import { concatMap, delay, repeatWhen, retryWhen } from 'rxjs/operators';

import { Application } from '../../model/rest.model';
import { ConsumeService } from '../../services/consume.service';

const REQ_INTERVAL = 60000;
const REQ_RETRIES = 10;

@Component({
  selector: 'app-system-chart',
  templateUrl: './system-chart.component.html',
  styleUrls: ['./system-chart.component.css']
})
export class SystemChartComponent implements OnInit {
  @Input() application: Application;
  isLoading = false;
  title: string;
  error: string;

  data: any[] = [];
  view: any[] = undefined;

  yAxisLabel = 'Estatus';
  xAxisLabel = 'Hora';
  yAxisTicks = [0, 1];
  yScaleMin = 0;
  yScaleMax = 1;

  subscription: Subscription;

  constructor(private _consumeService: ConsumeService) { }

  yAxisTickFormatting(val) {
    return val === 1 ? 'up' : 'down';
  }

  ngOnInit() {
    this.title = this.application.application;
    this.loadData();
  }

  reload() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.subscription = this._consumeService.getLatestEvents(this.application.application)
      .pipe(
        repeatWhen(completed => completed.pipe(
          delay(REQ_INTERVAL)).pipe(
            // tap(() => { this.isLoading = true; })
          )
        ),
        retryWhen(error => error.pipe(
          concatMap((e, i) =>
            iif(
              () => i > REQ_RETRIES,
              throwError(e),
              of(e).pipe(delay(REQ_INTERVAL))
            )
          )
        )))
      .subscribe(res => {
        this.isLoading = false;
        this.data = [];

        const types = res.data.map(x => x.type).filter(function (elem, index, self) {
          return index === self.indexOf(elem);
        });

        types.forEach(t => {
          this.data.push({
            name: t,
            series: res.data.filter(x => x.type === t).map(y => {
              return {
                name: moment(y.datetime.$date).utc().format('HH:mm'),
                value: y.status ? 1 : 0,
                response: y.status_response
              };
            })
          });
        });
      }, err => {
        this.isLoading = false;
        this.error = err;
      });
  }
}
