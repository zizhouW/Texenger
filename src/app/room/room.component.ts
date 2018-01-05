import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ActivatedRoute } from '@angular/router';

interface UserInfo {
    email: string;
    name: string;
    password: string;
    id: string;
    rooms: string[];
}

interface ChatInfo {
    user: string;
    message: string;
    time: number;
}

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.css']
})
export class RoomComponent {
    roomId: string;
    userId: string;
    userName: string;
    chat: ChatInfo[];
    textMessage = '';

    //   userDoc: AngularFirestoreDocument<UserInfo>;
    //   userRooms: string[];
    //   roomInfo: Observable<RoomInfo>[];

    constructor(private afs: AngularFirestore, private route: ActivatedRoute) {
        this.route.params.subscribe(res => { this.roomId = res.roomId; this.userId = res.userId; this.userName = res.userName });
        this.chat = [];
    }

    ngOnInit() {
        let chatCol = this.afs.collection('rooms/' + this.roomId + '/chat');
        chatCol.snapshotChanges()
            .map(actions => {
                return actions.map(a => {
                    let data = a.payload.doc.data() as ChatInfo;
                    return { data };
                })
            }).subscribe((response) => {
                this.chat = [];
                response.forEach((message) => {
                    this.chat.push(message.data);
                });

                this.chat.sort(function (a, b) {
                    return a.time - b.time;
                })
            });

    }

    sendMessage() {
        let docId = this.chat.length + 1;
        let dateNow = new Date();
        let dateTime = dateNow.getTime();
        this.textMessage = this.textMessage.trim();
        if (this.textMessage !== '') {
            this.afs.collection('rooms/' + this.roomId + '/chat').add({ 'message': this.textMessage, 'user': this.userName, 'time': dateTime });
        }
        else {
            alert('Cannot send empty message.')
        }
        this.textMessage = '';
    }
}
