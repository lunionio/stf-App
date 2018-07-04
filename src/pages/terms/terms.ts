import { Component, ViewChild } from '@angular/core';
import { IonicPage, Content, NavController, NavParams } from 'ionic-angular';

import { SystemProvider } from '../../providers/index';

@IonicPage()
@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class TermsPage {
  @ViewChild(Content) content: Content;

  innerHtml: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private systemProvider: SystemProvider) {
    systemProvider.privacy().subscribe((html) => this.innerHtml = html);
  }

  ionViewDidLoad() { }

  scrollToElement(id) {
    var el = document.getElementById(id);
    var rect = el.getBoundingClientRect();
    // scrollLeft as 0px, scrollTop as "topBound"px, move in 800 milliseconds
    this.content.scrollTo(0, rect.top, 800);
  }

}
