import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
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
  public  username : string;
  public password : string;
  public repassword : string;

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
      'username': [null, Validators.compose([
        Validators.required
      ])],
      'password': [null, Validators.compose([
        Validators.required
      ])],
      'repassword': [null, Validators.compose([
        Validators.required
      ])]
    },{
      validator: this.MatchPassword('password', 'repassword')
    }
    );
  }
  MatchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }
  public  matchValues(
    matchTo: string // name of the control to match to
  ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? null
        : { isMatching: false };
    };
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
    this.auth.register(this.username, this.password).then( auth => {
      this.router.navigate(['home-results'])
      console.log(auth)
    }).catch(err => console.log(err))
  }
  // // //
  goToLogin() {
    this.navCtrl.navigateRoot('/');
  }
}
