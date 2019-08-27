import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ClientStatus } from 'src/app/model/rest.model';
import * as moment from 'moment';

@Component({
  selector: 'app-dialog-detail',
  templateUrl: './dialog-detail.component.html',
  styleUrls: ['./dialog-detail.component.css']
})
export class DialogDetailComponent implements OnInit {
  client: ClientStatus;

  constructor(public _dialogRef: MatDialogRef<DialogDetailComponent>, @Inject(MAT_DIALOG_DATA) private _data: any) {
    this.client = this._data.client;
  }

  ngOnInit() {
  }

  close() {
    this._dialogRef.close();
  }

  parseDate(date) {
    return moment(date).utc().format('YYYY-MM-DD HH:mm');
  }
}
