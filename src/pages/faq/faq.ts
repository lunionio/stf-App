import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SystemProvider } from '../../providers/index';

@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {
  faq: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private systemProvider: SystemProvider) {
    systemProvider.faq().subscribe(faq => this.faq = faq);
  }

  question(question) {
    this.navCtrl.push('FaqDetailPage', {
      question: question
    });
  }

}
