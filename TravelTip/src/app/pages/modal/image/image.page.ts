import { Component, Input, OnInit, NgZone } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ActividadService } from 'src/app/servicios/actividad.service';
import { Actividad } from 'src/app/models/actividad.model ';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import {NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult} from '@ionic-native/native-geocoder/ngx';
import { Platform } from '@ionic/angular';
declare var google;

@Component({
  selector: 'app-image',
  templateUrl: './image.page.html',
  styleUrls: ['./image.page.scss'],
})
export class ImagePage implements OnInit {
  @Input() value: any;
  public image: any;
  lat;lng;
  value2: any;
  actividad :Actividad={};
  public URLDrive ="https://www.google.com/maps/dir/?api=1";

  constructor(
    private nav: NavController,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private actividadSrv : ActividadService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private platform:Platform,
    public zone: NgZone,
  ) {
   
  }

  ngOnInit() {
    // this.image = this.sanitizer.bypassSecurityTrustStyle(this.value);
    debugger;
    console.log(this.value);
    this.actividadSrv.getOneActividad(this.value).subscribe(a=>{
      this.actividad =a;
      console.log(this.actividad);
      this.forwardGeocode(this.actividad.direccion);
      
      console.log(this.actividad);
      
      console.log("lat....................",this.actividad);
      
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

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
