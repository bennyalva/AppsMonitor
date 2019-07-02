import { Component, OnInit, Input } from '@angular/core';
import { Client } from 'src/app/model/rest.model';

@Component({
  selector: 'app-client-status',
  templateUrl: './client-status.component.html',
  styleUrls: ['./client-status.component.css']
})
export class ClientStatusComponent implements OnInit {
  @Input() client: Client;

  constructor() { }

  ngOnInit() {
  }

}
