import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { AuthService } from "../../servicios/auth.service";
import { Usuario } from '../../models/usuario.model';
import { UserService } from "../../servicios/user.service";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireStorage  } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import * as firebase from 'firebase';
import { storage, initializeApp, apps, auth } from 'firebase';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
 
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private authservice :AuthService,
    private userService : UserService,
    private firebaseStorage:AngularFireStorage,
    private firebase : AngularFireAuth,
    private camera: Camera,
    private alertCtrl: AlertController
  ) { 
    this.authservice.isAuth().subscribe(auth => {
      if (auth) {
        this.userUid = auth.uid;
        console.log("auth",auth);
        
        this.userService.getOneUser(this.userUid).subscribe(userdb => {
          this.userAct = userdb;
          this.userAct.photoUrl = auth.photoURL;
          console.log("userDb",userdb);
        
        });
        
        this.authservice.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
        })
      }
    })
    console.log("userUid",this.userUid);
    console.log("userAct",this.userAct);
    
    if(this.userUid){
      this.userService.getOneUser(this.userUid).subscribe(book => {
        this.userAct = book;
      });
      console.log("user act:",this.userAct);
      
    } else console.log("NO SE LOGUEO");
  }
  
  public isAdmin: any = null;
  public userUid: string = null;

  private userAct : Usuario = {};  
  signupform: FormGroup;
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  urlImgString : string;

  image: string;
  captureDataUrl: string;
  
  async ngOnInit() { 

    // this.urlImage = this.userAct.photoUrl ? this.userAct.photoUrl :"assets/img/avatar.png";
    // console.log(this.userAct.photoUrl );
    
  }

  onFileChanged(e) {
    console.log("click",e);
   
    console.log('subir', e.target.files[0]);
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    console.log('arch',e.target.files[0]);
    const filePath = `fotosUsuarios/profile_${id}`;
    const ref = this.firebaseStorage.ref(filePath);
    const task = this.firebaseStorage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();

    // task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();

    task
      .snapshotChanges()
      .pipe(
      finalize(() => {
          ref.getDownloadURL().subscribe(downloadURL => {
            debugger;
              console.log("downloadURL_1",downloadURL);
              this.userAct.photoUrl=downloadURL;
             
          });
        })
      )
    .subscribe();   
    this.showSuccesfulUploadAlert();
     
  }
  

  async sendData() {
    const loader = await this.loadingCtrl.create({
      duration: 2000
    });

    loader.present();
    
    console.log("usuario modficado",this.userAct);
    this.actualizaUserActEmail();
    this.actualizaUserActPhoto();    
    this.userService.updateUser(this.userAct);
    
    loader.onWillDismiss().then(async l => {
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        cssClass: 'bg-profile',
        message: 'Sus datos fueron editados exitosamente!',
        duration: 3000,
        position: 'middle'
      });

      toast.present();
      this.navCtrl.navigateForward('/home-results');
    });
  }
  actualizaUserActEmail(){
    let user = this.firebase.auth.currentUser;
    user.updateEmail( this.userAct.email).then(function() {
      // Update successful.downloadURL
    }).catch(function(error) {
      // An error happened.
    });
  }
  actualizaUserActPhoto(){
    let user = this.firebase.auth.currentUser;
    user.updateProfile({
      photoURL:this.userAct.photoUrl
    }).then(function() {
      // Update successful.downloadURL
    }).catch(function(error) {
      // An error happened.
    });
  }
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
      // this.image = this.webView.convertFileSrc(imageData);
      this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
      // this.captureDataUrl = imageData;
      
      console.log(this.captureDataUrl);
      
      this.upload();

      
    }, (err) => {
      console.log(err);
    });

  }
  async upload() {
    let storageRef = storage().ref();
    // Create a timestamp as filename
	
    const filename = Math.floor(Date.now() / 1000);

    // Create a reference to 'images/todays-date.jpg'
    const metadata = {
      contentType: 'image/jpeg'
    };
    const imageRef = storageRef.child(`fotosUsuarios/profile_${filename}.jpg`);

    imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL ).then((snapshot)=> {
        // Do something here when the data is succesfully uploaded!
        
        snapshot.ref.getDownloadURL().then(downloadURL=> {
          console.log('File available at', downloadURL);     
          this.userAct.photoUrl = downloadURL;  
          console.log("antes tomar ------>",this.userAct.photoUrl);
        });
        console.log("des tomar ------>",this.userAct.photoUrl);
        
        this.showSuccesfulUploadAlert();
           
    });

  
        
  }


    async  showSuccesfulUploadAlert() {
      const  alert =await  this.alertCtrl.create({
        header: "Nueva foto",
        message: 'La foto se cambio correctamente.',
        buttons: ['OK']
      });
      await alert.present();
      // clear the previous photo data in the variable
    
      this.captureDataUrl = "";
    }


}
