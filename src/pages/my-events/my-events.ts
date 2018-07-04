import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { EventFilter } from '../../models/event';

@IonicPage()
@Component({
  selector: 'page-my-events',
  templateUrl: 'my-events.html',
})
export class MyEventsPage {
  proximosParams: any;
  realizadosParams: any;
  aguardandoParams: any;

  proximos = 'EventsPage';
  realizados = 'EventsPage';
  aguardando = 'EventsPage';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.proximosParams = { tab: 0, page: 'proximos', eventFilter: EventFilter.Eventos_Agendados };
    this.realizadosParams = { tab: 1, page: 'realizados', eventFilter: EventFilter.Eventos_Realizados };
    this.aguardandoParams = { tab: 2, page: 'aguardando', eventFilter: EventFilter.Eventos_EmAnalise };
  }

  ionViewDidLoad() { }

  onTabSelect(ev: any) { }

}
