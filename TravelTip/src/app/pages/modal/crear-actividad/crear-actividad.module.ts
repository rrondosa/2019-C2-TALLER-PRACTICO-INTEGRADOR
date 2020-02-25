import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CrearActividadPage } from './crear-actividad.page';

// map cordova
import { GoogleMaps } from '@ionic-native/google-maps';
import { Camera } from '@ionic-native/camera/ngx';

import { IonicRatingModule } from "ionic4-rating";

const routes: Routes = [
  {
    path: '',
    component: CrearActividadPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    IonicRatingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CrearActividadPage]
})
export class CrearActividadPageModule {}
