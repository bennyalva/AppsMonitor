import { Component, OnInit, Input } from '@angular/core';
import { ClientApp } from 'src/app/model/rest.model';

@Component({
  selector: 'app-app-status',
  templateUrl: './app-status.component.html',
  styleUrls: ['./app-status.component.css']
})
export class AppStatusComponent implements OnInit {
  @Input() application: ClientApp;

  constructor() { }

  ngOnInit() {
  }

}
