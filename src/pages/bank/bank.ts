import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfessionalProvider, MessageProvider, LoadingProvider } from '../../providers/index';
import { Masks } from '../../utils/masks';
import { CPF } from 'cpf_cnpj';

@IonicPage()
@Component({
  selector: 'page-bank',
  templateUrl: 'bank.html',
})
export class BankPage {

  processLock: Boolean;
  billingDetails: any;
  cpfMask: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private professionalProvider: ProfessionalProvider,
    private messageProvider: MessageProvider,
    private loadingProvider: LoadingProvider,
    public masks: Masks) {

    this.processLock = false;
    this.cpfMask = this.masks.CPF;
    this.billingDetails = {};
    this.loadData();

  }

  ionViewDidLoad() {
  }

  loadData() {
    if (!this.processLock) {
      this.lockProcessToogle(true);

      this.professionalProvider.getBillingDetails().subscribe((billing) => {

        this.lockProcessToogle(false);
        this.billingDetails = billing;

      }, (err) => {

        this.lockProcessToogle(false);
        this.messageProvider.alert(err);

      });
    }
  }

  lockProcessToogle(lock: Boolean) {
    if (lock) {
      this.processLock = true;
      this.loadingProvider.show();
    }
    else {
      this.processLock = false;
      this.loadingProvider.hide();
    }
  }

  submit() {
    if (!this.processLock) {
      this.lockProcessToogle(true);

      if (this.billingDetails.billingAccountOwnerCpf && !CPF.isValid(this.billingDetails.billingAccountOwnerCpf)) {
        this.lockProcessToogle(false);
        return this.messageProvider.alert('CPF inválido!');
      }

      this.professionalProvider.setBillingDetails(this.billingDetails).subscribe(() => {

        this.lockProcessToogle(false);
        this.messageProvider.alert('Informações atualizadas com sucesso!');

      }, (err) => {

        this.lockProcessToogle(false);
        this.messageProvider.alert(err);

      });
    }
  }
}
