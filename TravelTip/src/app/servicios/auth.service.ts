import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { promise } from 'protractor';
import { Router } from "@angular/router";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { Usuario } from '../models/usuario.model';
import { map } from 'rxjs/operators';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private AFauth : AngularFireAuth, private router : Router, private db : AngularFirestore) { }

  login(email:string, password:string){
    return new Promise((resolve, reject) =>{
      this.AFauth.auth.signInWithEmailAndPassword(email, password)
        .then( user => resolve(user),
        err => reject(err));
    });
  }

  register(username : string, password : string){

    return new Promise ((resolve, reject) => {
      this.AFauth.auth.createUserWithEmailAndPassword(username  + '@travelhints.com', password).then( res =>{
        resolve(res),
        this.updateUserData(res.user)
      }).catch( err => reject(err))
    })
  }

  loginFacebookUser() {
    return this.AFauth.auth.signInWithPopup(new auth.FacebookAuthProvider())
      .then(credential => this.updateUserData(credential.user))
  }

  loginGoogleUser() {
    return this.AFauth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(credential => this.updateUserData(credential.user))
  }
  isAuth() {
    return this.AFauth.authState.pipe(map(auth => auth));
  }

  authCurrent() {
    return this.AFauth.auth.currentUser;
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${user.uid}`);
    const data: Usuario = {
      uid: user.uid,
      email: user.email,
      roles: {
        user: true
      }
    }
    return userRef.set(data, { merge: true })
  }
  
  isUserAdmin(userUid) {
    return this.db.doc<Usuario>(`users/${userUid}`).valueChanges();
  }

  logout(){
    this.AFauth.auth.signOut().then(() => {
      
      this.router.navigate(['/']);
    })
  }

  
}
 