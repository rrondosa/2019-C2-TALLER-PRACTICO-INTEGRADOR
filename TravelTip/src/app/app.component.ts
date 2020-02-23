import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Pages } from './interfaces/pages';

import { AuthService } from "./servicios/auth.service";
import { Usuario } from './models/usuario.model';
import { UserService } from "./servicios/user.service";


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
  public userAct: Usuario ={};
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    public authservice : AuthService,
    public userService :UserService
  ) {
    
    this.initializeApp();
    this.getCurrentUser();
    if(this.userUid){
      this.userService.getOneUser(this.userUid).subscribe(book => {
        this.userAct = book;
      });
      console.log("user act:",this.userAct);
      
    } else console.log("NO SE LOGUEO");
    
    

    this.appPages = [
      {
        title: 'Home',
        url: '/home-results',
        direct: 'root',
        icon: 'home'
      },
      {
        title: 'About',
        url: '/about',
        direct: 'forward',
        icon: 'information-circle-outline'
      },

      {
        title: 'App Settings',
        url: '/settings',
        direct: 'forward',
        icon: 'cog'
      }
    ];


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
    localStorage.clear();
    this.authservice.logout();
  }

  getCurrentUser() {
    this.authservice.isAuth().subscribe(auth => {
      if (auth) {
        this.userUid = auth.uid;
        this.authservice.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
        })
      }
    })
  }

}
