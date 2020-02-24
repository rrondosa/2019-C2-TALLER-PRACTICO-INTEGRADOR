import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { PublicacionProvider } from '../../providers/publicacion/publicacion';
import { Publicacion } from '../models/publicacion.model';
import { PasosPage } from '../pasos/pasos';
import { JsonPipe } from '@angular/common';
import { stringify } from '@angular/core/src/util';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { Usuario } from '../models/usuario.model';

@IonicPage()
@Component({
  selector: 'page-publicar',
  templateUrl: 'publicar.html',
})
export class PublicarPage {

  usuario: Usuario;
  img
  publicacion: Publicacion = <Publicacion>{};
  publi
  fechaHoy: String = new Date().toISOString();
  idPubli

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public publicacionProvider: PublicacionProvider,
    public usuarioProvider: UsuarioProvider
  ) {
    this.usuario = usuarioProvider.obtenerUsuarioLogueado();
  }

  ionViewDidLoad() { }

  submitPublicacion() {
    this.publicacion.fechaSubida = this.fechaHoy;
    this.publicacion.idUsuario = this.usuario.id;
    this.publicacionProvider.subirPublicacion(this.publicacion)
      .subscribe(res => {
        this.idPubli = res;
        this.navCtrl.push(PasosPage, { "idPubli": this.idPubli, "numPaso" : 2 });
        console.log("ID de Publicacion: ", this.idPubli);
      });
  }

  cargaArchivo(event) {
    this.publicacion.imagenPortada = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.img = event.target.result;
    }
    if (this.publicacion.imagenPortada) {
      reader.readAsDataURL(event.target.files[0]);
    }
  }

} // cierre clase
