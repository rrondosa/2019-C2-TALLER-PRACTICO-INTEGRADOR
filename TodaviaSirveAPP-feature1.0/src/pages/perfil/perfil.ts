import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario/usuario';

import { Usuario } from "../models/usuario.model";
import { EditarusuarioPage } from '../editarusuario/editarusuario';
import { LoginPage } from '../login/login';


@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  usuarioLogueado
  loading

  imagenLS

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public usuarioProvider: UsuarioProvider,
    public viewCtrl: ViewController  // se agrego por el popover
  ) {
    
    this.usuarioLogueado = this.usuarioProvider.obtenerUsuarioLogueado();
  }

  ionViewDidLoad() {
    this.imagenLS = localStorage.getItem("imagenTemp"); // IMAGEN TEMP
  }

  irAEditarUsuario() {
    this.navCtrl.push(EditarusuarioPage);
    this.viewCtrl.dismiss() // se agrego por el popover
  }

  cerrarSesion() {
    localStorage.clear(); //becausae i have information from user
    this.navCtrl.setRoot(LoginPage);
  }

}
