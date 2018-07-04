import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LoadingProvider, MessageProvider, ProfessionalProvider, ServiceGroupProvider } from '../../providers/index';
import { CustomCurrencyPipe } from '../../pipes/custom-currency/custom-currency';

@IonicPage()
@Component({
  selector: 'page-skills',
  templateUrl: 'skills.html',
})
export class SkillsPage {
  selectedServiceGroup: any;
  selectedService: any;
  userServices: any[];
  serviceGroups: any[];
  services: any[];
  budget: any;
  processLock: Boolean;
  show: boolean;
  constructor(
    private currencyPipe: CustomCurrencyPipe,
    private messageProvider: MessageProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingProvider: LoadingProvider,
    private professionalProvider: ProfessionalProvider,
    private serviceGroupProvider: ServiceGroupProvider) {

    this.processLock = false;
    this.professionalProvider.getServices().subscribe((services) => this.userServices = services);
    this.serviceGroupProvider.getGroups().subscribe((serviceGroups) => {
      this.serviceGroups = serviceGroups
      if (this.serviceGroups && this.serviceGroups.length) {
        this.selectedServiceGroup = this.serviceGroups[0];
        this.serviceGroupProvider.getServices(this.selectedServiceGroup.serviceGroupId).subscribe((services) => this.services = services);
      }
    });
  }

  ionViewDidLoad() {
  }

  onServiceGroupChange(event: Event) {
    this.serviceGroupProvider.getServices(this.selectedServiceGroup.serviceGroupId).subscribe((services) => this.services = services);
  }

  insert() {
    if (!this.processLock) {
      if (!this.selectedServiceGroup || !this.selectedServiceGroup.serviceGroupId) {
        return this.messageProvider.alert('É necessário informar a área.');
      }
      else if (!this.selectedService || !this.selectedService.serviceId) {
        return this.messageProvider.alert('É necessário informar a especialização.');
      }

      this.lockProcessToogle(true);

      this.professionalProvider.setService(
        this.selectedService.serviceId,
        this.currencyPipe.toDecimal(this.budget))
        .subscribe(() => {
          this.lockProcessToogle(false);

          this.userServices.push({
            serviceId: this.selectedService.serviceId,
            name: this.selectedService.name,
            group: this.selectedServiceGroup.description,
            defaultBudgetByEvent: this.budget
          });

          this.selectedService = null;
          this.budget = null;
          this.professionalProvider.clearEvents();

        },
        (err) => {
          this.lockProcessToogle(false);
          this.messageProvider.alert(err);
        }
        );
    }
  }

  delete(service) {
    if (!this.processLock) {

      this.lockProcessToogle(true);

      this.professionalProvider.deleteService(service.serviceId).subscribe(
        () => {

          this.lockProcessToogle(false);
          for (let i = 0, _len = this.userServices.length; i < _len; i++) {
            if (this.userServices[i].serviceId == service.serviceId) {
              this.userServices.splice(i, 1);
              break;
            }
          }
        },
        (err) => {
          this.lockProcessToogle(false);
          this.messageProvider.alert(err);
        }
      );
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

  moneyLabel(_budget) {
    if (_budget) {
      return 'R$' + this.currencyPipe.transform(_budget);
    }
  }

  showFooter() {
    this.show = !this.show;
  }
}
