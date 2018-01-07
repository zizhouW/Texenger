import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Routes, RouterModule, Router } from "@angular/router";
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';

interface UserInfo {
  email: string;
  name: string;
  password: string;
  id: string;
  rooms: string[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn = false;
  isNewUser = false;
  userLogin = {
    email: '',
    password: ''
  }
  userRegistering: any;
  usersCol: AngularFirestoreCollection<UserInfo>;
  users: any[];
  userInfo: any;
  allRoomId = 'AE76WJJqj8E4vQy8buqY';
  toastrOptions: ToastOptions;

  constructor(private afs: AngularFirestore, private router: Router, private toastr: ToastsManager, private vRef: ViewContainerRef, private tOptions: ToastOptions) {
    this.userLogin = {
      email: '',
      password: ''
    };
    this.users = [];
    this.userInfo = {
      email: '',
      name: '',
    };
    this.userRegistering = {
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    }
    this.toastr.setRootViewContainerRef(vRef);
    tOptions.positionClass = 'toast-bottom-right';
    tOptions.animate = 'flyRight';
    this.toastrOptions = tOptions;
  }

  ngOnInit() {
    this.refreshUsers();
  }

  refreshUsers() {
    this.usersCol = this.afs.collection('users');
    this.usersCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          let data = a.payload.doc.data() as UserInfo;
          data.id = a.payload.doc.id;
          return { data };
        })
      }).subscribe((response) => {
        this.users = [];
        response.forEach((user) => {
          this.users.push(user.data);
        });
        this.userLogin = {
          email: this.userRegistering.email,
          password: this.userRegistering.password
        }
        if (this.isNewUser) {
          this.onLoginSubmit();
        }
      });
  }

  onLoginSubmit() {
    console.log("checking if user is valid: " + this.userLogin.email + ', ' + this.userLogin.password);
    let userFilter = this.users.filter((user) => {
      if (user.email == this.userLogin.email) {
        return user;
      }
    });
    if (userFilter.length == 0) {
      this.toastr.error('User does not exists.', 'Invalid Login', this.toastrOptions);
    }
    else if (userFilter[0].password != this.userLogin.password) {
      this.toastr.error('Wrong password.', 'Invalid Login', this.toastrOptions);
    }
    else {
      this.isLoggedIn = true;
      this.isNewUser = false;
      console.log('User ' + userFilter[0].name)
      this.userInfo = {
        email: userFilter[0].email,
        name: userFilter[0].name
      };
      let username = 'roomList/' + userFilter[0].id + '/' + userFilter[0].email;
      this.router.navigate([username]);
    }
    this.userLogin.password = '';
  }

  userRegister() {
    this.isNewUser = true;
    return false;
  }

  onRegisterSubmit() {
    let userFilter = this.users.filter((user) => {
      if (user.email == this.userRegistering.email) {
        return user;
      }
    });
    if (userFilter.length != 0) {
      this.toastr.error('This E-mail has already been used.', 'Invalid E-mail', this.toastrOptions);
    }
    else if (this.userRegistering.password != this.userRegistering.confirmPassword) {
      this.toastr.error('Passwords entered are not the same.', 'Invalid password', this.toastrOptions);
    }
    else {
      this.afs.collection('users').add({
        'name': this.userRegistering.name,
        'email': this.userRegistering.email,
        'password': this.userRegistering.password,
        'rooms': [this.allRoomId]
      });
      this.afs.collection('user-rooms').add({
        'userEmail': this.userRegistering.email,
        'rooms': [this.allRoomId]
      });
      this.refreshUsers();
    }
  }

  // logOut() {
  //   this.isLoggedIn = false;
  //   this.isNewUser = false;
  //   this.userLogin = {
  //     email: '',
  //     password: ''
  //   };
  //   this.users = [];
  //   this.userInfo = {
  //     email: '',
  //     name: '',
  //   };
  //   this.userRegistering = {
  //     email: '',
  //     password: '',
  //     confirmPassword: '',
  //     name: ''
  //   }
  //   this.router.navigate(['']);
  // }
}
