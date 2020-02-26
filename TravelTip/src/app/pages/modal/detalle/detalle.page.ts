import { Component, Input, OnInit, NgZone } from '@angular/core';
import { NavController, ModalController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ActividadService } from 'src/app/servicios/actividad.service';
import { Actividad } from 'src/app/models/actividad.model ';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import {NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult} from '@ionic-native/native-geocoder/ngx';
import { Platform, IonSlides } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';
import { UserService } from 'src/app/servicios/user.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Usuario } from 'src/app/models/usuario.model';
import * as firebase from 'firebase';
import { storage, initializeApp, apps, auth } from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { finalize } from 'rxjs/operators';


declare var google;

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  @Input() value: any;
  public detalle: any;
  lat;lng;
  value2: any;
  actividad :Actividad={};
  public URLDrive ="https://www.google.com/maps/dir/?api=1";
  ok=false;


  public isInvitado: any = null;
  public userUid: string = null;
  private userAct : Usuario = {};  

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
  public position;
  public captureDataUrl;

  private googleAutocomplete = new google.maps.places.AutocompleteService();
  public search: string ="";
  public searchResults = new Array<any>();


  constructor(
    private nav: NavController,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private actividadSrv : ActividadService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private platform:Platform,
    public zone: NgZone,
    public toastCtrl: ToastController,
    private authservice :AuthService,
    private userService : UserService,
    private actividadService:ActividadService,
    private firebaseStorage:AngularFireStorage,
    private camera: Camera,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,    

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
   
  }

  ngOnInit() {
    // this.detalle = this.sanitizer.bypassSecurityTrustStyle(this.value);
    this.ok=false;
    debugger;
    console.log(this.value);
    this.actividadSrv.getOneActividad(this.value).subscribe(a=>{
      this.actividad =a;
      console.log(this.actividad);
      this.forwardGeocode(this.actividad.direccion);
            
    });
    
  }
  forwardGeocode(address) {
    
    if (this.platform.is('cordova')) {
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };
      this.nativeGeocoder.forwardGeocode(address, options)
        .then((result: NativeGeocoderResult[]) => {
          this.zone.run(() => {
            this.lat = result[0].latitude;
            this.lng = result[0].longitude;
          })
        })
        .catch((error: any) => console.log(error));
    } else {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': address }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          this.zone.run(() => {
            this.lat = results[0].geometry.location.lat();
            this.lng = results[0].geometry.location.lng();
            console.log("lat",this.lat);
            console.log("lngt",this.lng);
            this.setPsition(this.lat.toString(),this.lng.toString());
          })
        } else {
          alert('Error - ' + results + ' & Status - ' + status)
        }
      });
    }

  }
  setPsition(a, b) {
    this.actividad.position={lat: a,lng:b}
    this.actividad.drive = this.URLDrive+"&destination="+a+","+b+"&travelmode=transit";
  }
  
  async rechazarActividad() {
    const loader = await this.loadingCtrl.create({
      duration: 2000
    });

    loader.present();

    this.actividad.estado="3";
    this.actividadService.updateActividad(this.actividad);
    this.ok=false;
    console.log("actididad mod  ", this.actividad);

    loader.onWillDismiss().then(async l => {
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        cssClass: 'bg-profile',
        message: 'Actividad rechazada',
        duration: 3000,
        position: 'middle'
      });
      this.ok=false;
      toast.present();
      this.closeModal();
      
    });
  }

  async actidadOk() {
  
    
    const loader = await this.loadingCtrl.create({
      duration: 2000
    });

    loader.present();
    debugger;
    
    this.actividad.estado="1";
    this.actividadService.updateActividad(this.actividad);
    console.log("actididad mod  estado 1 ", this.actividad);
    this.ok=true;

    loader.onWillDismiss().then(async l => {
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        cssClass: 'bg-profile',
        message: 'Actividad confirmada',
        duration: 3000,
        position: 'middle'
      });
      this.ok=false;
      toast.present();
      this.closeModal();
      
    });



  }
 
  borrarActividad(){
    this.actividadService.deleteActividad(this.value);
    this.closeModal();
  }
  closeModal() {
    this.modalCtrl.dismiss();
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
    console.log("ACT NVA",this.actividad);
    
    task
      .snapshotChanges()
      .pipe(
      finalize(() => {
          ref.getDownloadURL().subscribe(downloadURL => {
            debugger;
              console.log("downloadURL_1",downloadURL);
              this.actividad.photo=downloadURL;
             
          });
        })
      )
    .subscribe();   
    this.showSuccesfulUploadAlert();
    console.log("ACT edespues de fotp",this.actividad);
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
    .then((detalleData) => {
      console.log(detalleData);
      // this.detalle = this.webView.convertFileSrc(detalleData);
      this.captureDataUrl = 'data:detalle/jpeg;base64,' + detalleData;
      // this.captureDataUrl = detalleData;
      
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

    // Create a reference to 'detalles/todays-date.jpg'
    const metadata = {
      contentType: 'detalle/jpeg'
    };
    const detalleRef = storageRef.child(`Actividades/profile_${this.userUid}/${filename}.jpg`);

    detalleRef.putString(this.captureDataUrl, firebase.storage.StringFormat.DATA_URL ).then((snapshot)=> {
        // Do something here when the data is succesfully uploaded!
        
        snapshot.ref.getDownloadURL().then(downloadURL=> {
          console.log('File available at', downloadURL);     
          this.actividad.photo = downloadURL;  
        });
        console.log("des tomar ------>", this.actividad.photo);
        
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
