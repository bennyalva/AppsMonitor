import { Component, OnInit, Input } from '@angular/core';
import { AffectedClientType } from 'src/app/model/rest.model';
import { DialogDetailComponent } from '../dialog-detail/dialog-detail.component';
import { MatDialog } from '@angular/material';
import { DataService } from 'src/app/services/data.service';
import { ConsumeService } from 'src/app/services/consume.service';

@Component({
  selector: 'app-client-status',
  templateUrl: './client-status.component.html',
  styleUrls: ['./client-status.component.css']
})
export class ClientStatusComponent implements OnInit {
  @Input() client: AffectedClientType;

  affected = 0;
  total = 0;

  constructor(private _dialog: MatDialog, private _dataService: DataService, private _consumeService: ConsumeService) { }

  ngOnInit() {
    if (this.client) {
      this.affected = this.client.applications.affected;
      this.total = this.client.applications.total;
    }
  }

  detail(type: string) {
    this._dataService.setIsLoadingEvent(true);
    this._consumeService.getAffectedAppsByClient(this.client.client).subscribe(res => {
    let filterClientType = res.data[0].applications.filter(applications => applications._id.type == type);

      this._dataService.setIsLoadingEvent(false);
     if(filterClientType.length > 0){
      this._dialog.open(DialogDetailComponent, {
        panelClass: ['card-dialog'],
        width: '630px',
        data: {
          client: filterClientType
        }
      });
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
}
