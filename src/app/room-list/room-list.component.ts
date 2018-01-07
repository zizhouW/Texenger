import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { GlobalVariables } from '../global.variables';

interface UserInfo {
  email: string;
  name: string;
  password: string;
  id: string;
}

interface UserRooms {
  userEmail: string;
  rooms: string[];
  id: string;
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
  userEmail: string;
  userDoc: AngularFirestoreDocument<UserInfo>;
  userRooms: UserRooms;
  userName: string;
  roomInfo: Observable<RoomInfo>[];
  newRoomName = '';

  constructor(private afs: AngularFirestore, private route: ActivatedRoute, private router: Router, private toastr: ToastsManager, private globals: GlobalVariables) {
    this.route.params.subscribe(res => { this.userId = res.userId; this.userEmail = res.userEmail });
    this.roomInfo = [];
    this.userName = '';
    this.userRooms = {
      userEmail: '',
      rooms: [],
      id: ''
    }
  }

  ngOnInit() {
    if (this.globals.loggedInAs == null) {
      this.router.navigate(['home']);
    }
    let usersCol = this.afs.collection('users');
    let userRoomsCol = this.afs.collection('user-rooms');
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
            this.userName = user.data.name;
            return;
          }
        });
      });
    userRoomsCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          let data = a.payload.doc.data() as UserRooms;
          data.id = a.payload.doc.id;
          return { data };
        })
      }).subscribe((response) => {
        response.forEach((user) => {
          if (user.data.userEmail == this.userEmail) {
            this.userRooms.rooms = user.data.rooms;
            this.userRooms.id = user.data.id;
            this.userRooms.userEmail = user.data.userEmail;
            return;
          }
        });
        this.roomInfo = [];
        this.userRooms.rooms.forEach((room) => {
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

  addNewRoom() {
    if (this.newRoomName.trim() == '') {
      this.toastr.info('Cannot create rooms with an empty name.');
      return;
    }

    let roomNameExists = false;
    let roomsCol = this.afs.collection('rooms');
    let roomsColSnapshot = roomsCol.snapshotChanges();
    // for checking duplicate room names
    roomsColSnapshot.map(actions => {
      return actions.map(a => {
        let data = a.payload.doc.data() as RoomInfo;
        return { data };
      })
    }).subscribe((response) => {
      response.forEach((room) => {
        if (room.data.room_name == this.newRoomName) {
          roomNameExists = true;
          this.toastr.info('The name ' + this.newRoomName + ' already exists.');
        }
      });
      if (!roomNameExists) {
        // add new room and room id into user document rooms array
        let newRoomId = '';
        this.afs.collection('rooms').add({
          'admin': this.userName,
          'room_name': this.newRoomName
        });

        roomsColSnapshot.map(actions => {
          return actions.map(a => {
            let data = a.payload.doc.data() as RoomInfo;
            data.id = a.payload.doc.id;
            return { data };
          })
        }).subscribe((res) => {
          res.forEach((room) => {
            if (room.data.room_name == this.newRoomName) {
              newRoomId = room.data.id;
              this.userRooms.rooms.push(newRoomId);
              console.log(this.userRooms);
              this.afs.collection('user-rooms').doc(this.userRooms.id).set({ 'rooms': this.userRooms.rooms, 'userEmail': this.userRooms.userEmail });

              this.toastr.success('Successfully created ' + this.newRoomName);
              this.newRoomName = '';
              return;
            }
          });
        });
      }
    });
  }
}
