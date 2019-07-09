import { Component, OnInit, Input } from '@angular/core';
import { Client } from 'src/app/model/rest.model';
import { DialogDetailComponent } from '../dialog-detail/dialog-detail.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-client-status',
  templateUrl: './client-status.component.html',
  styleUrls: ['./client-status.component.css']
})
export class ClientStatusComponent implements OnInit {
  @Input() client: Client;

  constructor(private _dialog: MatDialog) { }

  ngOnInit() {
  }

  detail() {
    this._dialog.open(DialogDetailComponent, {
      panelClass: ['card-dialog'],
      width: '630px',
      data: {
        client: this.client
      }
    });
  }
}
