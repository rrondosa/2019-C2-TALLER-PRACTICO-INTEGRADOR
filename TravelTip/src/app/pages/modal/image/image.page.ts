import { Component, Input, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ActividadService } from 'src/app/servicios/actividad.service';
import { Actividad } from 'src/app/models/actividad.model ';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  MarkerOptions,
  Marker,
  Geocoder,
  GeocoderResult,
  Spherical,
  Environment
} from "@ionic-native/google-maps";
import { Geolocation } from '@ionic-native/geolocation/ngx'

declare var google;

@Component({
  selector: 'app-image',
  templateUrl: './image.page.html',
  styleUrls: ['./image.page.scss'],
})
export class ImagePage implements OnInit {
  @Input() value: any;
  public image: any;
  value2: any;
  actividad :Actividad={};
  public URLDrive ="https://www.google.com/maps/dir/?api=1";

  constructor(
    private nav: NavController,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private actividadSrv : ActividadService,
    private geolocation: Geolocation
  ) {
   
  }

  ngOnInit() {
    // this.image = this.sanitizer.bypassSecurityTrustStyle(this.value);
    debugger;
    console.log(this.value);
    this.actividadSrv.getOneActividad(this.value).subscribe(a=>{
      this.actividad =a;
      console.log(this.actividad);
     
      this.geolocation. getCurrentPosition () .then ((resp) => { 
        console.log(resp);
        
        }). catch ((error) => { 
          console.log ('Error al obtener ubicación', error); 
        });
      // Geocoder.geocode({
      //   "address": this.actividad.direccion
      // })
      // .then((results: GeocoderResult[]) => {
      //   console.log(results);
        
      //   if (results.length > 0) {
      //     this.actividad.position =results[0].position;
      //   } else {
      //     alert("Not found");
      //   }
      // });

      this.actividad.drive = this.URLDrive+"&destination="+this.actividad.position.lat+","+this.actividad.position.lng+"&travelmode=transit";
      
      
    });
    
  }
  
  closeModal() {
    this.modalCtrl.dismiss();
  }

}
