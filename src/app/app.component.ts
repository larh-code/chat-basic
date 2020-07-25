import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ChatService]
})
export class AppComponent implements OnInit {

  userNew = '';
  msj = '';
  user: string = null;
  currencyRoom = null;
  users: string[] = [];
  rooms = new Map();
  messages = [];

  constructor(private chatS: ChatService) {
    this.chatS.newUserJoined().subscribe((users) => {
      console.log(users);
      this.users = users;
    });
    this.chatS.newMessageReceived().subscribe((data) => {
      console.log(data);
      this.addMessage(data);
    });
  }

  ngOnInit() {}

  addNewUser() {
    this.user = this.userNew;
    this.chatS.newUser({user: this.userNew});
    this.userNew = '';
  }

  selectChat(user: string) {
    this.currencyRoom = {
      room: this.sortNameRoom(user.toLocaleLowerCase().trim()),
      userRoom: user
    };
    this.messages = [];
    if (!this.rooms.get(this.currencyRoom.room)) {
      this.rooms.set(this.currencyRoom.room, []);
    } else {
      this.messages = this.rooms.get(this.currencyRoom.room);
    }
    this.chatS.joinRoom({room: this.currencyRoom.room});
  }

  addMessage(message) {
    if (message.room === this.currencyRoom.room) {
      this.messages.push(message);
      this.rooms.set(this.currencyRoom.room, this.messages);
    } else {
      const msj = this.rooms.get(message.room);
      msj.push(message);
      this.rooms.set(message.room, msj);
    }
  }

  sendMessage() {
    const data = {
      room: this.currencyRoom.room,
      user: this.user,
      message: this.msj
    };
    this.msj = '';
    this.chatS.sendMessage(data);
  }

  isSame(name) {
    if (this.user && name.toLocaleLowerCase().trim() === this.user.toLocaleLowerCase().trim()) {
      return false;
    } else return true;
  }

  sortNameRoom(contact) {
    const names = [this.user.toLocaleLowerCase().trim()];
    names.push(contact);
    names.sort();
    return names[0] + names[1];
  }
}
