import { Component, OnInit, Input } from '@angular/core';
import { ClientApp, Client } from 'src/app/model/rest.model';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ConsumeService } from 'src/app/services/consume.service';

@Component({
  selector: 'app-client-apps',
  templateUrl: './client-apps.component.html',
  styleUrls: ['./client-apps.component.css']
})
export class ClientAppsComponent implements OnInit {
  @Input() client: Client;
  @Input() applications: ClientApp[];

  displayedColumns = ['application', 'databases', 'sites', 'services', 'servicebus', 'admins', 'actions'];

  constructor(private _router: Router, private _dataService: DataService, private _consumeService: ConsumeService) { }

  ngOnInit() {
  }

  add() {
    this._router.navigate(['application'], {
      queryParams: {
        cli: this.client._id.client
      }
    });
  }

  edit(app: ClientApp) {
    this._router.navigate(['application'], {
      queryParams: {
        cli: this.client._id.client,
        app: app.application
      }
    });
  }

  delete(app: ClientApp) {
    this._dataService.confirm('¿Estás seguro?', 'Se eliminará la aplicación seleccionada y todos sus elementos')
      .subscribe(confirm => {
        if (confirm) {
          this._dataService.setIsLoadingEvent(true);
          this._consumeService.deleteApplication(this.client._id.client, app.application.application).subscribe(res => {
            this.applications = this.applications.filter(x => x !== app);
            this._dataService.setIsLoadingEvent(false);
            this._dataService.setGeneralNotificationMessage(res.message);
          }, err => {
            this._dataService.setIsLoadingEvent(false);
            this._dataService.setGeneralNotificationMessage(err);
          });
        }
      });
  }
}
