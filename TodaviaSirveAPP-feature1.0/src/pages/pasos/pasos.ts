import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PublicacionProvider } from "../../providers/publicacion/publicacion";
import { Paso } from '../models/paso.model';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-pasos',
  templateUrl: 'pasos.html',
})
export class PasosPage {

  img;
  paso: Paso = <Paso>{};
  idPublicacion// id traido de publicacion
  pasoNro: number;

  numeros = [1,2,3,4,5,6,7,8,9,10];
  numeropaso;
  pasoAux
  nombreIncremento

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public publicacionProvider: PublicacionProvider
  ) {

    this.idPublicacion = navParams.get("idPubli");
    this.pasoAux = navParams.get("numPaso");
    console.log("numero de paso Aux: "+ this.pasoAux);
    this.nombreIncremento = "file-input"+this.pasoAux
    console.log(this.nombreIncremento);
  }

  ionViewDidLoad() {  }


  submitPaso() {
    this.paso.numero = this.pasoAux -1;
    console.log("numero de paso :"+ this.paso.numero);
    this.pasoAux = this.pasoAux +1;
    console.log("paso Aux siguiente: "+ this.pasoAux);
    this.publicacionProvider.subirPaso(this.paso, this.idPublicacion);
    this.navCtrl.push(PasosPage, { "idPubli": this.idPublicacion, "numPaso" : this.pasoAux })
  }

  onFileChanged(event) {
    this.paso.imagen = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.img = event.target.result;
    }
    if (this.paso.imagen) {
      reader.readAsDataURL(event.target.files[0]);
    }
  }


  irAHome(){
    if(this.paso.descripcion != null && this.paso.descripcion.length > 5){
      this.paso.numero = this.pasoAux -1;
    console.log("numero de paso :"+ this.paso.numero);
         this.publicacionProvider.subirPaso(this.paso, this.idPublicacion);
          this.navCtrl.setRoot(TabsPage);
    }else{
      this.navCtrl.setRoot(TabsPage);
    }
  }

} // cierre clase
