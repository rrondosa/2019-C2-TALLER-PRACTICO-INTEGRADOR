import { Component, NgZone , ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Platform } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-map-restaurante',
  templateUrl: './map-restaurante.page.html',
  styleUrls: ['./map-restaurante.page.scss'],
})
export class MapRestaurantePage{
  userLocation;
  userCity;
  lat;
  lng;
  location;
  latLngResult;
  userLocationFromLatLng;
  latlngMaps;
  places : Array<any> ; 

  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  constructor(public zone: NgZone, public geolocation: Geolocation, private nativeGeocoder: NativeGeocoder, private platform: Platform) {
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.getUserLocation();
      
    });
  }
  
  getUserLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      // this.getGeoLocation(resp.coords.latitude, resp.coords.longitude)
      if (this.platform.is('cordova')) {
        let options: NativeGeocoderOptions = {
          useLocale: true,
          maxResults: 5
        };
        this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options)
          .then((result: any) => {
            console.log(result)
            this.userLocation = result[0]
            console.log(this.userLocation)
          })
          .catch((error: any) => console.log(error));
      } else {
        this.getGeoLocation(resp.coords.latitude, resp.coords.longitude);
        this.displayGoogleMap(resp.coords.latitude, resp.coords.longitude);
        console.log('rey1',resp.coords.latitude);
        console.log(resp.coords.longitude);
      }
    }).catch((error) => {
    });
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };
      if (this.platform.is('cordova')) {
        let options: NativeGeocoderOptions = {
          useLocale: true,
          maxResults: 5
        };
        this.nativeGeocoder.reverseGeocode(data.coords.latitude, data.coords.longitude, options)
          .then((result: NativeGeocoderResult[]) => {
            console.log(result)
            this.userLocation = result[0]
            console.log(this.userLocation)
          })
          .catch((error: any) => console.log(error));
      } else {
        console.log('not cordove');
        this.getGeoLocation(data.coords.latitude, data.coords.longitude);
        this.displayGoogleMap(data.coords.latitude, data.coords.longitude);
        console.log(data.coords.latitude);
        console.log(data.coords.longitude);
      }
    });
  }

  displayGoogleMap(lat: number, lng: number) {
    const latLng = new google.maps.LatLng(lat, lng);

    const mapOptions = {
      center: latLng,
      disableDefaultUI: true,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(document.getElementById('map') , mapOptions);

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      title: 'Usted esta aquí!'
    });
    this.getRestaurants(latLng).then((results : Array<any>)=>{
      this.places = results;
      console.log(this.places);
      for(let i = 0 ;i < results.length ; i++)
      {
          this.createMarker(results[i]);
      }
    },(status)=>console.log(status));

    this.addMarker();
  }

  async getGeoLocation(lat: number, lng: number, type?) {
    if (navigator.geolocation) {
      let geocoder = await new google.maps.Geocoder();
      let latlng = await new google.maps.LatLng(lat, lng);
      let request = { latLng: latlng };

      await geocoder.geocode(request, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          let result = results[0];
          this.zone.run(() => {
            if (result != null) {
              this.userCity = result.formatted_address;
              if (type === 'reverseGeocode') {
                this.latLngResult = result.formatted_address;
                console.log(this.latLngResult);
              }
            }
          })
        }
      });
    }
  }
  getRestaurants(latLng){
    var service = new google.maps.places.PlacesService(this.map);
    let request = {
        location : latLng,
        radius : 500 ,
        types: ["restaurant","cafe","pizzeria"]
    };
    return new Promise((resolve,reject)=>{
        service.nearbySearch(request,function(results,status){
            if(status === google.maps.places.PlacesServiceStatus.OK)
            {
                resolve(results);    
            }else
            {
                reject(status);
            }

        }); 
    });

  }
  createMarker(place){
    var image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(20, 20)
    };
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: place.geometry.location,
      title: place.name,
      icon:image
    });   
  } 
  addMarker(){

    let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.map.getCenter()
    });

    let content = "<p>Tu posición actual !</p>";          
    let infoWindow = new google.maps.InfoWindow({
    content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
    });

  }
  // otres
  reverseGeocode(lat, lng) {
    if (this.platform.is('cordova')) {
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };
      this.nativeGeocoder.reverseGeocode(lat, lng, options)
        .then((result: NativeGeocoderResult[]) => this.userLocationFromLatLng = result[0])
        .catch((error: any) => console.log(error));
    } else {
      this.getGeoLocation(lat, lng, 'reverseGeocode');
    }
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
          })
        } else {
          alert('Error - ' + results + ' & Status - ' + status)
        }
      });
    }
  }

  

}
