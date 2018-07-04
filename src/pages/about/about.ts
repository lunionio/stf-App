import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { SystemProvider } from '../../providers/index'

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  innerHtml: string;
  version: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private inAppBrowser: InAppBrowser, private platform: Platform, private appVersion: AppVersion, private systemProvider: SystemProvider) {
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      this.version = '1.01';
    } else {
      this.appVersion.getVersionNumber().then((version) => this.version = version);
    }

    systemProvider.privacy().subscribe((html) => this.innerHtml = html);
  }

  ionViewDidLoad() { }

  asteria() {
    this.inAppBrowser.create('http://asteria.com.br', '_system');
  }
}
