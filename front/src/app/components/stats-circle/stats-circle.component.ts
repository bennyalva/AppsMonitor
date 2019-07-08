import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stats-circle',
  templateUrl: './stats-circle.component.html',
  styleUrls: ['./stats-circle.component.css']
})
export class StatsCircleComponent implements OnInit {
  @Input() title: string;
  @Input() count: number;

  constructor() { }

  ngOnInit() {
  }

}
