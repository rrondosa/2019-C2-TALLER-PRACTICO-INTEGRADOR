import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Actividad } from '../models/actividad.model ';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {

  constructor(private afs: AngularFirestore) { }
  private actividadesCollection: AngularFirestoreCollection<Actividad>;
  private actividades: Observable<Actividad[]>;
  private actividadDoc: AngularFirestoreDocument<Actividad>;
  private actividad: Observable<Actividad>;
  // public selectedactividad: Actividad = {
  //   id: null
  // };

  getAllactividades() {
    this.actividadesCollection = this.afs.collection<Actividad>('Actividades');
    return this.actividades = this.actividadesCollection.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Actividad;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }


  // getAllactividadesOffers() {
  //   this.actividadesCollection = this.afs.collection('actividades', ref => ref.where('oferta', '==', '1'));
  //   return this.actividades = this.actividadesCollection.snapshotChanges()
  //     .pipe(map(changes => {
  //       return changes.map(action => {
  //         const data = action.payload.doc.data() as Actividad;
  //         data.id = action.payload.doc.id;
  //         return data;
  //       });
  //     }));
  // }

  getAllActividadesCreadas() {
    this.actividadesCollection = this.afs.collection('Actividades', ref => ref.where('estado', '==', '0'));
    return this.actividades = this.actividadesCollection.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Actividad;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }

  getOneActividad(idActividad: string) {
    this.actividadDoc = this.afs.doc<Actividad>(`Actividades/${idActividad}`);
    return this.actividad = this.actividadDoc.snapshotChanges().pipe(map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as Actividad;
        data.id = action.payload.id;
        return data;
      }
    }));
  }

  addActividad(actividad: Actividad) {
    return  this.afs.collection('Actividades').add(actividad);
  }
  updateActividad(actividad: Actividad): void {
    let idActividad = actividad.id;
    this.actividadDoc = this.afs.doc<Actividad>(`actividades/${idActividad}`);
    this.actividadDoc.update(actividad);
  }
  deleteActividad(idActividad: string): void {
    this.actividadDoc = this.afs.doc<Actividad>(`actividades/${idActividad}`);
    this.actividadDoc.delete();
  }
}
