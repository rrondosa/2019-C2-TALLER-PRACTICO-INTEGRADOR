import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/firestore";
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private afs: AngularFirestore) { }
  private usersCollection: AngularFirestoreCollection<Usuario>;
  private users: Observable<Usuario[]>;
  private userDoc: AngularFirestoreDocument<Usuario>;
  private user: Observable<Usuario>;
  // public selecteduser: Usuario = {
  //   id: null
  // };

  getAllusers() {
    this.usersCollection = this.afs.collection<Usuario>('users');
    return this.users = this.usersCollection.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Usuario;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }


  // getAllUsersOffers() {
  //   this.usersCollection = this.afs.collection('users', ref => ref.where('oferta', '==', '1'));
  //   return this.users = this.usersCollection.snapshotChanges()
  //     .pipe(map(changes => {
  //       return changes.map(action => {
  //         const data = action.payload.doc.data() as Usuario;
  //         data.id = action.payload.doc.id;
  //         return data;
  //       });
  //     }));
  // }

  getOneUser(iduser: string) {
    this.userDoc = this.afs.doc<Usuario>(`users/${iduser}`);
    return this.user = this.userDoc.snapshotChanges().pipe(map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as Usuario;
        data.id = action.payload.id;
        return data;
      }
    }));
  }

  addUser(user: Usuario): void {
    this.usersCollection.add(user);
  }
  updateUser(user: Usuario): void {
    let iduser = user.id;
    this.userDoc = this.afs.doc<Usuario>(`users/${iduser}`);
    this.userDoc.update(user);
  }
  deleteUser(iduser: string): void {
    this.userDoc = this.afs.doc<Usuario>(`users/${iduser}`);
    this.userDoc.delete();
  }
}
