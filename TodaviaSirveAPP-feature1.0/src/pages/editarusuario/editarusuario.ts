import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { Usuario } from '../models/usuario.model';
import { PerfilPage } from '../perfil/perfil';
import { TabsPage } from '../tabs/tabs';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-editarusuario',
  templateUrl: 'editarusuario.html',
})
export class EditarusuarioPage implements OnInit {

  usuario: Usuario;
  signupform: FormGroup;
  img



  pathImages = "http://todaviasirve.azurewebsites.net/Content/Images/"

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public usuarioProvider: UsuarioProvider,
    public toastCtrl: ToastController,
  ) {

    this.usuario = this.usuarioProvider.obtenerUsuarioLogueado();
    
  }

  ionViewDidLoad() {
    this.img = localStorage.getItem("imagenTemp"); // IMAGEN TEMP
  }

  ngOnInit(): void {

    // validaciones
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.signupform = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(3), Validators.maxLength(30)]),
      apellido: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(3), Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
      username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(3), Validators.maxLength(30)]),
      password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)])
    });
  }


  editarUsuario() {
    this.usuarioProvider.editarUsuario(this.usuario.id, this.usuario)
    this.usuarioProvider.setearUsuarioLogueado(this.usuario);
    if (this.img) {
      localStorage.setItem("imagenTemp", this.img);    // GUARDA LA IMAGEN TEMPORALMENTE
    }
    this.presentToast("Vuelva a Iniciar Sesion para efectuar los cambios");
    this.navCtrl.popTo(HomePage);

  } // cierre editarUsuario()


  onFileChanged(event) {
    this.usuario.imagen = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.img = event.target.result;
    }
    if (this.usuario.imagen){
      reader.readAsDataURL(event.target.files[0]);
    }
  }


  presentToast(msj: string) {
    const toast = this.toastCtrl.create({
      message: msj,
      duration: 2500,
      position: 'top',      
    });

    toast.present();
  }


} // cierre clase
