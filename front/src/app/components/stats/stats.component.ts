import { Component, OnInit, Input } from '@angular/core';


export interface StatType {
  name: string;
  title: string;
  icon: string;
  affected: number;
  total: number;
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  @Input() type: StatType;

  constructor() { }

  ngOnInit() {
  }

  getPercentage() {
    if (this.type.total === 0) {
      return 0;
    }
    return (this.type.affected / this.type.total * 100).toFixed(0);
  }
}
