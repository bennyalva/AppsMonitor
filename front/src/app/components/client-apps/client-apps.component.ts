import { Component, OnInit, Input } from '@angular/core';
import { ClientApp } from 'src/app/model/rest.model';

@Component({
  selector: 'app-client-apps',
  templateUrl: './client-apps.component.html',
  styleUrls: ['./client-apps.component.css']
})
export class ClientAppsComponent implements OnInit {
  @Input() applications: ClientApp[];

  displayedColumns = ['application', 'databases', 'sites', 'services', 'servicebus', 'admins', 'actions'];

  constructor() { }

  ngOnInit() {
  }

}
