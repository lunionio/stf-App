import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Account } from '../../utils/account';

@Injectable()

export class SideMenuProvider {
  pages: Array<{ icon: string, title: string, component: any, show: boolean }>;

  constructor(
    public account: Account,
    public http: Http) {
  }

  loadSideMenu() {
    this.pages = [
      { icon: 'md-calendar', title: 'Oportunidades', component: 'HomePage', show: true },
      { icon: 'ios-globe-outline', title: 'Meus Eventos', component: 'MyEventsPage', show: true },
      { icon: 'ios-briefcase', title: 'Gestor', component: 'ManagementJobsPage', show: true }, // Exibição dinâmica via this.account.hasManagementJobs cancelada. Solicitação de Ricardo Dias.
      { icon: 'md-create', title: 'Meu Perfil', component: 'MyProfilePage', show: true },
      { icon: 'ios-mail-outline', title: 'Fale Conosco', component: 'ContactPage', show: true },
      { icon: 'md-settings', title: 'Configurações', component: 'SettingsPage', show: true },
    ];
  }
}
