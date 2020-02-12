import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, LoadingController } from '@ionic/angular';
import { AuthService } from "../../servicios/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public onRegisterForm: FormGroup;
  public  email : string;
  public  name : string;
  public password : string;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private auth : AuthService,
    private router : Router
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.onRegisterForm = this.formBuilder.group({
      'fullName': [null, Validators.compose([
        Validators.required
      ])],
      'email': [null, Validators.compose([
        Validators.required
      ])],
      'password': [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  // async signUp() {
  //   const loader = await this.loadingCtrl.create({
  //     duration: 2000
  //   });

  //   loader.present();
  //   loader.onWillDismiss().then(() => {
  //     this.navCtrl.navigateRoot('/home-results');
  //   });
  // }
  signUp() {
    this.auth.register(this.email, this.password,this.name).then( auth => {
      this.router.navigate(['home-results'])
      console.log(auth)
    }).catch(err => console.log(err))
  }
  // // //
  goToLogin() {
    this.navCtrl.navigateRoot('/');
  }
}
