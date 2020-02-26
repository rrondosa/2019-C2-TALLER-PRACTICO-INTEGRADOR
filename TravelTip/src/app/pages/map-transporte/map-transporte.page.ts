import { Component, OnInit, NgZone } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';

// Import classes from maps module
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  MarkerOptions,
  Marker,
  GoogleMapOptions,
  Environment,
  MyLocation,
  GoogleMapsAnimation,
  Geocoder,
  BaseArrayClass,
  GeocoderResult,
  ILatLng,
  MarkerCluster,
  MarkerIcon,
  HtmlInfoWindow,
  Spherical
} from "@ionic-native/google-maps";

import { Platform, NavController, LoadingController, ModalController } from "@ionic/angular";
import { PasajeObjService } from '../../servicios/pasaje-obj.service';
import { Router } from '@angular/router';

// Modals
import { SearchFilterPage } from '../../pages/modal/search-filter/search-filter.page';
import { ImagePage } from './../modal/image/image.page';

declare var google:any;

@Component({
  selector: 'app-map-transporte',
  templateUrl: './map-transporte.page.html',
  styleUrls: ['./map-transporte.page.scss'],
})

export class MapTransportePage  implements OnInit {

  public map: GoogleMap;
  public markerCluster: MarkerCluster 
  private loading : any;
  public search: string ='';
  myLocation: MyLocation;
  private googleAutocomplete = new google.maps.places.AutocompleteService();
  m = document.getElementById('map');
  private googlePlace = new google.maps.places.PlacesService(this.m);
  public searchResults = new Array<any>();
  public places: Array<any> ;
  public placeDetail: Array<any> ;

  public photo="../../assets/imgs/imagenNoDisponible.png";
  public tel = "+54 11 5993-7736";
  public web= "https://fb.facebook.com/pages/La-Taquiza-Delivery/403497273029744?fref=ts";
  public dire;
  public price_level;
  public horarios= [
    "Lunes: 8:00 am - 11:00 pm",
    "Martes: 8:00 am - 11:00 pm",
    "Miércoles: 8:00 am - 11:00 pm",
    "Jueves: 8:00 am - 11:00 pm",
    "Viernes: 8:00 am - 12:00 am",
    "Sábado: 8:00 am - 12:00 am",
    "Domingo: 8:00 am - 12:00 am"
  ];
  public URLDrive ="https://www.google.com/maps/dir/?api=1";
  public distancia;

