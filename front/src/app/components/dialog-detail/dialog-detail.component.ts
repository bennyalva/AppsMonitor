import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ClientApp, Client } from 'src/app/model/rest.model';

@Component({
  selector: 'app-dialog-detail',
  templateUrl: './dialog-detail.component.html',
  styleUrls: ['./dialog-detail.component.css']
})
export class DialogDetailComponent implements OnInit {
  client: Client;
  application: ClientApp;

  constructor(public _dialogRef: MatDialogRef<DialogDetailComponent>, @Inject(MAT_DIALOG_DATA) private _data: any) {
    this.client = this._data.client;
    // this.application = this._data.application;
    this.application = this.client.applications[0];
  }

  ngOnInit() {
  }

  close() {
    this._dialogRef.close();
  }
}
