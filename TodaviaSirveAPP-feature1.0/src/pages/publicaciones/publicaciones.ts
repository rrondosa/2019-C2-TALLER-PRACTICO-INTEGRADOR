import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ItemSliding, AlertController } from 'ionic-angular';
import { PublicacionProvider } from '../../providers/publicacion/publicacion';
import { DetallePage } from '../detalle/detalle';
import { EditarpublicacionPage } from '../editarpublicacion/editarpublicacion';
import { PasosdepublicacionesPage } from '../pasosdepublicaciones/pasosdepublicaciones';
import { PublicarPage } from '../publicar/publicar';
import { HomePage } from '../home/home';



@IonicPage()
@Component({
  selector: 'page-publicaciones',
  templateUrl: 'publicaciones.html',
})
export class PublicacionesPage {

  publicaciones: any;
  imagesPath: string = "https://todaviasirve.azurewebsites.net/Content/Images/";
  loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public publicacionProvider: PublicacionProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController
  ) {
  }


  ionViewDidEnter() {
    this.presentLoading();
    this.publicacionProvider.obtenerTodasPublicaciones()
      .subscribe(
        (data) => {
          this.publicaciones = data;
          this.loading.dismiss(); 
        },
        (error) => {
          console.log(error);
          this.loading.dismiss(); 
        }) 
  }

  irADetalle(publi) {
    this.navCtrl.push(DetallePage, { publi });
  }

  borrarPublicacion(idPubli) {
    this.publicacionProvider.borrarPublicacion(idPubli)
      .subscribe(res => {
        this.ionViewDidEnter();
        this.presentToast("Eliminado Correctamente");
      },
        (error) => {
          this.presentToast("Eliminacion Falló" + error);
        }
      );
    console.log("Se borro la publicacion:" + idPubli);
    
  }

  irAEditarPublicacion(publi, slidingItem: ItemSliding){
    slidingItem.close();
    this.navCtrl.push(EditarpublicacionPage, { "publi" : publi } );
  }

  irAPasosDePublicacion(publi, slidingItem: ItemSliding){
    slidingItem.close();
    this.navCtrl.push(PasosdepublicacionesPage, { "publi" : publi } );
  }

  presentToast(msj: string) {
    const toast = this.toastCtrl.create({
      message: msj,
      duration: 3000,
      position: 'top',      
    });

    toast.present();
  }

  // REFRESH
  doRefresh(refresher) {
    this.ionViewDidEnter();

    setTimeout(() => {
      refresher.complete();
    }, 500);
  }

  // LOADING...
  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: "espere por favor...",
    });
    this.loading.present();
  }


  mostrarConfirmacion(id, slidingItem: ItemSliding) {
    const confirm = this.alertCtrl.create({
      title: '¿Realmente quiere borrar la publicación?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            slidingItem.close();
            console.log('Cancelar clicked');
          }
        },
        {
          text: 'Borrar',
          handler: () => {
            this.borrarPublicacion(id);
            console.log('Borrar clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  irAPublicar(){
    this.navCtrl.push(PublicarPage);
  }


}
