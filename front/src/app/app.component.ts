import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { MatIconRegistry, MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { interval,Subscription } from 'rxjs';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked {
  isLoading = false;
  secondsCounter = interval(50000);
  constructor(private _dataService: DataService, private _snackBar: MatSnackBar, private _domSanitizer: DomSanitizer,
    private _cdRef: ChangeDetectorRef, private _matIconRegistry: MatIconRegistry) {
    this._dataService.getIsLoadingEvent().subscribe(load => {
      this.isLoading = load;
    });
    
    this.registerCustomIcons();

    this._dataService
      .getGeneralNotificationMessage()
      .subscribe(msg => {
        this._snackBar.open(msg, 'OK', {
          panelClass: ['snack-bar-custom'],
          duration: 3000
        });
      });
  }

  ngAfterViewChecked() {
    this._cdRef.detectChanges();
    this.secondsCounter.subscribe(n =>{
      console.log('qhat n ::', n)
    })
  }

  registerCustomIcons() {
    this._matIconRegistry.addSvgIcon(
      'site',
      this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/img/icons/site.svg')
    );
    this._matIconRegistry.addSvgIcon(
      'database',
      this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/img/icons/database.svg')
    );
    this._matIconRegistry.addSvgIcon(
      'service',
      this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/img/icons/service.svg')
    );
    this._matIconRegistry.addSvgIcon(
      'servicebus',
      this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/img/icons/servicebus.svg')
    );
  }
}
