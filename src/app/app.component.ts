import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Routes, RouterModule, Router } from "@angular/router";
import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { GlobalVariables } from './global.variables';

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

  constructor(private afs: AngularFirestore, private router: Router, private toastr: ToastsManager, private vRef: ViewContainerRef, private tOptions: ToastOptions, private globals: GlobalVariables) {
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

        if (localStorage.getItem('userLoginInfo') !== null) {
          let userLoginInfo = JSON.parse(localStorage.getItem('userLoginInfo'));
          this.globals.loggedInAs = userLoginInfo.email;
          this.userLogin = {
            email: userLoginInfo.email,
            password: userLoginInfo.password
          }
        }
        else if (this.isNewUser) {
          this.userLogin = {
            email: this.userRegistering.email,
            password: this.userRegistering.password
          }
        }
        else {
          return;
        }
        this.onLoginSubmit();
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
      this.globals.loggedInAs = userFilter[0].email;
      this.isNewUser = false;
      console.log('User ' + userFilter[0].name)
      this.userInfo = {
        email: userFilter[0].email,
        name: userFilter[0].name
      };
      localStorage.setItem('userLoginInfo', JSON.stringify(this.userLogin));
      let username = 'roomList/' + userFilter[0].id + '/' + userFilter[0].email;
      this.router.navigate([username]);
    }
    this.userLogin.password = '';
  }

  userRegister() {
    this.isNewUser = true;
    this.router.navigate(['register']);
    return false;
  }

  checkEmailValidity(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }

  onRegisterSubmit(userRegistering) {
    this.isNewUser = true;
    let userFilter = this.users.filter((user) => {
      if (user.email == userRegistering.email) {
        return user;
      }
    });
    if (userFilter.length != 0) {
      this.toastr.error('This E-mail has already been used.', 'Invalid E-mail', this.toastrOptions);
    }
    else if (userRegistering.password.length < 6) {
      this.toastr.error('Password needs to be at least 6 digits.', 'Invalid password', this.toastrOptions)
    }
    else if (!this.checkEmailValidity(userRegistering.email)) {
      this.toastr.error('Invalid E-mail format.', 'Invalid E-mail', this.toastrOptions);
    }
    else if (userRegistering.password != userRegistering.confirmPassword) {
      this.toastr.error('Passwords entered are not the same.', 'Invalid password', this.toastrOptions);
    }
    else {
      this.afs.collection('users').add({
        'name': userRegistering.name,
        'email': userRegistering.email,
        'password': userRegistering.password,
        'rooms': [this.allRoomId]
      });
      this.afs.collection('user-rooms').add({
        'userEmail': userRegistering.email,
        'rooms': [this.allRoomId]
      });
      this.userRegistering = userRegistering;
      this.refreshUsers();
    }
  }

  logOut() {
    this.isNewUser = false;
    this.userLogin = {
      email: '',
      password: ''
    };
    this.users = [];
    this.userInfo = {
      email: '',
      name: '',
    };
    this.globals.loggedInAs = null;
    localStorage.clear();
    this.router.navigate(['']);
  }
}
