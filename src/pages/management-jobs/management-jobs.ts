import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SpecialContractProvider, MessageProvider } from '../../providers/index';
import { ManagementJob } from '../../models/management-job';
import { Account } from '../../utils/account';
import { SideMenuProvider } from '../../providers/side-menu/side-menu';

@IonicPage()
@Component({
  selector: 'page-management-jobs',
  templateUrl: 'management-jobs.html',
})
export class ManagementJobsPage {
  list: ManagementJob[];

  processing: boolean = false;
  initialized: boolean = false;
  showWarning: boolean = false;

  constructor(
    public account: Account,
    public sideMenuProvider: SideMenuProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private messageProvider: MessageProvider,
    private specialContractProvider: SpecialContractProvider) {
  }

  ionViewDidEnter() {
    this.loadList();
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.loadList();
      refresher.complete();
    }, 2000);
  }

  itemTapped(item: ManagementJob) {
    this.navCtrl.push('EventDetailManagementPage', { specialContractId: item.specialContractId });
  }

  loadList() {
    if (!this.processing) {
      this.processing = true;
      this.specialContractProvider.getManagementEvents().subscribe((result) => {
        this.list = result;
        this.processing = false;
        if (!this.list.length) {
          //this.account.setHasManagementJobs(false);
          //this.sideMenuProvider.loadSideMenu();
          //this.navCtrl.setRoot("HomePage");
          this.initialized = true;
          this.showWarning = true;
        }
      }, error => {
        this.messageProvider.alert(error);
        this.processing = false;
      });
    }
  }
}
