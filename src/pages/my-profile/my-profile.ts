import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ProfessionalProvider } from '../../providers/index';

import { Account } from '../../utils/account';

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {

  documentsPage = 'DocumentsPage';
  skillsPage = 'SkillsPage';
  businessProfilePage = 'BusinessProfilePage';
  changePasswordPage = 'ChangePasswordPage';
  resumePage = 'ResumePage';
  profilePage = 'ProfilePage';
  bankPage = 'BankPage';
  coursesAndCertifications = 'CoursesAndCertificationsPage';
  academicEducation = 'AcademicEducationPage';

  documents: any = {};
  isDocumentsPending: boolean = false;

  constructor(
    public account: Account,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private professionalProvider: ProfessionalProvider) {
  }

  ionViewDidLoad() {
    this.professionalProvider.getDocuments().subscribe((documents) => {
      this.isDocumentsPending = this.professionalProvider.isDocumentsPending(documents);
    });
  }


  goToNotifications() {
    this.professionalProvider.getNotificationSettings().subscribe(notifications =>
      this.navCtrl.push('NotificationsPage', { notifications: notifications })
    );
  }

}
