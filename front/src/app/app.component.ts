import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked {
  isLoading = false;

  constructor(private _dataService: DataService, private _snackBar: MatSnackBar, private _cdRef: ChangeDetectorRef) {
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
  }

  ngAfterViewChecked() {
    this._cdRef.detectChanges();
  }
}
