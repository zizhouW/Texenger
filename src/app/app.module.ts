import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Routes, RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomComponent } from './room/room.component';

var firebaseConfig = {
  apiKey: "AIzaSyAgtxUZU5jvfF52lDxJcNK9wTWYyLQ8hjI",
  authDomain: "texenger-bfef2.firebaseapp.com",
  databaseURL: "https://texenger-bfef2.firebaseio.com",
  projectId: "texenger-bfef2",
  storageBucket: "texenger-bfef2.appspot.com",
  messagingSenderId: "162965441221"
};

const routes: Routes = [
  {
    path: 'roomList/:userId',
    component: RoomListComponent
  },
  {
    path: 'room/:userName/:userId/:roomId',
    component: RoomComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    RoomListComponent,
    RoomComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
