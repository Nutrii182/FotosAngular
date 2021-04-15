import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styleUrls: ['./fotos.component.css']
})
export class FotosComponent implements OnInit {

  item$: Observable<any[]>;

  constructor(firestore: AngularFirestore) {
    this.item$ = firestore.collection('img').valueChanges();
  }

  ngOnInit(): void {
  }

}
