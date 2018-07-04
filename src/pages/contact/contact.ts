import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LoadingProvider, MessageProvider, SystemProvider } from '../../providers/index';

import { Account } from '../../utils/account';
import { LocalStorage } from '../../utils/storage';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  subjects = [
    { value: 1, name: 'Dúvida' },
    { value: 2, name: 'Sugestão' },
    { value: 3, name: 'Denúncia' },
    { value: 4, name: 'Outros' }
  ];
  contact: any;

  constructor(
    public account: Account,
    private messageProvider: MessageProvider,
    private loadingProvider: LoadingProvider,
    private storage: LocalStorage,
    public navCtrl: NavController,
    public navParams: NavParams,
    private systemProvider: SystemProvider) {
    this.contact = { subject: 1, message: '' };
  }

  ionViewDidLoad() { }

  submit() {
    if (!this.contact.message) {
      return this.messageProvider.alert('É necessário informar a mensagem');
    }

    this.loadingProvider.show();
    this.systemProvider.contact(this.contact.subject, this.contact.message).subscribe(
      () => {
        this.loadingProvider.hide().then(() => {
          this.messageProvider
            .alert('Contato enviado com sucesso. Em breve entraremos em contato.')
            .then(() => this.navCtrl.pop());
        });
      },
      (err) => {
        this.loadingProvider.hide().then(() => {
          this.messageProvider.alert(err);
        });
      }
    );
  }

}
