import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Tip } from '../models/tip.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TipService {

  constructor(private afs: AngularFirestore) { }
  private tipsCollection: AngularFirestoreCollection<Tip>;
  private tips: Observable<Tip[]>;
  private tipDoc: AngularFirestoreDocument<Tip>;
  private tip: Observable<Tip>;


  getAlltips() {
    debugger
    this.tipsCollection = this.afs.collection<Tip>('tips');
    return this.tips = this.tipsCollection.snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Tip;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
  }

  getOneTip(idTip: string) {
    this.tipDoc = this.afs.doc<Tip>(`tips/${idTip}`);
    return this.tip = this.tipDoc.snapshotChanges().pipe(map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as Tip;
        data.id = action.payload.id;
        return data;
      }
    }));
  }

  addTip(tip: Tip) {
    return  this.afs.collection('tips').add(tip);
  }
  updateTip(tip: Tip): void {
    let idTip = tip.id;
    this.tipDoc = this.afs.doc<Tip>(`tips/${idTip}`);
    this.tipDoc.update(tip);
  }
  deleteTip(idTip: string): void {
    debugger;
    this.tipDoc = this.afs.doc<Tip>(`tips/${idTip}`);
    this.tipDoc.delete();
  }
}
