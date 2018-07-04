import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,Tabs } from 'ionic-angular';

import { EventFilter } from '../../models/event';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  @ViewChild('myTabs') tabRef: Tabs;

  disponiveisParams: any;
  recusadosParams: any;
  convitesParams: any;
  indexTabAtive: any;

  disponiveis = 'EventsPage';
  recusados = 'EventsPage';
  convites = 'EventsPage';

  constructor(public navCtrl: NavController, public navParams: NavParams, private menuCtrl: MenuController) {
    this.disponiveisParams = { tab: 0, page: 'disponiveis', eventFilter: EventFilter.Oportunidades_Disponiveis };
    this.convitesParams = { tab: 1, page: 'convites', eventFilter: EventFilter.Oportunidades_Convites };
    this.recusadosParams = { tab: 2, page: 'recusados', eventFilter: EventFilter.Oportunidades_Recusadas };


  }

  ionViewDidLoad() { }

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(true);
    this.menuCtrl.enable(true);

    this.indexTabAtive = 0; //usar essa variavel para verificação if(existir convites) this.indexTabAtive = 1 else this.indexTabAtive = 0

    
   /* if(convites){
      this.indexTabAtive = 1;
    }else{
      this.indexTabAtive = 0;
    }*/

    this.tabRef.select(this.indexTabAtive); //Função pra deixar a tabs ativa/selecionada
  }

}
