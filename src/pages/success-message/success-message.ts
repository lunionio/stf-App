import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-success-message',
  templateUrl: 'success-message.html'
})
export class SuccessMessagePage {
  title: string;
  subtitle: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewController: ViewController) {
    this.title = this.navParams.get('title');
    this.subtitle = this.navParams.get('subtitle');
  }

  ionViewDidLoad() { }

  dismiss() {
    this.viewController.dismiss();
  }

}
