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

  affected = 0;
  total = 0;

  constructor(private _dialog: MatDialog) { }

  ngOnInit() {
    if (this.client) {
      this.affected = this.client.applications.filter(x => x.events.length > 0).length;
      this.total = this.client.applications.length;
    }
  }

  detail() {
    this._dialog.open(DialogDetailComponent, {
      panelClass: ['card-dialog'],
      width: '630px',
      data: {
        client: this.client
      }
    });
  }

  getPercentage() {
    if (this.total === 0) {
      return 100;
    }
    if (this.total === this.affected) {
      return 0;
    }
    return (this.affected / this.total * 100).toFixed(0);
  }

  getCountByType(type: string) {
    let affected = [];
    switch (type) {
      case 'site':
        affected = this.client.applications.map(x => x.events.filter(y => y.type === 'sites'))
          .reduce((a, b) => a.concat(b)).map(x => x.name).filter(this.onlyUnique);
        return affected.length;
      case 'database':
        affected = this.client.applications.map(x => x.events.filter(y => y.type === 'databases'))
          .reduce((a, b) => a.concat(b)).map(x => x.name).filter(this.onlyUnique);
        return affected.length;
      case 'service':
        affected = this.client.applications.map(x => x.events.filter(y => y.type === 'services'))
          .reduce((a, b) => a.concat(b)).map(x => x.name).filter(this.onlyUnique);
        return affected.length;
      case 'servicebus':
        affected = this.client.applications.map(x => x.events.filter(y => y.type === 'servicebus'))
          .reduce((a, b) => a.concat(b)).map(x => x.name).filter(this.onlyUnique);
        return affected.length;
      default:
        return 0;
    }
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
}
