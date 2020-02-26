import { Component, ViewChild, ElementRef } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController,
  IonSlides } from '@ionic/angular';

// Modals
import { SearchFilterPage } from '../../pages/modal/search-filter/search-filter.page';
import { ImagePage } from './../modal/image/image.page';
import { CrearActividadPage } from '../../pages/modal/crear-actividad/crear-actividad.page';
import { DetallePage } from '../../pages/modal/detalle/detalle.page';
// Call notifications test by Popover and Custom Component.
import { NotificationsComponent } from './../../components/notifications/notifications.component';

// geolocation
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ActividadService } from 'src/app/servicios/actividad.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { Usuario } from 'src/app/models/usuario.model';
import { UserService } from 'src/app/servicios/user.service';
import { Actividad } from 'src/app/models/actividad.model ';




declare var google;

@Component({
  selector: 'app-home-results',
  templateUrl: './home-results.page.html',
  styleUrls: ['./home-results.page.scss']
})
export class HomeResultsPage {
  @ViewChild('map') mapElement: ElementRef;
  
  // @ViewChild('slideWithNav') slideWithNav: Slides;
  @ViewChild('slideWithNav2') slideWithNav2: IonSlides;
  @ViewChild('slideWithNav3') slideWithNav3: IonSlides;
 
  // sliderOne: any;
  sliderTwo: any;
  sliderThree: any;
 
 
 
  //Configuration for each Slider
  slideOptsThree = {
    initialSlide: 0,
    slidesPerView: 3
  };
 
  slideOptsTwo = {
    initialSlide: 1,
    slidesPerView: 2,
    loop: true,
    centeredSlides: true
  };
  
  
  map: any;
  address:string;

  searchKey = '';
  yourLocation = 'Prueba Calle 123';
  themeCover = 'assets/img/ionic4-Start-Theme-cover.jpg';

  public isInvitado: any = null;
  public isAdmin: any = null;
  public isUser: any = null;
  
  public userUid: string = null;

  private userAct : Usuario = {};  

  private listaAdmin: Actividad[];
  private listaUser: Actividad[];

  private listaFav: Actividad[];

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public geolocation:Geolocation,
    private nativeGeocoder:NativeGeocoder,
    private actividadSvr:ActividadService,
    private authservice :AuthService,
    private userService : UserService
  ) {
    //user act
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
        this.authservice.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
        })
        this.authservice.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isUser = Object.assign({}, userRole.roles).hasOwnProperty('user');
        })
      }
    })
    //Item object for Food
    this.sliderTwo =
      {
        isBeginningSlide: true,
        isEndSlide: false,
        slidesItems: [
          {
            id: 1,
            image: 'assets/img/6.jpg'
          },
          {
            id: 2,
            image: 'assets/img/7.jpg'
          },
          {
            id: 3,
            image: 'assets/img/10.jpg'
          },
          {
            id: 4,
            image: 'assets/img/12.jpg'
          },
          {
            id: 5,
            image: 'assets/img/11.jpg'
          }
        ]
      };
      //Item object for Fashion
    this.sliderThree =
    {
      isBeginningSlide: true,
      isEndSlide: false,
      slidesItems: [
        {
          id: 6,
          image: 'assets/img/6.jpg'
        },
        {
          id: 7,
          image: 'assets/img/7.jpg'
        },
        {
          id: 8,
          image: 'assets/img/10.jpg'
        },
        {
          id: 9,
          image: 'assets/img/12.jpg'
        },
        {
          id: 10,
          image: 'assets/img/11.jpg'
        }
      ]
    };
  }

  //Move to Next slide
  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }
 
  //Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });;
  }
 
  //Method called when slide is changed by drag or navigation
  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }
 
  //Call methods to check if slide is first or last to enable disbale navigation  
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }
 
  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }

  async ngOnInit() {
    this.loadMap();
        
    this.listaAct0();
    this.listaUserAll();
       
  }
  listaActAll(){
    this.actividadSvr.getAllactividades().subscribe(l=>{
      this.listaAdmin= l;
      console.log("lista para adm all",this.listaAdmin);
    });
  }
  listaAct0(){
    this.actividadSvr.getAllActividadesCreadas().subscribe( l =>{
      this.listaAdmin= l;
      console.log("lista para adm 0 ",this.listaAdmin);
    });
  }
  listaAct3(){
    this.actividadSvr.getAllActividadesRechazadas().subscribe( l =>{
      this.listaAdmin= l;
      console.log("lista para adm 0 ",this.listaAdmin);
    });
  }
  listaAct1(){
    this.actividadSvr.getAllActividadesOk().subscribe(l=>{
      this.listaAdmin= l;
      console.log("lista para adm 1",this.listaAdmin);
    });
  }
  listaUser0(){
    this.authservice.isAuth().subscribe(auth => {
      if (auth) {
      debugger
        this.actividadSvr.getAllActividadesUserCurrentsCreadas(auth.uid).subscribe(l2=>{
          this.listaUser= l2;
          console.log("lista para user 0",this.listaUser);
        });
      }
    })
  }
  listaUser3(){
    this.authservice.isAuth().subscribe(auth => {
      if (auth) {
      
        this.actividadSvr.getAllActividadesUserCurrentsRechazada(auth.uid).subscribe(l2=>{
          this.listaUser= l2;
          console.log("lista para user 3",this.listaUser);
        });
      }
    })
  }
  listaUserAll(){
    this.authservice.isAuth().subscribe(auth => {
      if (auth) {
      
        this.actividadSvr.getAllActividadesUserCurrents(auth.uid).subscribe(l2=>{
          this.listaUser= l2;
          console.log("lista user all",this.listaUser);
        });
      }
    })
  }
  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.map.addListener('tilesloaded', () => {
        console.log('accuracy',this.map);
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
      });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords "+lattitude+" "+longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if(value.length>0)
          responseAddress.push(value);

        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value+", ";
        }
        this.address = this.address.slice(0, -2);
        this.yourLocation = this.address;
      })
      .catch((error: any) =>{ 
        this.address = "Address Not Available!";
      });

  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  settings() {
    this.navCtrl.navigateForward('settings');
  }

  async alertLocation() {
    const changeLocation = await this.alertCtrl.create({
      header: 'Change Location',
      message: 'Type your Address.',
      inputs: [
        {
          name: 'location',
          placeholder: 'Enter your new Location',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Change',
          handler: async (data) => {
            console.log('Change clicked', data);
            this.yourLocation = data.location;
            const toast = await this.toastCtrl.create({
              message: 'Location was change successfully',
              duration: 3000,
              position: 'top',
              closeButtonText: 'OK',
              showCloseButton: true
            });

            toast.present();
          }
        }
      ]
    });
    changeLocation.present();
  }

  async searchFilter () {
    const modal = await this.modalCtrl.create({
      component: SearchFilterPage
    });
    return await modal.present();
  }
  async addActividad () {
    const modal = await this.modalCtrl.create({
      component: CrearActividadPage
    });
    return await modal.present();
  }
  

  async presentImage(image: any) {
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: image }
    });
    return await modal.present();
  }
  async detalleAdm(image: any) {
    const modal = await this.modalCtrl.create({
      component: DetallePage ,
      componentProps: { value: image }
    });
    return await modal.present();
  }

  async notifications(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: NotificationsComponent,
      event: ev,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
  }

}
