import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';

import { Event } from '../../models/event';
import { EventProvider, MessageProvider, LoadingProvider, ContractProvider } from '../../providers/index';

@IonicPage()
@Component({
  selector: 'page-event-subscribe',
  templateUrl: 'event-subscribe.html',
})
export class EventSubscribePage {
  evento: Event;
  job: any;
  meetingPoint: number = 1;

  constructor(
    private contractProvider: ContractProvider,
    private eventProvider: EventProvider,
    private loadingProvider: LoadingProvider,
    private messageProvider: MessageProvider,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewController: ViewController) {
    this.evento = this.navParams.get('event');
    this.job = this.navParams.get('job');
    this.job.image = 'assets/img/waiter.png';
  }

  ionViewDidLoad() {
  }

  subscribe() {
    this.loadingProvider.show();
    this.contractProvider.apply(this.job.jobId, this.evento.eventId, this.meetingPoint).subscribe(
      () => {
        this.dismiss(this.job.jobId);
        this.loadingProvider.hide();
        this.modalCtrl.create('SuccessMessagePage', {
          title: 'Inscrição enviada com sucesso!',
          subtitle: 'Em breve você receberá um retorno da contratante sobre a sua participação neste evento.'
        }).present();
      }, (err) => {
        this.loadingProvider.hide().then(() => {
          this.messageProvider.alert(err);
        });
      }
    );
  }

  dismiss(jobId?) {
    this.viewController.dismiss(jobId);
  }
}
