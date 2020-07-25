import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable()
export class ChatService {

  private socket = io('http://localhost:3000');

  newUser(data) {
      this.socket.emit('new user', data);
  }

  joinRoom(data) {
      this.socket.emit('new room', data);
  }

  newUserJoined()
  {
      const observable = new Observable<string[]>(observer => {
        this.socket.on('new user connected', (data) => {
          observer.next(data);
        });
        return () => {this.socket.disconnect(); }
      });

      return observable;
  }

  leaveRoom(data){
      this.socket.emit('leave', data);
  }

  userLeftRoom(){
      const observable = new Observable<{user: string, message: string}>(observer => {
          this.socket.on('left room', (data) => {
              observer.next(data);
          });
          return () => {this.socket.disconnect(); }
      });

      return observable;
  }

  sendMessage(data)
  {
      this.socket.emit('message',data);
  }

  newMessageReceived(){
      const observable = new Observable<{user: string, message: string}>(observer => {
          this.socket.on('new message', (data) => {
              observer.next(data);
          });
          return () => {this.socket.disconnect(); }
      });

      return observable;
  }
}
