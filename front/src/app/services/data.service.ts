import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private generalNotificationMessage = new Subject<string>();
  private isLoading = new Subject<boolean>();

  constructor() { }

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
}
