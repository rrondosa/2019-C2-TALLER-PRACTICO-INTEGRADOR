import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ActionSheetController, AlertController, ItemSliding, ToastController } from 'ionic-angular';
import { PublicacionProvider } from '../../providers/publicacion/publicacion';
import { Publicacion } from '../models/publicacion.model';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { PublicarPage } from '../publicar/publicar';
import { DetallePage } from '../detalle/detalle';
import { EditarpublicacionPage } from '../editarpublicacion/editarpublicacion';
import { PasosdepublicacionesPage } from '../pasosdepublicaciones/pasosdepublicaciones';


@IonicPage()
@Component({
  selector: 'page-mis-publicaciones',
  templateUrl: 'mis-publicaciones.html',
})
export class MisPublicacionesPage {

  usuarioLog;
  publicaciones: any;
  imagesPath: string = "https://todaviasirve.azurewebsites.net/Content/Images/";
  loading;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public publicacionProvider: PublicacionProvider,
    public usuarioProvider: UsuarioProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
  ) {

    this.usuarioLog = this.usuarioProvider.obtenerUsuarioLogueado();
  }

  ionViewDidLoad() {
    this.presentLoading();
    this.publicacionProvider.obtenerPublicacionesUsuario(this.usuarioLog.id)
      .subscribe(
        (data) => {
          this.publicaciones = data;
          this.loading.dismiss();
        },
        (error) => {
          console.log(error);
          this.loading.dismiss();
        }
      )
  }

  irADetalle(publi) {
    this.navCtrl.push(DetallePage, { publi });
  }

  borrarPublicacion(idPubli) {
    this.publicacionProvider.borrarPublicacion(idPubli)
      .subscribe(res => {
        this.ionViewDidLoad();
        this.presentToast("Eliminado Correctamente");
      },
        (error) => {
          this.presentToast("Eliminacion Falló" + error);
        }
      );
    console.log("Se borro la publicacion:" + idPubli);

  }

  irAEditarPublicacion(publi, slidingItem: ItemSliding) {
    slidingItem.close();
    this.navCtrl.push(EditarpublicacionPage, { "publi": publi });
  }

  irAPasosDePublicacion(publi, slidingItem: ItemSliding) {
    slidingItem.close();
    this.navCtrl.push(PasosdepublicacionesPage, { "publi": publi });
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
    this.ionViewDidLoad();

    setTimeout(() => {
      refresher.complete();
    }, 500);
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

  irAPublicar() {
    this.navCtrl.push(PublicarPage);
  }


  // LOADING...
  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: "espere por favor...",
    });
    this.loading.present();
  }


}
