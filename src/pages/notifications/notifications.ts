import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ProfessionalProvider } from '../../providers/index';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  notifications: any = {};
  /*
  nearJobNotification?: boolean;
  newJobNotification?: boolean;
  hiredJobNotification?: boolean;
  cancelledJobNotification?: boolean;
  eventRemindersNotification?: boolean;
  managementContractCancelledNotification?: boolean;
  newManagementContractProposalNotification?: boolean;
  contractInviteNotification?: boolean;
  eventChangesNotification?: boolean;
  */

  get nearJobNotification() {
    return this.notifications.nearJobNotification;
  }

  set nearJobNotification(nearJobNotification: boolean) {
    this.notifications.nearJobNotification = nearJobNotification;
    this.setNotifications();
  }

  get newJobNotification() {
    return this.notifications.newJobNotification;
  }

  set newJobNotification(newJobNotification: boolean) {
    this.notifications.newJobNotification = newJobNotification;
    this.setNotifications();
  }

  get hiredJobNotification() {
    return this.notifications.hiredJobNotification;
  }

  set hiredJobNotification(hiredJobNotification: boolean) {
    this.notifications.hiredJobNotification = hiredJobNotification;
    this.setNotifications();
  }

  get cancelledJobNotification() {
    return this.notifications.cancelledJobNotification;
  }

  set cancelledJobNotification(cancelledJobNotification: boolean) {
    this.notifications.cancelledJobNotification = cancelledJobNotification;
    this.setNotifications();
  }

  get eventRemindersNotification() {
    return this.notifications.eventRemindersNotification;
  }

  set eventRemindersNotification(eventRemindersNotification: boolean) {
    this.notifications.eventRemindersNotification = eventRemindersNotification;
    this.setNotifications();
  }

  get managementContractCancelledNotification() {
    return this.notifications.managementContractCancelledNotification;
  }

  set managementContractCancelledNotification(managementContractCancelledNotification: boolean) {
    this.notifications.managementContractCancelledNotification = managementContractCancelledNotification;
    this.setNotifications();
  }

  get newManagementContractProposalNotification() {
    return this.notifications.managementContractCancelledNotification;
  }

  set newManagementContractProposalNotification(newManagementContractProposalNotification: boolean) {
    this.notifications.newManagementContractProposalNotification = newManagementContractProposalNotification;
    this.setNotifications();
  }

  get contractInviteNotification() {
    return this.notifications.contractInviteNotification;
  }

  set contractInviteNotification(contractInviteNotification: boolean) {
    this.notifications.contractInviteNotification = contractInviteNotification;
    this.setNotifications();
  }

  get eventChangesNotification() {
    return this.notifications.eventChangesNotification;
  }

  set eventChangesNotification(eventChangesNotification: boolean) {
    this.notifications.eventChangesNotification = eventChangesNotification;
    this.setNotifications();
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private professionalProvider: ProfessionalProvider) {
    this.notifications = this.navParams.get('notifications');
  }

  ionViewDidLoad() {
  }

  setNotifications() {
    this.professionalProvider.setNotificationSettings(this.notifications).subscribe(
      () => { },
      (err) => { }
    );
  }

}
