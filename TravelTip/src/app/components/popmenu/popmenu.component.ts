import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { UserService } from 'src/app/servicios/user.service';

@Component({
  selector: 'popmenu',
  templateUrl: './popmenu.component.html',
  styleUrls: ['./popmenu.component.scss']
})
export class PopmenuComponent implements OnInit {
  openMenu: Boolean = false;
  mapaPrueba ="MapaPruebaPage";
  userUid;
  userAct;
  isInvitado;
  
  constructor(public navCtrl: NavController,private router: Router,private authservice :AuthService,private userService : UserService) {
    this.authservice.isAuth().subscribe(auth => {
      if (auth) {
        this.userUid = auth.uid;
        console.log("auth",auth);
        
        this.userService.getOneUser(this.userUid).subscribe(userdb => {
          this.userAct = userdb;
          this.userAct.photoUrl = auth.photoURL;
          console.log("userDb",userdb);
        
        });
        
        this.authservice.isUserAdmin(this.userUid).subscribe(userRole => {
          this.isInvitado = Object.assign({}, userRole.roles).hasOwnProperty('invitado');
        })
      }
    })

  }

  ngOnInit() {
  }

  togglePopupMenu() {
    return this.openMenu = !this.openMenu;
  }
  goTo() {
    // this.router.navigate(['/map-restaurant'])
    
    this.navCtrl.navigateForward('map-restaurante');

  }

}
