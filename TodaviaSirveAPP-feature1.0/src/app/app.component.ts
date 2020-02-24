import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { BuscarPage } from '../pages/buscar/buscar';
import { AboutPage } from "../pages/about/about";
import { RegistrarPage } from "../pages/registrar/registrar";
import { TabsPage } from '../pages/tabs/tabs';
import { PerfilPage } from '../pages/perfil/perfil';
import { LoginPage } from '../pages/login/login';
import { PublicarPage } from '../pages/publicar/publicar';
import { CamaraPage } from '../pages/camara/camara';
import { MisPublicacionesPage } from '../pages/mis-publicaciones/mis-publicaciones';
import { PublicacionesPage } from '../pages/publicaciones/publicaciones';
import { FavoritosPage} from '../pages/favoritos/favoritos';
import { EditarpublicacionPage } from '../pages/editarpublicacion/editarpublicacion';
import { Usuario } from '../pages/models/usuario.model';
import { UsuarioProvider } from "./../providers/usuario/usuario";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  usuario: Usuario = JSON.parse(localStorage.getItem('currentUser'));
  rootPage: any;
  pages: Array<{ title: string, component: any, icon: string }>;
  admin
  usuAux

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public usuProv : UsuarioProvider
  ) {
    
    this.initializeApp();
    // si hay usuario va al Home sino va al Login
    if (this.usuario) {
      this.rootPage = TabsPage;
    } else {
      this.rootPage = LoginPage;
    }
    console.log("pasando");
    this.usuProv.getUserObservable().subscribe(
      (data) => {
        this.usuAux = data;
        if(this.usuAux && this.usuAux.id == 99)
        {
          this.admin = true;
        }else{
          this.admin = false;
        }
        console.log(this.usuAux)
     }, (error) => {
         console.log(error);
     });
    
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: TabsPage, icon: 'home' },
      { title: 'Buscador', component: BuscarPage, icon: 'search' },
      { title: 'Reconocimiento', component: CamaraPage, icon: 'camera' },
      { title: 'Favoritos', component: FavoritosPage, icon: 'star'},
      { title: 'Mis Publicaciones', component: MisPublicacionesPage, icon: 'folder' },
      { title: 'Quienes somos', component: AboutPage, icon: 'contacts' },
    ];

  } // cierre constructor


  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    if(this.usuario && this.usuario.id == 99)
    {
      this.admin = true;
    }else{
      this.admin = false;
    }
    console.log("pasando");
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    /* this.nav.setRoot(page.component); */
    this.nav.push(page.component);
  }

  logout() {
    localStorage.clear(); //becausae i have information from user
    this.nav.setRoot(LoginPage);
  }

  irAEditarPublicaciones(){
    this.nav.push(PublicacionesPage, { "parentPage": this })
  }


}
