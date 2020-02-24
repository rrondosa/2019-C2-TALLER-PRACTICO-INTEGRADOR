import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PublicacionProvider } from "../../providers/publicacion/publicacion";
import { DetallePage } from '../detalle/detalle';


@IonicPage()
@Component({
  selector: 'page-buscar',
  templateUrl: 'buscar.html',
})
export class BuscarPage {

  publicaciones: any = "";
  prefixURL: string = "https://todaviasirve.azurewebsites.net/Content/Images/";
  titulo: any;

  mostrar = false

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public publicacionService: PublicacionProvider,
  ) {
  }

  ionViewDidLoad() {
  }

  buscarPublicacion() {
    this.mostrar = false;
    this.publicaciones = this.publicacionService.buscarPublicacion(this.titulo);

    this.publicaciones.subscribe( res => {
      if (res["0"] == null) {
        console.log("no se encontro nada");
        this.mostrar = true;
      }
    })
  }

  irADetalle(publi) {
    this.navCtrl.push(DetallePage, { publi });
  }



} // cierre clase
