import { Component, OnInit } from '@angular/core';
import { PasajeObjService } from '../../servicios/pasaje-obj.service';
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
  HtmlInfoWindow
} from "@ionic-native/google-maps";
import { Observable } from 'rxjs';

declare var google:any;

@Component({
  selector: 'app-map-lista',
  templateUrl: './map-lista.page.html',
  styleUrls: ['./map-lista.page.scss'],
})
export class MapListaPage implements OnInit {
 
  public places: Array<any>;
  
  constructor(
    private pasajeObjService:PasajeObjService
  ) { }

  ngOnInit() {

    this.pasajeObjService.$getListSource.subscribe(list => 
      // this.tratarListaPlaces(list)
      this.places=list
      
    ).unsubscribe();

    // this.tratarListaPlaces(this.list);
  }


  
}
