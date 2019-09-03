import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ClientStatus, NewClientStatus } from 'src/app/model/rest.model';
import * as moment from 'moment';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-dialog-detail',
  templateUrl: './dialog-detail.component.html',
  styleUrls: ['./dialog-detail.component.css']
})
export class DialogDetailComponent implements OnInit {
  client: NewClientStatus;
  type: string;
  sizeArray: number;
  constructor(public _dialogRef: MatDialogRef<DialogDetailComponent>, @Inject(MAT_DIALOG_DATA) private _data: any) {
    this.client = this._data;
    this.type = this.client.client[0]._id.type;
    this.sizeArray = this.client.client.length;
    //console.log('type:  ',this.type)
    /*this.client.client.forEach(element => {
      //console.log('what:::,',element)
      element.errors.forEach(other => {
        console.log('other:. ',this.parseDate(other.firstDate))
      })
    })*/
   
  }

  ngOnInit() {
  }

  close() {
    this._dialogRef.close();
  }

  parseDate(date) {
    //console.log('whtach loop:: ')
    return moment(date).utc().format('YYYY-MM-DD HH:mm');
  }
}
