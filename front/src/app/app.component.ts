import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { DataService } from './services/data.service';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked {
  isLoading = false;

  constructor(private _dataService: DataService, private _snackBar: MatSnackBar, private _cdRef: ChangeDetectorRef,
    private rxStompService: RxStompService) {
    this._dataService.getIsLoadingEvent().subscribe(load => {
      this.isLoading = load;
    });

    this._dataService
      .getGeneralNotificationMessage()
      .subscribe(msg => {
        this._snackBar.open(msg, 'OK', {
          duration: 3000
        });
      });

    this.rxStompService.watch('/queue/apps-monitor').subscribe((message: Message) => {
      console.log('RECIEVED MESSAGE: ', message.body);
    });
  }

  ngAfterViewChecked() {
    this._cdRef.detectChanges();
  }
}
