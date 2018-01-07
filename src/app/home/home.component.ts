import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AppComponent } from '../app.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {

    constructor(private afs: AngularFirestore, private route: ActivatedRoute, private toastr: ToastsManager, private appComponent: AppComponent) {

    }

    ngOnInit() {
        this.appComponent.refreshUsers();
    }
}
