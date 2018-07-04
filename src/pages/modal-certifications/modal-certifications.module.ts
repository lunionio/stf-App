import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCertificationsPage } from './modal-certifications';

@NgModule({
  declarations: [
    ModalCertificationsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalCertificationsPage),
  ],
  exports: [
    ModalCertificationsPage
  ]
})
export class ModalCertificationsPageModule {}
