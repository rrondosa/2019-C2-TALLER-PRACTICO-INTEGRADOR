import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Pages } from './interfaces/pages';

import { AuthService } from "./servicios/auth.service";
import { Usuario } from './models/usuario.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public appPages: Array<Pages>;
  public isAdmin: any = null;
  public isUser: any = null;
  public userUid: string = null;

  usuario: Usuario =  localStorage.getItem('currentUser') == "undefined" ? null: JSON.parse(localStorage.getItem('currentUser'));

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    public authservice : AuthService
  ) {
    debugger;
    if(this.usuario!=null){
      this.authservice.isAuth().subscribe(auth => {
        if (auth) {
          this.userUid = auth.uid;
          this.authservice.isUserAdmin(this.userUid).subscribe(userRole => {
            this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
            this.isUser = Object.assign({}, userRole.roles).hasOwnProperty('user');
            // this.isAdmin = true;
          })
        }
      })
      console.log("isAdmin",this.isAdmin);
      console.log("isUser",this.isUser);
      
      if(this.isAdmin){
        this.appPages = [
          {
            title: 'Home admin',
            url: '/lista-actividades',
            direct: 'root',
            icon: 'home',
          },
          {
            title: 'About',
            url: '/about',
            direct: 'forward',
            icon: 'information-circle-outline'
          }
        ];
      } 
      if(this.isUser){
        this.appPages = [
          {
            title: 'Home User',
            url: '/home-results',
            direct: 'root',
            icon: 'home',
          },
          {
            title: 'App Settings',
            url: '/settings',
            direct: 'forward',
            icon: 'cog'
          }
          ];
      }
    }  
    
      this.appPages = [
      {
        title: 'Home',
        url: '/maps',
        direct: 'root',
        icon: 'home',
      },
      {
        title: 'About',
        url: '/about',
        direct: 'forward',
        icon: 'information-circle-outline'
      }
      ];
    
    this.initializeApp();
  }

  initializeApp() {    
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    }).catch(() => {});
  }

  goToEditProgile() {
    this.navCtrl.navigateForward('edit-profile');
  }

  logout() {
    // this.navCtrl.navigateRoot('/');
    this.authservice.logout();
  }


}
