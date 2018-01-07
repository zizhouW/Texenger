import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {

    constructor(private afs: AngularFirestore, private route: ActivatedRoute, private toastr: ToastsManager) {

    }

    ngOnInit() {
        
    }
}
