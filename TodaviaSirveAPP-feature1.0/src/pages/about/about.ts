import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  loading: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController
  ) {
    this.loading = this.loadingCtrl.create({ content: " espere por favor..." });
    this.loading.present();
  }

  ionViewDidLoad() {
    this.loading.dismiss();
  }

  popView() {
    this.navCtrl.pop();
  }

}
