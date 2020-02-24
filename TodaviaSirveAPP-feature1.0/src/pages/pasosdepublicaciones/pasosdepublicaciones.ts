import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ItemSliding, AlertController } from 'ionic-angular';
import { PasoProvider } from '../../providers/paso/paso';
import { Publicacion } from '../models/publicacion.model';
import { EditarpasoPage } from '../editarpaso/editarpaso';
import { PasosPage } from '../pasos/pasos';


@IonicPage()
@Component({
  selector: 'page-pasosdepublicaciones',
  templateUrl: 'pasosdepublicaciones.html',
})
export class PasosdepublicacionesPage {

  publicacion: Publicacion;
  pasos: any;
  imagesPath: string = "https://todaviasirve.azurewebsites.net/Content/Images/";
  loading;
  pasoAux
  cantPasos=0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public pasoProvider: PasoProvider,
    public alertCtrl: AlertController
    ) {

      this.publicacion = navParams.get("publi");
  }

  ionViewDidEnter() {
    this.pasoProvider.getPasosDePublicacion(this.publicacion.id)
      .subscribe(res =>{ 
        this.pasos = res
        for (let item in this.pasos){
              this.cantPasos = this.cantPasos+1;
        }
      });
  }

  irAEditarPaso(paso){
    this.navCtrl.push(EditarpasoPage, {
      paso: paso,
      portada : this.publicacion.imagenPortada
    })
  }


  borrarPaso(idPaso) {
    this.pasoProvider.borrarPaso(idPaso)
      .subscribe(res => {
        this.ionViewDidEnter();
        this.presentToast("Eliminado Correctamente");
      },
        (error) => {
          this.presentToast("Eliminacion Falló");
        }
      );
    console.log("Se borro el paso:" + idPaso);
    
  }

  irACrearPaso(){
    this.navCtrl.push(PasosPage, {"idPubli": this.publicacion.id,"numPaso" : this.cantPasos})
  }
  

  presentToast(msj: string) {
    const toast = this.toastCtrl.create({
      message: msj,
      duration: 3000,
      position: 'top',      
    });

    toast.present();
  }

  doRefresh(refresher) {
    this.ionViewDidEnter();

    setTimeout(() => {
      refresher.complete();
    }, 500);
  }


  mostrarConfirmacion(id, slidingItem: ItemSliding) {
    const confirm = this.alertCtrl.create({
      title: '¿Realmente quiere borrar este paso?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            slidingItem.close();
          }
        },
        {
          text: 'Borrar',
          handler: () => {
            this.borrarPaso(id);
          }
        }
      ]
    });
    confirm.present();
  }

} // cierre clase
