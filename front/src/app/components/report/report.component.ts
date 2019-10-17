import { Component, OnInit, Input } from '@angular/core';
export interface ReportType {
  name: string;
  title: string;
  icon: string;
  affected: number;
}
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  @Input() type: ReportType;
  constructor() {
  }

  ngOnInit() {
  }

}
