import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetallePage } from './detalle.page';

import { IonicRatingModule } from "ionic4-rating";
// map cordova
import { GoogleMaps } from '@ionic-native/google-maps';

const routes: Routes = [
  {
    path: '',
    component: DetallePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicRatingModule,
    RouterModule.forChild(routes)
  ],
  providers:[
    GoogleMaps
  ],
  declarations: [DetallePage],
  entryComponents: [DetallePage]
})
export class DetallePageModule {}
