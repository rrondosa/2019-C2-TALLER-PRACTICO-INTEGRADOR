![Imgur](https://i.imgur.com/HnbiiE6.png)

````
ionic integrations enable cordova
ionic cordova platform add android
ionic cordova platform add ios
````

````
ionic cordova plugin add cordova-plugin-camera
npm install --save @ionic-native/camera@beta
````


````
import { Camera } from '@ionic-native/camera/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
````

````
import { Camera } from '@ionic-native/camera/ngx';

@Component()
export class HomePage {

  constructor (
    private camera: Camera
  ) {}

}
````

````
takePicture() {
  const options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA
  };
  this.camera.getPicture(options)
  .then((imageData) => {
    this.image = 'data:image/jpeg;base64,' + imageData;
  }, (err) => {
    console.log(err);
  });
}
````

````
<ion-content padding>
  <ion-button (click)="takePicture()">Take picture</ion-button>
  <img *ngIf="image" [src]="image" alt="image">
</ion-content>
````

````
import { WebView } from '@ionic-native/ionic-webview/ngx';

@NgModule({
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    WebView,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
````


````
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Component()
export class HomePage {

  constructor (
    private camera: Camera,
    private webView: WebView
  ) {}

}
````


````
takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA
    };
    this.camera.getPicture(options)
    .then((file) => {
      this.image = this.webView.convertFileSrc(file);
    }, (err) => {
      console.log(err);
    });
  }
````
