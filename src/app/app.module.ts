import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Routes, RouterModule } from '@angular/router';
import { Md2Module } from 'md2';
import { ToastModule } from 'ng2-toastr/ng2-toastr';


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
    path: 'roomList/:userId/:userEmail',
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
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    Md2Module,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
