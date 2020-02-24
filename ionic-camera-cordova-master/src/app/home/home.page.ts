import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { finalize } from 'rxjs/operators';
import { AlertController} from '@ionic/angular';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';

import { AngularFireStorage } from '@angular/fire/storage';

import * as firebase from 'firebase';

import { storage, initializeApp, apps } from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  image: string;
  captureDataUrl: string;
  constructor (
    private camera: Camera,
    private webView: WebView,
    private storage: AngularFireStorage,
    alertCtrl: AlertController
  ) {
    this.alertCtrl = alertCtrl;
    
  }
  
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  alertCtrl: AlertController;

  async takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA
    };
    this.camera.getPicture(options)
    .then((imageData) => {
      console.log(imageData);
      this.image = this.webView.convertFileSrc(imageData);
      this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
      // this.captureDataUrl = imageData;
      
      console.log(this.captureDataUrl);
      
      this.upload();

      
    }, (err) => {
      console.log(err);
    });

  }

  upload() {
    let storageRef = storage().ref();
    // Create a timestamp as filename
	
    const filename = Math.floor(Date.now() / 1000);

    // Create a reference to 'images/todays-date.jpg'
    const metadata = {
      contentType: 'image/jpeg'
    };
    const imageRef = storageRef.child(`images/${filename}.jpg`);
    // const imageRef = storage().ref('pictures/miFoto');

    imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL )
      .then((snapshot)=> {
        // Do something here when the data is succesfully uploaded!
		
        this.showSuccesfulUploadAlert();
      });
    }
    async  showSuccesfulUploadAlert() {
      const  alert =await  this.alertCtrl.create({
        header: "Uploaded!",
        message: 'Picture is uploaded to Firebase',
        buttons: ['OK']
      });
      await alert.present();
      // clear the previous photo data in the variable
    
      this.captureDataUrl = "";
    }

  onUpload(e) {
    debugger;
    console.log('subir', e.target.files[0]);
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    console.log('arch',e.target.files[0]);
    const filePath = `uploads/profile_${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();

    task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();

    
  }
  getPicture(event) {
    this.image = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.image = event.target.result;
    }
    if (this.image) {
      reader.readAsDataURL(event.target.files[0]);
      console.log(reader);
    }

  }
  // abrirGaleria(){

  //   let options: ImagePickerOptions = {
  //       maximumImagesCount: 3
  //   };

  //   this.imagePicker.getPictures(options)
  //       .then((results) => {
  //           this.fotos = results;
  //       }, (err) => {
  //           this.mostrar_mensaje(err);
  //       });

  // }

}
