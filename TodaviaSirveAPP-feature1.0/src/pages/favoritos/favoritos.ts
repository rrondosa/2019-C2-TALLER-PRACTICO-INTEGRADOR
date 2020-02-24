import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { PublicacionProvider } from '../../providers/publicacion/publicacion';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { DetallePage } from '../detalle/detalle';
/**
 * Generated class for the FavoritosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favoritos',
  templateUrl: 'favoritos.html',
})
export class FavoritosPage {

  publicaciones
  usuario
  prefixURL: string = "https://todaviasirve.azurewebsites.net/Content/Images/";
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public usuarioProvider: UsuarioProvider,
    public loadingCtrl: LoadingController,
    public publicacionProvider: PublicacionProvider) {

    this.usuario = this.usuarioProvider.obtenerUsuarioLogueado();
  }

  ionViewDidEnter() {

    this.presentLoading();

    /* this.publicaciones = this.publicacionProvider.obtenerFavoritos(this.usuario.id); */
    this.publicacionProvider.obtenerFavoritos(this.usuario.id)
      .subscribe(data => {
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

  // LOADING...
  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: "espere por favor...",
    });
    this.loading.present();
  }

  doRefresh(refresher) {
    this.ionViewDidEnter();

    setTimeout(() => {
      refresher.complete();
    }, 500);
  }




}
