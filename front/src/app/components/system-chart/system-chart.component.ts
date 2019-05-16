import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

import { Application } from '../../model/rest.model';
import { ConsumeService } from '../../services/consume.service';

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

  constructor(private _consumeService: ConsumeService) { }

  yAxisTickFormatting(val) {
    return val === 1 ? 'up' : 'down';
  }

  ngOnInit() {
    this.isLoading = true;
    this.title = this.application.application;

    this._consumeService.getLatestEvents(this.application.application).subscribe(res => {
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
              name: moment(y.datetime.$date).format('HH:mm'),
              value: y.status ? 1 : 0
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
