import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LoginPage } from '../login/login';


@IonicPage()
@Component({
  selector: 'page-registrar',
  templateUrl: 'registrar.html',
})
export class RegistrarPage implements OnInit {

  nombre = "";
  apellido = "";
  email = "";
  username = "";
  pass = "";
  imagen;

  signupform: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient
  ) {
  }

  ionViewDidLoad() {
  }

  ngOnInit(): void {

    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.signupform = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(3), Validators.maxLength(30)]),
      apellido: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(3), Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
      username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(3), Validators.maxLength(30)]),
      password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)])
    });
  }

  submitUsuario() {
    /* let pathURL = "http://localhost:55081/Api/Usuario" */
    let pathURL = "http://todaviasirve.azurewebsites.net/Api/Usuario"

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('enctype', 'multipart/form-data;charset=UTF-16'); 
    headers.append('Accept-Charset', 'utf-8');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');

    var formData = new FormData();
    formData.append("username", this.username);
    formData.append("pass", this.pass);
    formData.append("nombre", this.nombre);
    formData.append("apellido", this.apellido);
    formData.append("email", this.email);
    formData.append("imagen", this.imagen);

    this.http.post( pathURL, formData, { headers: headers } )
      .subscribe(res => { alert("success " + res); },
        (err) => { alert("failed"); }
      );

    console.log(formData);

    this.irALogin()

  } // cierre metodo
  

  onFileChanged(event) {
    this.imagen = event.target.files[0];
  }

  irALogin(){
    this.navCtrl.push(LoginPage);
   }



} // cierre clase
