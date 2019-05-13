import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-system-chart',
  templateUrl: './system-chart.component.html',
  styleUrls: ['./system-chart.component.css']
})
export class SystemChartComponent implements OnInit {
  multi: any[] = [
    {
      name: 'sites',
      series: [
        {
          name: '11:00',
          value: 1
        },
        {
          name: '12:00',
          value: 1
        },
        {
          name: '13:00',
          value: 0
        },
        {
          name: '14:00',
          value: 0
        },
        {
          name: '15:00',
          value: 1
        },
        {
          name: '16:00',
          value: 1
        },
      ]
    },
    {
      name: 'databases',
      series: [
        {
          name: '11:00',
          value: 0
        },
        {
          name: '12:00',
          value: 0
        },
        {
          name: '13:00',
          value: 1
        },
        {
          name: '14:00',
          value: 1
        },
        {
          name: '15:00',
          value: 1
        },
        {
          name: '16:00',
          value: 1
        },
      ]
    }
  ];

  view: any[] = undefined;

  // options
  legendTitle = 'Cinépolis System';
  yAxisLabel = 'Cinépolis System';
  xAxisLabel = 'Hora';
  yAxisTicks = [0, 1];

  // line, area
  yScaleMin = 0;
  yScaleMax = 1;

  constructor() { }

  yAxisTickFormatting(val) {
    return val === 1 ? 'up' : 'down';
  }

  ngOnInit() {
  }
}
