import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private generalNotificationMessage = new Subject<string>();
  private isLoading = new Subject<boolean>();

  constructor(private _dialog: MatDialog) { }

  getGeneralNotificationMessage() {
    return this.generalNotificationMessage.asObservable();
  }

  setGeneralNotificationMessage(msg: string) {
    this.generalNotificationMessage.next(msg);
  }

  getIsLoadingEvent() {
    return this.isLoading.asObservable();
  }

  setIsLoadingEvent(isLoading: boolean) {
    this.isLoading.next(isLoading);
  }

  confirm(title: string, message: string): Observable<boolean> {

    let dialogRef: MatDialogRef<ConfirmDialogComponent>;

    dialogRef = this._dialog.open(ConfirmDialogComponent, {
      panelClass: 'card-dialog',
      autoFocus: false
    });

    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;

    return dialogRef.afterClosed();
  }
}
