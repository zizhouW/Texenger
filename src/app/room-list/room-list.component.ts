import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ActivatedRoute, Router } from '@angular/router';

interface UserInfo {
  email: string;
  name: string;
  password: string;
  id: string;
  rooms: string[];
}

interface RoomInfo {
  admin: string;
  room_name: string;
  id: string;
}

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent {
  userId: string;
  userDoc: AngularFirestoreDocument<UserInfo>;
  userRooms: string[];
  userName: string;
  roomInfo: Observable<RoomInfo>[];

  constructor(private afs: AngularFirestore, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(res => this.userId = res.userId);
    this.roomInfo = [];
    this.userName = '';
  }

  ngOnInit() {
    let usersCol = this.afs.collection('users');
    usersCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          let data = a.payload.doc.data() as UserInfo;
          data.id = a.payload.doc.id;
          return { data };
        })
      }).subscribe((response) => {
        response.forEach((user) => {
          if (user.data.id == this.userId) {
            this.userRooms = user.data.rooms;
            this.userName = user.data.name;
          }
        });
        this.userRooms.forEach((room) => {
          let roomDoc = this.afs.doc<RoomInfo>('rooms/' + room);
          this.roomInfo.push(roomDoc.valueChanges());
        });
      });
  }

  toChatRoom(roomId) {
    let roomRouterPath = 'room/' + this.userName + '/' + this.userId + '/' + roomId;
    this.router.navigate([roomRouterPath]);
    console.log(roomId);
  }
}
