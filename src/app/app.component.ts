import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Routes, RouterModule, Router } from "@angular/router";

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

  constructor(private afs: AngularFirestore, private router: Router) {
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
      alert('User does not exists.');
    }
    else if (userFilter[0].password != this.userLogin.password) {
      alert('Wrong password.');
    }
    else {
      this.isLoggedIn = true;
      this.isNewUser = false;
      console.log('User ' + userFilter[0].name)
      this.userInfo = {
        email: userFilter[0].email,
        name: userFilter[0].name
      };
      let username = 'roomList/' + userFilter[0].id;
      this.router.navigate([username]);
    }
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
      alert('This email has already been used.');
    }
    else if (this.userRegistering.password != this.userRegistering.confirmPassword) {
      alert('Passwords entered are not the same.')
    }
    else {
      this.afs.collection('users').add({
        'name': this.userRegistering.name,
        'email': this.userRegistering.email,
        'password': this.userRegistering.password,
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
