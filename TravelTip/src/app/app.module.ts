import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Modal Pages
import { ImagePageModule } from './pages/modal/image/image.module';
import { SearchFilterPageModule } from './pages/modal/search-filter/search-filter.module';

// Components
import { NotificationsComponent } from './components/notifications/notifications.component';

import {firebaseConfig } from '../environments/environment';

// Firebase
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule, FirestoreSettingsToken } from "@angular/fire/firestore";

// geolocalizacion
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

// 
import { IonicRatingModule } from 'ionic4-rating';

@NgModule({
  declarations: [AppComponent, NotificationsComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ImagePageModule,
    SearchFilterPageModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule, 
    AngularFirestoreModule,
    IonicRatingModule
  ],
  entryComponents: [NotificationsComponent],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: {}},
    Geolocation,
    NativeGeocoder
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
