import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AppComponent } from '../app.component';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {

    userRegistering = {
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
    };

    constructor(private afs: AngularFirestore, private route: ActivatedRoute, private toastr: ToastsManager, private appComponent: AppComponent) {
        
    }

    ngOnInit() {

    }

    onRegisterSubmit() {
        this.appComponent.onRegisterSubmit(this.userRegistering);
    }
}
