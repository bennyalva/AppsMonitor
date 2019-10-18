import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  listenStartChecking() {
    return this.socket
      .fromEvent('startChecking');
  }
  listenFinishChecking() {
    return this.socket
      .fromEvent('finishChecking');
  }

  listenNewReport() {
    return this.socket
      .fromEvent('newReport');
  }

  listenAfterToConnect() {
    return this.socket
    .fromEvent('after connect');

  }
}
