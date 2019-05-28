import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import * as shape from 'd3-shape';
import * as moment from 'moment';
import { iif, of, Subscription, throwError } from 'rxjs';
import { concatMap, delay, repeatWhen, retryWhen } from 'rxjs/operators';

import { Application } from '../../model/rest.model';
import { ConsumeService } from '../../services/consume.service';

const REQ_INTERVAL = 60000;
const REQ_RETRIES = 2;

@Component({
  selector: 'app-system-chart',
  templateUrl: './system-chart.component.html',
  styleUrls: ['./system-chart.component.css']
})
export class SystemChartComponent implements OnInit, OnDestroy {
  @Input() application: Application;
  isLoading = false;
  title: string;
  error: string;

  events: any[] = [];
  data: any[] = [];
  types: string[] = ['sites', 'databases', 'services', 'servicebus'];
  selectedType;
  view: any[] = undefined;

  yAxisLabel = 'Estatus';
  xAxisLabel = 'Hora';
  yAxisTicks = [-1, 1];
  yScaleMin = -1.1;
  yScaleMax = 1.1;
  curve = shape.curveStepAfter;

  subscription: Subscription;

  constructor(private _consumeService: ConsumeService) { }

  ngOnInit() {
    this.title = this.application.application;
    this.selectedType = this.types[0];
    this.loadData();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  yAxisTickFormatting(val) {
    return val === 1 ? 'up' : (val === -1 ? 'down' : '');
  }

  changeType() {
    this.reload();
  }

  buildChartData() {
    this.data = [];

    const typeEvents = this.events.filter(x => x.type === this.selectedType);
    const names = typeEvents.map(x => x.name).filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });

    names.forEach(name => {
      this.data.push({
        name: name,
        series: typeEvents.filter(x => x.name === name).sort((n1, n2) => n1.datetime.$date - n2.datetime.$date).map(y => {
          return {
            name: moment(y.datetime.$date).utc().format('DD-MM HH:mm'),
            value: y.status ? 1 : -1,
            response: y.status_response
          };
        })
      });
    });
  }

  reload() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.error = null;

    this.subscription = this._consumeService.getLatestEvents(this.application.application, this.selectedType)
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
              of(e).pipe(delay(3000))
            )
          )
        )))
      .subscribe(res => {
        this.isLoading = false;
        this.events = res.data;
        this.buildChartData();
      }, err => {
        this.isLoading = false;
        this.error = err;
      });
  }
}
