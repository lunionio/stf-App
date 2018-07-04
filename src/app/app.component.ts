import { Component, NgZone, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Config, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FCM } from '@ionic-native/fcm';

import { Account } from '../utils/account';
import { LocalStorage } from '../utils/storage';

import { AuthProvider, EventProvider, LoadingProvider, MessageProvider, ProfessionalProvider } from '../providers/index';
import { EventFilter } from '../models/event';
import { SideMenuProvider } from '../providers/side-menu/side-menu';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  profilePage = 'ProfilePage';
  isDocumentsPending: boolean = true;

  constructor(
    public account: Account,
    public sideMenuProvider: SideMenuProvider,
    private authProvider: AuthProvider,
    private config: Config,
    private eventProvider: EventProvider,
    private fcm: FCM,
    private loadingProvider: LoadingProvider,
    private storage: LocalStorage,
    public menuCtrl: MenuController,
    private messageProvider: MessageProvider,
    public platform: Platform,
    private professionalProvider: ProfessionalProvider,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    private toastCtrl: ToastController,
    private zone: NgZone) {
    this.config.set('ios', 'backButtonText', 'Voltar');
    this.config.set('android', 'tabbarIcons', 'hide');
    this.config.set('android', 'tabsHighlight', true);
    this.config.set('android', 'tabsPlacement', 'top');
    this.initializeApp();
    this.getSideMenu();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();

      this.storage.getToken().then(accessToken => {
        if (accessToken) {
          this.storage.getAccount().then((account) => {
            if (account && account.email) {
              this.account.set(account.email, account.displayName, account.imageAvatar, account.enumProfessionalType, account.rating || 0, account.cityPushGroup, account.hasManagementJobs);
              this.professionalProvider.getDocuments().subscribe((documents) => {
                this.isDocumentsPending = this.professionalProvider.isDocumentsPending(documents);
              });
            }
          });
          this.rootPage = 'HomePage';
        } else {
          this.rootPage = 'IntroPage';
        }
      });

      if (this.storage.isMobile()) {
        this.fcm.onNotification().subscribe(data => {
          this.handlePushNotification(data);
        });

        this.fcm.onTokenRefresh().subscribe(refreshToken => {
          this.storage.getToken().then((deviceToken) => {
            this.authProvider.refreshToken(deviceToken, refreshToken).subscribe(() => {
              console.log('token refreshed');
            });
          });
        });
      }
    });
  }

  handlePushNotification(pushData) {
    switch (pushData.enumNotificationType) {
      case 'EventConfirmed':
        this.professionalProvider.moveEvent(
          { filter: EventFilter.Eventos_EmAnalise, eventId: pushData.eventId },
          { filter: EventFilter.Eventos_Agendados }
        );
        if (pushData.wasTapped) {
          this.eventProvider.details(pushData.eventId).subscribe((event) => {
            this.nav.push('EventPage', { event });
          });
        }
        break;
      case 'EventChanges':
      case 'EventReminders':
        if (pushData.wasTapped) {
          this.eventProvider.details(pushData.eventId).subscribe((event) => {
            this.nav.push('EventPage', { event });
          });
        }
        break;
      case 'ContractInvite':
        this.professionalProvider.moveEvent(
          { filter: EventFilter.Oportunidades_Disponiveis, eventId: pushData.eventId },
          { filter: EventFilter.Oportunidades_Convites }
        );
        if (pushData.wasTapped) {
          this.eventProvider.details(pushData.eventId).subscribe((event) => {
            this.nav.push('EventPage', { event });
          });
        }
        break;
      case 'CityEvent':
      case 'ManagementContractCancelled':
        this.professionalProvider.clearEvents();
        break;
      case 'ContractCancelled':
        this.professionalProvider.clearEvents();
        this.professionalProvider.removeEvent(EventFilter.Eventos_Agendados, pushData.eventId);
        break;
      case 'NewManagementContractProposal':
        this.professionalProvider.clearEvents();
        this.account.setHasManagementJobs(true);
        this.sideMenuProvider.loadSideMenu();
        if (pushData.wasTapped) {
          this.nav.push('EventDetailManagementPage', { specialContractId: pushData.specialContractId });
        }
        break;
    }

    this.toastCtrl
      .create({
        message: pushData.message,
        position: 'top',
        showCloseButton: true,
        closeButtonText: 'OK'
      }).present();
  }

  openPage(page) {
    switch (page.component) {
      case 'x':
        this.messageProvider.confirm('Deseja realmente sair da conta?').then((answer) => {
          if (answer) {
            this.loadingProvider.show();
            this.authProvider.logout().subscribe(() => {
              this.account.logout().then(() => this.exit());
            });
          }
        });
        break;
      default:
        this.zone.run(() => {
          this.nav.setRoot(page.component);
        });
        break;
    }
  }

  exit() {
    this.loadingProvider.hide().then(() => {
      this.professionalProvider.clearEvents();
      this.menuCtrl.close();
      this.nav.setRoot('IntroPage');
    });
  }

  getSideMenu() {
    this.sideMenuProvider.loadSideMenu();
  }
}