  constructor(
    public platform: Platform,
    public nav: NavController,
    private loadingCtrl:LoadingController,
    private ngZone: NgZone,
    private geolocation: Geolocation,
    private pasajeObjService: PasajeObjService,
    private router:Router,
    public modalCtrl: ModalController
    ) {console.log(google)}    
   

  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
    const latlng  = await this.getLocation();
    await this.nearbysearch(latlng);

  }
 
  async loadMap() {
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE':'AIzaSyCTTx7gaEc-720DHT5jmCAk1Wq7A4k3dlw',
      'API_KEY_FOR_BROWSER_DEBUG':'AIzaSyCTTx7gaEc-720DHT5jmCAk1Wq7A4k3dlw'
    });
    
    this.loading = await this.loadingCtrl.create({message:'Por favor, aguarde... '});
    await this.loading.present();

    let mapOptions: GoogleMapOptions = {
      controls:{
        zoom:false
      }
    };

    this.map = GoogleMaps.create( 'map', mapOptions );
    
    try{

      await this.map.one(GoogleMapsEvent.MAP_READY);
      this.addOriginMarker();
      
 
    }catch(error){
      console.log(error);
    }
    
  }

  //se añade un maker original
  async addOriginMarker(){
    try {
      this.myLocation  = await this.map.getMyLocation();
      const latlng  = await this.getLocation();
      console.log(this.myLocation);

      await this.map.moveCamera({
        target: latlng,
        zoom:16
      });
      this.map.addMarkerSync({
        title:'Usted esta aquí!',
        icon: 'blue',
        animation: GoogleMapsAnimation.DROP,
        position: this.myLocation.latLng
      });
    } catch (error) {
      console.log(error);
    }finally{
      this.loading.dismiss();
    }
  }
  
  private async getLocation() {
    const rta = await this.geolocation.getCurrentPosition();
    return {
      lat: rta.coords.latitude,
      lng: rta.coords.longitude
    };
  }

  searchChanged(){
    if(!this.search.trim().length) return;

    this.googleAutocomplete.getPlacePredictions({input: this.search}, predictions =>{
      this.ngZone.run(()=>{
        this.searchResults = predictions;
        console.log(predictions);
        
      });
      

    });
  }

  async redirecionarMaker(e, result){
    this.loading = await this.loadingCtrl.create({
      message: 'Por favor, aguarde...'
    });
    await this.loading.present();
    this.map.clear();
    Geocoder.geocode({
      "address": result.description
    })
    .then((results: GeocoderResult[]) => {
      console.log(results);
      this.loading.dismiss();
  
      if (results.length > 0) {
        let marker: Marker = this.map.addMarkerSync({
          'position': results[0].position,
          'title':  'Usted esta aquí!',
          'icon': 'blue'
        });
        this.map.animateCamera({
          'target': marker.getPosition(),
          'zoom': 18
        });
  
        marker.showInfoWindow();
        this.search="";
        this.nearbysearch(results[0].position);
      } else {
        alert("Not found");
      }
    });
  }
  
  async nearbysearch(latlng){
    
    var request = {
      location: latlng,
      radius: '1000',
      types: ["taxi_stand","train_station","travel_agency"]
    }

    await this.googlePlace.nearbySearch(request, results =>{
      // this.ngZone.run(()=>{
       
        console.log('results',results);
        
        let POINTS: BaseArrayClass<any> = new BaseArrayClass<any>(results);
        
        let bounds: ILatLng[]= POINTS.map((data: any, idx: number) => {
          console.log('data',data);
          
          let cus_location = {
            lat: data.geometry.location.lat(),
            lng: data.geometry.location.lng()
          }
          debugger
          let metrs= Math.round(Spherical.computeDistanceBetween(latlng,cus_location));
          if(metrs >= 1000 )
          {
            let k = metrs*0.001;
            this.distancia = k+" Km"
          }else this.distancia=metrs+" m";

          console.log("distancia metros",this.distancia);
          
          if(data.photos) this.photo = data.photos[0].getUrl();
          let a =Math.floor(Math.random() * 4) + 0  ;
          switch(a){
            case 0:
              this.price_level="Gratis";
              break;
            case 1:
              this.price_level="Barato";
              break;
            case 2:
              this.price_level="Moderado";
              break;
            case 3:
              this.price_level="Costoso";
              break;
            case 4:
              this.price_level="Muy caro";
              break;
          }

          return {  "position": cus_location,
                    "name":data.name,
                    "imagen": data.icon,
                    "rating":data.rating,
                    "place_id":data.place_id,
                    "price_level": this.price_level,
                    "pos_origen":latlng,
                    "photo":this.photo,
                    "direccion":data.vicinity,
                    "web":this.web,
                    "tel":this.tel,
                    "drive":this.URLDrive+"&origin="+latlng.lat+","+latlng.lng+"&destination="+cus_location.lat+","+cus_location.lng+"&travelmode=transit",
                    "distanciaM":this.distancia
                  };
        });

        console.log('bounds',bounds);
        this.places = bounds;

        this.addCluster(bounds);
        
      // });
    })

  }
  async detalleLugar(placeId){

    this.googlePlace.getDetails({placeId: placeId}, resultsDetalle=>{
      console.log('resultsDetalle',resultsDetalle);
      return resultsDetalle;
    })
    return null;
  }
  
  async addCluster(data) {

    this.markerCluster= this.map.addMarkerClusterSync({
      markers: data,
      icons: [
        {
          min: 3,
          max: 9,
          url: "./assets/markercluster/small.png",
          label: {
            color: "white"
          }
        },
        {
          min: 10,
          url: "./assets/markercluster/large.png",
          label: {
            color: "white"
          }
        }
      ]
    });


    this.markerCluster.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {
      let marker: Marker = params[1];
      let icon2 : MarkerIcon ={
        'url': marker.get("imagen"),
        'size': {
          width: 25,
          height: 25
        }
      };
      marker.setIcon(icon2);
      marker.setTitle(marker.get("name")+"  "+ marker.get("distanciaM"));
      marker.setSnippet(marker.get("direccion"));
      marker.showInfoWindow();
      
    });

  }

  goReceiver(){
    debugger;
    this.pasajeObjService.sendListSource(this.places);
    this.router.navigate(['/map-lista']);
  }

  async searchFilter () {
    const modal = await this.modalCtrl.create({
      component: SearchFilterPage
    });
    return await modal.present();
  }


}
