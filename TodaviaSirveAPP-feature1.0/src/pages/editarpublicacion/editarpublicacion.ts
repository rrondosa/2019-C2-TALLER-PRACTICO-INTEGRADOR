import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PublicacionProvider } from '../../providers/publicacion/publicacion';
import { Publicacion } from '../models/publicacion.model';
import { PublicacionesPage } from '../publicaciones/publicaciones';


@IonicPage()
@Component({
  selector: 'page-editarpublicacion',
  templateUrl: 'editarpublicacion.html',
})
export class EditarpublicacionPage {

  publicacion: Publicacion;
  img
  imagesPath = "https://todaviasirve.azurewebsites.net/Content/Images/"
  /* imagesPath = "http://localhost:55081/Content/Images/" */

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public publicacionProvider: PublicacionProvider
    ) {

      this.publicacion = navParams.get("publi");
  }

  ionViewDidLoad() {
 
  }

  onFileChanged(event) {
    this.publicacion.imagenPortada = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.img = event.target.result;
    }
    if (this.publicacion.imagenPortada){
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  editarPublicacion(){
    this.publicacionProvider.editarPublicacion(this.publicacion);
      this.navCtrl.pop();
  }

} // cierre clase
