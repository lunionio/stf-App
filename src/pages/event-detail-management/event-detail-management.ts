import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, ItemSliding } from 'ionic-angular';
import { MessageProvider, SpecialContractProvider, LoadingProvider, LocationProvider } from '../../providers/index';
import { EventContractsManagement, EventContractsManagement_Contracts, EventContractsManagement_Jobs, EventContractsManagement_Stages } from '../../models/event-contracts-management';

import { Masks } from '../../utils/masks';
import { conformToMask } from 'text-mask-core/dist/textMaskCore';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-event-detail-management',
  templateUrl: 'event-detail-management.html',
})
export class EventDetailManagementPage {

  contextSpecialContractId: number;
  model: EventContractsManagement;
  addressMap: string;


  initialized: boolean = false;
  processing: boolean = false;
  modalLoaded: boolean = false;
  showDetail: boolean = false;
  confirmationModal: any = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private messageProvider: MessageProvider,
    private specialContractProvider: SpecialContractProvider,
    private loadingProvider: LoadingProvider,
    private masks: Masks,
    private location: LocationProvider,
    public platform: Platform,
    private inAppBrowser: InAppBrowser) {

    this.contextSpecialContractId = this.navParams.get('specialContractId');

  }

  ionViewDidLoad() {
    if (!this.initialized) {
      this.initialized = true;
      this.loadList();
    }
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.loadList();
      refresher.complete();
    }, 1000);
  }

  loadList() {
    if (!this.contextSpecialContractId) {
      this.navCtrl.pop();
    }
    if (!this.processing) {

      this.setIsProcessing(true);

      this.specialContractProvider.getEventManagementContracts(this.contextSpecialContractId)
        .subscribe((result) => {

          this.model = result;

          this.bindEventFields();
          this.setIsProcessing(false);

          if (this.model.enumSpecialContractStatus != 'Aguardando'
            && this.model.enumSpecialContractStatus != 'Aceito') {
            this.navCtrl.pop();
          }

          this.showDetail = this.model.enumSpecialContractStatus == 'Aguardando';

        }, error => {

          this.setIsProcessing(false);
          this.messageProvider.alert(error);

        });
    }
  }

  confirmProposal(event: EventContractsManagement, accept: boolean) {
    if (!this.processing) {

      this.setIsProcessing(true);

      this.specialContractProvider.changeSpecialContractStatus(event.specialContractId, accept)
        .subscribe(() => {

          this.setIsProcessing(false);

          if (!accept) {
            this.navCtrl.pop();
          }
          else {
            this.loadList();
          }

        }, error => {

          this.setIsProcessing(false);
          this.messageProvider.alert(error);

        });
    }
  }

  bindEventFields() {
    this.model.zipCode = conformToMask(this.model.zipCode, this.masks.ZIPCODE.mask, {}).conformedValue;
    this.model.companyCnpj = conformToMask(this.model.companyCnpj, this.masks.CNPJ.mask, {}).conformedValue;

    let address = `${this.model.address1}, ${this.model.cityName}, ${this.model.stateAbbreviation}`;
    this.addressMap = `https://maps.googleapis.com/maps/api/staticmap?center=${address}&zoom=15&scale=2&size=380x240&maptype=roadmap&key=AIzaSyAuU9o_a2RZ6Lyo6fOCtmisKAWmPIoFNBw&format=jpg&visual_refresh=true&markers=color:0xff5722|label:E|${address}`;

    if (this.model.stages) {
      this.model.stages.forEach(stage => {
        if (stage.jobs) {
          stage.jobs.forEach(job => {
            if (job.contracts) {
              job.contracts.forEach(contract => {
                if (contract.professionalCellPhone) {
                  contract.professionalCellPhone = conformToMask(
                    contract.professionalCellPhone,
                    contract.professionalCellPhone.length === 10 ?
                      this.masks.PHONE.mask : this.masks.CELLPHONE.mask, {}).conformedValue;
                }
                this.setButtonsVisibility(contract);
              });
            }
          });
        }
      });
    }
  }

  navigate(lat, lng, location) {
    let url = '';

    this.location.currentLocation().then((resp) => {
      // ios
      if (this.platform.is('core') || this.platform.is('mobileweb')) {
        url = `https://maps.google.com?saddr=Current+Location&daddr=${lat},${lng}`;
      }
      // android
      else if (this.platform.is('android')) {
        url = `geo://${resp.coords.latitude},${resp.coords.longitude}?q=${lat},${lng}(${location})`;
      }
      // default
      else if (this.platform.is('ios')) {
        url = `maps://?q=${location}&saddr=${resp.coords.latitude},${resp.coords.longitude}&daddr=${lat},${lng}`;
      } else {
        return;
      }

      this.inAppBrowser.create(url, '_system');
    }).catch((error) => {
      this.messageProvider.alert(error);
    });

  }

  professionalAction(contract: EventContractsManagement_Contracts, stage: EventContractsManagement_Stages, action: string, slidingItem: ItemSliding) {
    if (!this.processing) {

      this.setIsProcessing(true);

      this.specialContractProvider.manageProfessionalPresence(contract.contractId, action)
        .subscribe(() => {

          switch (action) {
            case 'is-absent':
              contract.isAbsenceConfirmed = true;
              break;
            case 'confirm-checkin':
              contract.isPresenceConfirmed = true;
              contract.checkIn = contract.checkIn || new Date();
              stage.professionalsConfirmed = stage.professionalsConfirmed + 1;
              break;
            case 'confirm-checkout':
              let confirmation = this.modalCtrl.create('ConfirmMessagePage', {
                title: 'Deseja realmente prosseguir?',
                subtitle: "Sua ação confirmará o fim da jornada de trabalho do profissional e não poderá reverter essa ação. "
              });

              confirmation.onDidDismiss(data => {
                if (data) {
                  contract.checkOut = contract.checkOut || new Date();
                  this.setButtonsVisibility(contract);
                }
              });

              confirmation.present();
              break;
          }

          this.setButtonsVisibility(contract);
          this.setIsProcessing(false);

        }, error => {

          this.setIsProcessing(false);
          this.messageProvider.alert(error);

        });

      slidingItem.close();
    }
  }

  setButtonsVisibility(contract: EventContractsManagement_Contracts) {
    contract.isAbsentButonShow = (!contract.isPresenceConfirmed && !contract.isAbsenceConfirmed);
    contract.confirmCheckInButonShow = (!contract.isAbsenceConfirmed && !contract.isPresenceConfirmed);
    contract.confirmCheckOutButonShow = (!contract.isAbsenceConfirmed && contract.isPresenceConfirmed && !contract.checkOut);
  }

  isSwipeVisible(job: EventContractsManagement_Jobs, contract: EventContractsManagement_Contracts) {
    const result = ((job.checkInEnabled || job.checkOutEnabled) &&
      (contract.isAbsentButonShow || contract.confirmCheckInButonShow || contract.confirmCheckOutButonShow));

    return result;
  }

  setIsProcessing(loading: boolean) {
    this.processing = loading;
    if (this.processing) {
      this.loadingProvider.show();
    }
    else {
      this.loadingProvider.hide();
    }
  }

  toogleButton(_object: any) {

    _object.showArea = !_object.showArea;

  }

  showAll(stage: any) {
    if (stage) {
      stage.showArea = true;

      if (stage.jobs && stage.jobs.length) {
        for (var x = 0; x < stage.jobs.length; x++) {
          stage.jobs[x].showArea = true;
        }
      }
    }

  }
}
