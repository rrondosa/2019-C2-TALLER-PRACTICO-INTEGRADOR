import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Menu, MenuController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { LoginProvider } from "../../providers/login/login";
import { HttpErrorResponse, HttpClient, HttpResponse, HttpHeaderResponse } from '@angular/common/http';
import { TabsPage } from '../tabs/tabs';

import { UsuarioProvider } from "../../providers/usuario/usuario";
import { Usuario } from '../models/usuario.model';
import { RegistrarPage } from '../registrar/registrar';
import { MyApp } from '../../app/app.component';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {


  signupform: FormGroup;
  userData = { "email": "", "password": "" };
  loading: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loginProvider: LoginProvider,
    public toastCtrl: ToastController,
    public usuarioProvider: UsuarioProvider,
    public loadingCtrl: LoadingController
  ) {

    this.loading = this.loadingCtrl.create({ content: " espere por favor..." });
    this.loading.present();
  }

  ngOnInit(): void {


    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.signupform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)])
    });
  }

  ionViewDidLoad() {
    this.loading.dismiss();
  }

  loguearUsuario() {

    this.loading = this.loadingCtrl.create({ content: " espere por favor..." });
    this.loading.present();

    var usuario = this.loginProvider.estaRegistrado(this.userData.email, this.userData.password).map(data => <Usuario>data);

    usuario.subscribe(res => {
      console.log(res);
      this.loading.dismiss();
      this.usuarioProvider.setearUsuarioLogueado(res);
      this.presentToast("BIENVENIDO: " + res.nombre + " " + res.apellido);
    },
      error => {
        console.error(error);
        this.loading.dismiss();
        this.presentToast("USUARIO INCORRECTO");
      },
      () => this.navCtrl.push(TabsPage)
     
    );

      let active = this.navCtrl.getActive(); // or getByIndex(int) if you know it
      console.log(active.index);
      // this.navCtrl.remove(active.index);
      // this.navCtrl.push(active.component);

  } // cierre metodo


  presentToast(msj: string) {
    const toast = this.toastCtrl.create({
      message: msj,
      duration: 3000,
      position: 'top',      
    });

    toast.present();
  }

  irARegistrar() {
    this.navCtrl.push(RegistrarPage);
  }



} // cierre clase
