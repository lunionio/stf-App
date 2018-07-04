import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-faq-detail',
  templateUrl: 'faq-detail.html',
})
export class FaqDetailPage {
  question: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.question = navParams.get('question');
  }

  ionViewDidLoad() { }
}
