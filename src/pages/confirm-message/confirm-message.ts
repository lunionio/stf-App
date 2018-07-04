import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-confirm-message',
  templateUrl: 'confirm-message.html'
})
export class ConfirmMessagePage {
  title: string;
  subtitle: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewController: ViewController) {
    this.title = this.navParams.get('title');
    this.subtitle = this.navParams.get('subtitle');
  }

  ionViewDidLoad() { }

  dismiss() {
    this.viewController.dismiss(false);
  }

  submit() {
    this.viewController.dismiss(true);
  }

}
