import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from "../../servicios/auth.service";
import { UserService } from "../../servicios/user.service";
import { Usuario } from '../../models/usuario.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public onLoginForm: FormGroup;
  public email:string;
  public password:string;
  public isAdmin: any = null;
  public isUser: any = null;
  public userUid: string = null;
  loading: any;
  toast:any;
  public user: Usuario = {};

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public usuarioService: UserService,

  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {

    this.onLoginForm = this.formBuilder.group({
      'email': [null, Validators.compose([
        Validators.required
      ])],
      'password': [null, Validators.compose([
        Validators.required
      ])]
    });

  }

  async forgotPass() {
    const alert = await this.alertCtrl.create({
      header: '¿Se te olvidó tu contraseña?',
      message: 'Ingrese su email para enviar una contraseña para restablecer.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirma Cancelacion');
          }
        }, {
          text: 'Confirmar',
          handler: async () => {
            const loader = await this.loadingCtrl.create({
              duration: 2000
            });

            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: 'Se envió correctamente email.',
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // // //
  goToRegister() {
    this.navCtrl.navigateRoot('/register');
  }

  async onSubmitLogin(){
    
    this.authService.login(this.email, this.password).then( (res) => {
      
      this.presentToast("BIENVENID@!" );
      this.navCtrl.navigateRoot('/home-results');
    }).catch(err => {
      console.error(err);
      this.presentToast("USUARIO INCORRECTO");
    })
  }

  goToHome() {
    this.getCurrentUser();
    this.navCtrl.navigateRoot('/home-results');
  }

  async presentToast(msj: string) {
    const toast = await this.toastCtrl.create({
      message: msj,
      duration: 3000,
      position: 'middle',      
    });

    await toast.present();
  }
  
  getCurrentUser() {
    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.userUid = auth.uid;
        this.authService.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
        })
      }
    })
  }

  onLoginInvitado(){
    
    this.authService.login("invitado@travelhints.com", "123456").then( (res) => {
      
      this.presentToast("BIENVENID@ TRAVEL HINTS!" );
      this.navCtrl.navigateRoot('/home-results');
    }).catch(err => {
      console.error(err);
      this.presentToast("USUARIO INCORRECTO");
    })
  }

}
