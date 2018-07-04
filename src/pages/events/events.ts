import { Component } from '@angular/core';
import { IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';

import { ContractProvider, EventProvider, ProfessionalProvider, MessageProvider } from '../../providers/index';
import { EventFilter } from '../../models/event';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {
  tab: number;
  disponiveis: boolean;
  recusados: boolean;
  convites: boolean;
  proximos: boolean;
  realizados: boolean;
  aguardando: boolean;
  eventFilter: EventFilter;
  hasMore: boolean = true;
  initialized: boolean = false;
  processing: boolean = false;

  constructor(
    private contractProvider: ContractProvider,
    private eventProvider: EventProvider,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private professionalProvider: ProfessionalProvider,
    private messageProvider: MessageProvider) {
    this.tab = navParams.data.tab;
    this.eventFilter = navParams.data.eventFilter;
    this.disponiveis = navParams.data.page === 'disponiveis';
    this.recusados = navParams.data.page === 'recusados';
    this.convites = navParams.data.page === 'convites';
    this.proximos = navParams.data.page === 'proximos';
    this.realizados = navParams.data.page === 'realizados';
    this.aguardando = navParams.data.page === 'aguardando';
  }

  ionViewDidLoad() {
    if (!this.professionalProvider.pagers[this.eventFilter].total) {
      this.professionalProvider.getEvents(this.eventFilter, this.professionalProvider.pagers[this.eventFilter].page).subscribe((result) => {
        Object.assign(this.professionalProvider.pagers[this.eventFilter], result);
        this.initialized = true;
      });
    } else {
      this.initialized = true;
    }
  }

  itemTapped(event, item) {
    if (!this.processing) {
      this.processing = true;
      this.eventProvider.details(item.eventId).subscribe((event) => {
        this.processing = false;
        this.navCtrl.parent.parent.push('EventPage', { event });
      }, error => {
        this.processing = false;
        this.messageProvider.alert(error);
      });
    }
  }

  paginate() {
    return new Promise((resolve) => {
      this.professionalProvider.getEvents(this.eventFilter, ++this.professionalProvider.pagers[this.eventFilter].page).subscribe((result) => {
        for (let i = 0, _len = result.rows.length; i < _len; i++) {
          this.professionalProvider.pagers[this.eventFilter].rows.push(result.rows[i]);
        }
        this.hasMore = result.rows.length < result.total;
        resolve();
      });
    });
  }

  doRefresh(refresher) {
    this.professionalProvider.getEvents(this.eventFilter, 1).subscribe((result) => {
      Object.assign(this.professionalProvider.pagers[this.eventFilter], result);
      this.professionalProvider.pagers[this.eventFilter].page = 1;
      this.hasMore = result.rows.length < result.total;
      refresher.complete();
    });
  }

}
