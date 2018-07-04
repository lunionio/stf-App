import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SystemProvider } from '../../providers/index'

@IonicPage()
@Component({
  selector: 'page-privacy',
  templateUrl: 'privacy.html',
})
export class PrivacyPage {
  innerHtml: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private systemProvider: SystemProvider) {
    systemProvider.privacy().subscribe((html) => this.innerHtml = html);
  }

  ionViewDidLoad() { }

}
