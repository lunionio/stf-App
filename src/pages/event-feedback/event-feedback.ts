import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';

import { ContractProvider, LoadingProvider, MessageProvider } from '../../providers/index';

@IonicPage()
@Component({
  selector: 'page-event-feedback',
  templateUrl: 'event-feedback.html',
})
export class EventFeedbackPage {
  rating: number;
  comment: string;
  evento: any;
  job: any;

  constructor(
    private contractProvider: ContractProvider,
    private loadingProvider: LoadingProvider,
    private messageProvider: MessageProvider,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewController: ViewController) {
    this.evento = this.navParams.get('evento');
    this.job = this.navParams.get('job');
    this.job.image = 'assets/img/waiter.png';
  }

  ionViewDidLoad() { }

  submit() {
    this.loadingProvider.show();
    this.contractProvider.rate(this.job.jobId, this.rating, this.comment).subscribe(
      () => {
        this.loadingProvider.hide();
        this.dismiss(true);
      },
      (err) => {
        this.loadingProvider.hide().then(() => {
          this.messageProvider.alert(err);
        });
      }
    );
  }

  dismiss(data?: any) {
    this.viewController.dismiss(data);
  }
}
