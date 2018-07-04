import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';

import { Event } from '../../models/event';
import { EventProvider, MessageProvider, LoadingProvider, ContractProvider } from '../../providers/index';

@IonicPage()
@Component({
  selector: 'page-confirm-check-in-check-out',
  templateUrl: 'confirm-check-in-check-out.html',
})
export class ConfirmCheckInCheckOutPage {
  contractId: number;
  endPoint: string;
  evento: Event;
  location?: any;

  constructor(
    private eventProvider: EventProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingProvider: LoadingProvider,
    private messageProvider: MessageProvider,
    public modalCtrl: ModalController,
    private contractProvider: ContractProvider,
    public viewController: ViewController) {
      this.contractId = this.navParams.get('contractId');
      this.endPoint = this.navParams.get('endPoint');
      this.evento = this.navParams.get('event');
      this.location = this.navParams.get('location');
  }

  confirm() {
    this.loadingProvider.show();
    this.contractProvider.professionalCheck(this.contractId, this.endPoint, this.location).subscribe(
      (response) => {
        if (this.endPoint == 'check-in'){
          this.evento.checkIn = response;
        }
        else{
          this.evento.checkOut = response;
        }
        this.dismiss(true);
        this.loadingProvider.hide();
        this.modalCtrl.create('SuccessMessagePage', {
          title: 'Ação efetuada com sucesso!'
        }).present();
      }, (err) => {
        this.loadingProvider.hide().then(() => {
          this.messageProvider.alert(err);
        });
      }
    );
  }

  dismiss(result) {
    this.viewController.dismiss(result);
  }
}
