import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MisPublicacionesPage } from './mis-publicaciones';

@NgModule({
  declarations: [
    MisPublicacionesPage,
  ],
  imports: [
    IonicPageModule.forChild(MisPublicacionesPage),
  ],
})
export class MisPublicacionesPageModule {}
