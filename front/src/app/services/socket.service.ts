import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  listenStartChecking() {
    return this.socket
      .fromEvent('start checking');
  }
  listenFinishChecking() {
    return this.socket
      .fromEvent('finish checking');
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
