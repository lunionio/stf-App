import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CertificationsDetailPage } from './certifications-detail';
import { AutoCompleteModule } from 'ionic2-auto-complete';
@NgModule({
  declarations: [
    CertificationsDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CertificationsDetailPage),
    AutoCompleteModule
  ],
  exports: [
    CertificationsDetailPage
  ]
})
export class CertificationsDetailPageModule {}
