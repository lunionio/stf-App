import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-select',
  templateUrl: 'select.html',
})
export class SelectPage {
  title: string;
  items: any[];
  filter: string;
  filteredItems: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.title = this.navParams.get('title') || 'Selecione';
    this.items = this.navParams.get('items');
    this.filteredItems = this.items;
  }

  ionViewDidLoad() { }

  select(item) {
    this.viewCtrl.dismiss(item);
  }

  onInput() {
    console.log(this.filter);
    if (this.filter) {
      this.filteredItems = this.items.filter((item) => {
        return (item.name.toLowerCase().indexOf(this.filter.toLowerCase()) > -1);
      });
    } else {
      this.filteredItems = this.items;
    }
  }

  onCalcel(e) {
    this.filteredItems = this.items;
  }
}
