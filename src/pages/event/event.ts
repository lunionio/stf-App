import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, Platform, ItemSliding } from 'ionic-angular';

import { conformToMask } from 'angular2-text-mask';

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { LoadingProvider, EventProvider, LocationProvider, MessageProvider, ProfessionalProvider, ContractProvider } from '../../providers/index';
import { Masks } from '../../utils/masks';
import { EventFilter } from '../../models/event';
import { setInterval } from 'timers';

@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {
  evento: any = { eventAddress: {}, eventMeetingAddress: {} };
  addressMap: string;
  meetingMap: string;
  processLock: Boolean;
  eventFilter: EventFilter;
  dateNow: Date;
  checkInVisibility: Boolean;

  constructor(
    private eventProvider: EventProvider,
    private inAppBrowser: InAppBrowser,
    private masks: Masks,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private loadingProvider: LoadingProvider,
    private location: LocationProvider,
    private messageProvider: MessageProvider,
    private professionalProvider: ProfessionalProvider,
    private contractProvider: ContractProvider
  ) {

    this.dateNow = new Date();

    setInterval(() => {
      this.dateNow = new Date();
    }, 1000);

    this.evento = this.navParams.get('event');
    this.evento.contacts = [];

    this.processLock = false;

    this.evento.eventAddress.zipCode = conformToMask(this.evento.eventAddress.zipCode, this.masks.ZIPCODE.mask, {}).conformedValue;
    this.evento.companyCnpj = conformToMask(this.evento.companyCnpj, this.masks.CNPJ.mask, {}).conformedValue;

    if (this.evento.phone1) {
      this.evento.contacts.push(conformToMask(this.evento.phone1, this.evento.phone1.length === 10 ? this.masks.PHONE.mask : this.masks.CELLPHONE.mask, {}).conformedValue);
    }

    if (this.evento.phone2) {
      this.evento.contacts.push(conformToMask(this.evento.phone2, this.evento.phone2.length === 10 ? this.masks.PHONE.mask : this.masks.CELLPHONE.mask, {}).conformedValue);
    }

    if (this.evento.benefitDescription) {
      this.evento.benefits = this.evento.benefitDescription.split('|');
    }

    let address = `${this.evento.eventAddress.address1}, ${this.evento.eventAddress.cityName}, ${this.evento.eventAddress.stateAbbreviation}`;
    this.addressMap = `https://maps.googleapis.com/maps/api/staticmap?center=${address}&zoom=15&scale=2&size=380x240&maptype=roadmap&key=AIzaSyAuU9o_a2RZ6Lyo6fOCtmisKAWmPIoFNBw&format=jpg&visual_refresh=true&markers=color:0xff5722|label:E|${address}`;

    if (this.evento.eventMeetingAddress) {
      this.evento.eventMeetingAddress.zipCode = conformToMask(this.evento.eventMeetingAddress.zipCode, this.masks.ZIPCODE.mask, {}).conformedValue
      let address = `${this.evento.eventMeetingAddress.address1}, ${this.evento.eventMeetingAddress.cityName}, ${this.evento.eventMeetingAddress.stateAbbreviation}`;
      this.meetingMap = `https://maps.googleapis.com/maps/api/staticmap?center=${address}&zoom=15&scale=2&size=380x240&maptype=roadmap&key=AIzaSyAuU9o_a2RZ6Lyo6fOCtmisKAWmPIoFNBw&format=jpg&visual_refresh=true&markers=color:0xff5722|label:E|${address}`;
    }

  }

  subscribe(job: any, index) {
    if (this.evento.contractId) return;

    if (!this.processLock) {
      this.processLock = true;

      let modal = this.modalCtrl.create('EventSubscribePage', {
        job: job,
        event: {
          eventId: this.evento.eventId,
          name: this.evento.name,
          eventMeetingAddress: this.evento.eventMeetingAddress
        }
      });

      modal.onDidDismiss((data) => {
        this.processLock = false;

        if (data) {
          this.professionalProvider.moveEvent(
            { filter: EventFilter.Oportunidades_Disponiveis, eventId: this.evento.eventId },
            { filter: EventFilter.Eventos_EmAnalise }
          );

          this.evento.jobs.splice(index, 1);
        }
      });

      modal.present();
    }
  }

  confirmCheckInCheckOut(_job: any, endPoint: string, slidingItem: ItemSliding) {
    if (!this.processLock) {
      this.processLock = true;

      this.getCurrentLocationHere().then((res) => {

        this.loadCheckModal(_job, endPoint, slidingItem, res);

      }).catch((error) => {

        this.loadCheckModal(_job, endPoint, slidingItem);

      });
    }
  }

  loadCheckModal(_job: any, endPoint: string, slidingItem: ItemSliding, location?: any) {
    let modal = this.modalCtrl.create('ConfirmCheckInCheckOutPage', {
      contractId: _job.contractId,
      endPoint: endPoint,
      event: this.evento,
      location: location
    });

    modal.onDidDismiss((result) => {
      this.processLock = false;
      slidingItem.close();
      if (result) {
        if (endPoint == "check-in") {
          _job.checkIn = this.dateNow;
        } else {
          _job.checkOut = this.dateNow;
        }
      }
    });

    modal.present();
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

  getCurrentLocationHere(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loadingProvider.show();
      this.location.currentLocation().then((resp) => {
        this.loadingProvider.hide();
        resolve({
          lat: resp.coords.latitude,
          lng: resp.coords.longitude
        });

      }).catch((error) => {
        this.loadingProvider.hide();
        reject(error);
      });
    });
  }


  confirmInvite(_job: any, accept: boolean, slidingItem: ItemSliding) {
    if (!this.processLock) {
      this.processLock = true;
      this.loadingProvider.show();

      this.contractProvider.answerContractInvite(_job.contractId, accept)
        .subscribe(() => {
          this.processLock = false;
          this.loadingProvider.hide();
          _job.enumContractStatus = (accept ? "Aceito" : "Recusado");

          let targetFilter = (accept ? EventFilter.Eventos_Agendados : EventFilter.Oportunidades_Recusadas);

          this.professionalProvider.moveEvent(
            { filter: EventFilter.Oportunidades_Convites, eventId: this.evento.eventId },
            { filter: targetFilter }
          );

        }, error => {

          this.processLock = false;
          this.loadingProvider.hide();
          this.messageProvider.alert(error);

        });

      slidingItem.close();
    }
  }

  checkSectionEnabled(_job) {
    return (!this.pendingInvite(_job) && (this.checkInEnabled(_job) || this.checkOutEnabled(_job)));
  }

  checkInEnabled(_job) {
    return (
      _job.enumContractStatus == "Aceito"
      && _job.checkIn == null
      && !_job.isAbsenceConfirmed
      && (new Date(_job.checkDateStart) < this.dateNow
      && this.dateNow < new Date(_job.dateEnd))
    );
  }

  checkOutEnabled(_job) {
    return (_job.enumContractStatus == "Aceito"
      && _job.checkOut == null
      && !_job.isAbsenceConfirmed
      && _job.checkIn != null
      && (new Date(_job.checkDateEnd) > this.dateNow
        && this.dateNow > new Date(_job.dateStart)));
  }

  ratingEnabled(_job) {
    return (_job.enumContractStatus == "Aceito"
      && !_job.isRated
      && !_job.isAbsenceConfirmed
      && new Date(_job.dateEnd) < this.dateNow);
  }

  pendingInvite(_job) {
    return (_job.enumContractStatus == "Convite"
      && new Date(_job.dateEnd) > this.dateNow);
  }

  cancelEnabled(_job) {
    return (
      (_job.enumContractStatus == 'Aguardando' || _job.enumContractStatus == 'Aceito')
      && _job.checkIn == null
      && !_job.isAbsenceConfirmed
      && this.dateNow < new Date(_job.checkDateStart)
    );
  }

  cancelContract(_job: any, slidingItem: ItemSliding) {
    if (!this.processLock) {
      this.processLock = true;

      let confirmation = this.modalCtrl.create('ConfirmMessagePage', {
        title: 'Deseja realmente cancelar sua inscrição?'
      });

      confirmation.onDidDismiss(data => {
        if (data) {

          this.contractProvider.refuse(_job.contractId).subscribe(() => {

            _job.enumContractStatus = 'Recusado';
            this.processLock = false;
            slidingItem.close();

          }, error => {
            this.messageProvider.alert(error);
            this.processLock = false;
            slidingItem.close();

          });
        }
        else {
          this.processLock = false;
          slidingItem.close();
        }
      });

      confirmation.present();
    }
  }

  swiperEnabled(_job) {
    return (this.checkSectionEnabled(_job) || this.pendingInvite(_job) || this.ratingEnabled(_job) || this.cancelEnabled(_job));
  }

  feedback(_job, slidingItem: ItemSliding) {
    let modal = this.modalCtrl.create('EventFeedbackPage', {
      job: _job
    });
    modal.onDidDismiss((data) => {
      if (data) {
        _job.isRated = true;
      }
    });
    modal.present();
    slidingItem.close();
  }
}
