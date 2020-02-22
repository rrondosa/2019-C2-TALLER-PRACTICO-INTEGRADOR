import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private userCollection: AngularFirestoreCollection<Usuario>;
  private users: Observable<Usuario[]>;

  public estaElUsuarioLogueado;  // para saber si el usuario esta logueado
  public usuarioLogueado: Usuario;   // el usuario que se logueo
  public usuarioAux : Usuario
  private userSubject = new BehaviorSubject(this.usuarioAux);

  constructor(db:AngularFirestore) {
    this.estaElUsuarioLogueado = false; 
    this.userCollection = db.collection<Usuario>('users');
    this.users = this.userCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );  
  }

  getUsers(){
    return this.users;
    
  }

  getUser(id: string){
    debugger;
    return this.userCollection.doc<Usuario>(id).valueChanges();
  }

  updateUser(user:Usuario, id: string){
    return this.userCollection.doc(id).update(user);
  }
  
  addUser(User: Usuario){
    return this.userCollection.add(User);
  }
  
  removeUser(id: string){
    return this.userCollection.doc(id).delete();
  }

  // seteamos el usuario como logueado, añadiendolo al localStorage
  setearUsuarioLogueado(usuario: Usuario) {
    this.estaElUsuarioLogueado = true;
    this.usuarioLogueado = usuario;
    localStorage.setItem('currentUser', JSON.stringify(usuario));
    this.userSubject.next(this.usuarioLogueado);
  }

  // Lo demas componentes se ponen a la esucha de cambio
  // a través de esté método
  getUserObservable(): Observable<Usuario> {
    return this.userSubject.asObservable();
  }

  // obtenemos datos del usuario logueado, en localStorage
  obtenerUsuarioLogueado() {
  	return JSON.parse(localStorage.getItem('currentUser'));
  }
}
