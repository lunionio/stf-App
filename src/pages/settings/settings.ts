import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  aboutPage = 'AboutPage';

  faqPage = 'FaqPage';
  contactPage = 'ContactPage';
  privacyPage = 'PrivacyPage';
  profilePage = 'ProfilePage';
  termsPage = 'TermsPage';


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) { }

}
