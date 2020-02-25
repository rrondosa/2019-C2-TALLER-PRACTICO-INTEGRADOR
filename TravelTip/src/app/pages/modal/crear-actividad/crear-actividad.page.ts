import { Component, OnInit, NgZone } from '@angular/core';
import { ModalController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';
import { Actividad } from '../../../models/actividad.model ';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { finalize } from 'rxjs/operators';
import { UserService } from 'src/app/servicios/user.service';
import { ActividadService } from 'src/app/servicios/actividad.service';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import * as firebase from 'firebase';
import { storage, initializeApp, apps, auth } from 'firebase';
import { Geocoder, GeocoderResult } from '@ionic-native/google-maps';

declare var google:any;

@Component({
  selector: 'app-crear-actividad',
  templateUrl: './crear-actividad.page.html',
  styleUrls: ['./crear-actividad.page.scss'],
})
export class CrearActividadPage implements OnInit {
  
  public onRegisterForm: FormGroup;
  public patente : string;
  public tel : string;
  public web : string;
  public direccion : string = "";
  public nombre:string;
  public tipoAct:string;
  public amb:string;
  public description:string;
  public photo:string;
  public precio:number;

  private googleAutocomplete = new google.maps.places.AutocompleteService();
  public search: string ="";
  public searchResults = new Array<any>();

  public isInvitado: any = null;
  public userUid: string = null;

  private userAct : Usuario = {};  
  private actvidadNva : Actividad = {};
  
  signupform: FormGroup;
  // uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  urlImgString : string;

  image: string;
  captureDataUrl: string;

  constructor(
    private modalCtrl: ModalController,
    private ngZone: NgZone,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private auth : AuthService,
    private router : Router,
    public toastCtrl: ToastController,
    private authservice :AuthService,
    private userService : UserService,
    private actividadService:ActividadService,
    private firebaseStorage:AngularFireStorage,
    private firebase : AngularFireAuth,
    private camera: Camera,
    private alertCtrl: AlertController,
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
          this.isInvitado = Object.assign({}, userRole.roles).hasOwnProperty('invitado');
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

  ngOnInit() {
 
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
  searchChanged(){
    if(!this.search.trim().length) return;

    this.googleAutocomplete.getPlacePredictions({input: this.search}, predictions =>{
      this.ngZone.run(()=>{
        this.searchResults = predictions;
        console.log(this.searchResults);
        
      });
      

    });
  }
  selcionarDire(e, result){
    this.direccion=result.description;
    console.log(this.direccion);
    this.search = "";
    
  }
  codeSelected(v){
    console.log("ddsdsds",v.target.value);
    this.tipoAct=v.target.value;
  }
  codeSelectedAmb(e){
    this.amb=e.target.value;
  }

  // para la foto
  onFileChanged(e) {
    console.log("click",e);
   debugger;
    console.log('subir', e.target.files[0]);
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    console.log('arch',e.target.files[0]);
    const filePath = `Actividades/profile_${this.userUid}/${id}`;
    const ref = this.firebaseStorage.ref(filePath);
    const task = this.firebaseStorage.upload(filePath, file);
    // this.uploadPercent = task.percentageChanges();

    // task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();
    console.log("ACT NVA",this.actvidadNva);
    
    task
      .snapshotChanges()
      .pipe(
      finalize(() => {
          ref.getDownloadURL().subscribe(downloadURL => {
            debugger;
              console.log("downloadURL_1",downloadURL);
              this.actvidadNva.photo=downloadURL;
             
          });
        })
      )
    .subscribe();   
    this.showSuccesfulUploadAlert();
    console.log("ACT edespues de fotp",this.actvidadNva);
  }
  

  async sendData() {
    const loader = await this.loadingCtrl.create({
      duration: 2000
    });

    loader.present();
    debugger;
    const nroAct = Math.floor(Date.now() / 1000);
    this.actvidadNva.uid_creador = this.userAct.uid;
    this.actvidadNva.id=nroAct.toString();
    this.actvidadNva.direccion=this.direccion;
    this.actvidadNva.name=this.nombre;
    this.actvidadNva.tel=this.tel;
    this.actvidadNva.web=this.web;
    this.actvidadNva.estado="0";
    this.actvidadNva.tipo={};
    this.actvidadNva.precio=this.precio;
    switch(this.tipoAct) {
      case "Hospedaje":
        this.actvidadNva.tipo.hospedaje = this.amb;
        break;
      case "Excursión":
        this.actvidadNva.tipo.actividad = this.description;
        break;
      case "Gastronomía":
        this.actvidadNva.tipo.gastronomia = this.description;
        break;
      case "Transporte":
        this.actvidadNva.tipo.transporte = this.patente;
        break;
    }
    console.log("nvaaaaa----->", this.actvidadNva);
   
    this.actividadService.addActividad(this.actvidadNva);
    
    loader.onWillDismiss().then(async l => {
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        cssClass: 'bg-profile',
        message: 'Se guardo exitosamente su actividad.',
        duration: 3000,
        position: 'middle'
      });

      toast.present();
      this.closeModal();
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
    const imageRef = storageRef.child(`Actividades/profile_${this.userUid}/${filename}.jpg`);

    imageRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL ).then((snapshot)=> {
        // Do something here when the data is succesfully uploaded!
        
        snapshot.ref.getDownloadURL().then(downloadURL=> {
          console.log('File available at', downloadURL);     
          this.actvidadNva.photo = downloadURL;  
        });
        console.log("des tomar ------>", this.actvidadNva.photo);
        
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

    onRateChange(event) { console.log("Your rate:", event); }

}
