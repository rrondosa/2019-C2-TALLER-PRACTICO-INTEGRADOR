import { Component, OnInit } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Pages } from './interfaces/pages';

import { AuthService } from "./servicios/auth.service";
import { Usuario } from './models/usuario.model';
import { UserService } from "./servicios/user.service";
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

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
    private authservice : AuthService,
    private userService :UserService,
    private fireAuth :AngularFireAuth
  ) {

    
    this.initializeApp();
    // let user = this.fireAuth.auth.currentUser;
    // debugger;
    // if(user){
    //   // this.userAct = this.userService.getOneUser(user.uid);
    //   this.userService.getOneUser(this.userUid).subscribe(userdb => {
    //     this.userAct = userdb;
    //     this.userAct.photoUrl = user.photoURL;
    //     console.log("userDb",userdb);
      
    //   });
    // }else{
    //   console.log("NO SE LOGUEO");
    // }
   
    

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
  async ngOnInit(){
    await this.authservice.isAuth().subscribe(auth => {
      // debugger;
      if (auth) {
        this.userUid = auth.uid;
        console.log("auth",auth);
        
        this.userService.getOneUser(this.userUid).subscribe(userdb => {
          this.userAct = userdb;
          this.userAct.photoUrl = auth.photoURL;
          console.log("userDb",userdb);
        
        });
        
        this.authservice.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
        })
      }
    })
    
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
