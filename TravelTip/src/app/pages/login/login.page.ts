import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from "../../servicios/auth.service";
import { UserService } from "../../servicios/user.service";
import { Usuario } from '../../models/usuario.model';
import { NgStyle } from '@angular/common';

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
  user1:Usuario=null;

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
      header: 'Forgot Password?',
      message: 'Enter you email address to send a reset link password.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirm',
          handler: async () => {
            const loader = await this.loadingCtrl.create({
              duration: 2000
            });

            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: 'Email was sended successfully.',
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

  goToHome() {
    this.navCtrl.navigateRoot('/home-results');
  }

  onSubmitLogin(){
    
    this.authService.login(this.email, this.password).then( res => {
      debugger;
      // this.getCurrentUser();
      
      this.authService.isAuth().subscribe(auth => {
        if (auth) {
          this.userUid = auth.uid;
          this.authService.isUserAdmin(this.userUid).subscribe(userRole => {
            this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
            this.isUser = Object.assign({}, userRole.roles).hasOwnProperty('user');
            // this.isAdmin = true;
          })
          this.usuarioService.getUser(this.userUid).subscribe(data =>{
            this.user1 = data;
          })
          this.usuarioService.setearUsuarioLogueado(this.user1);
        }
        
        this.presentToast("BIENVENIDO: " + this.user1.nombre + " " + this.user1.apellido);
      })
      
      if(this.isAdmin)
        this.navCtrl.navigateRoot('/lista-actividades');  
      else this.navCtrl.navigateRoot('/home-results');  
    }).catch(err => {
      // alert('Los datos son incorrectos')
      console.error(err);
      this.presentToast("USUARIO INCORRECTO");
    })
  }
  async presentToast(msj: string) {
    const toast = await this.toastCtrl.create({
      message: msj,
      duration: 3000,
      position: 'top',      
    });

    await toast.present();
  }
  
  getCurrentUser() {
    this.authService.isAuth().subscribe(auth => {
      if (auth) {
        this.userUid = auth.uid;
        this.authService.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
          this.isUser = Object.assign({}, userRole.roles).hasOwnProperty('user');
          // this.isAdmin = true;
        })
      }
    })
  }

}
