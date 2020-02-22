import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MapaPruebaPage } from './mapa-prueba.page';

const routes: Routes = [
  {
    path: '',
    component: MapaPruebaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MapaPruebaPage]
})
export class MapaPruebaPageModule {}
