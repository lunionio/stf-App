import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoursesAndCertificationsPage } from './courses-and-certifications';

@NgModule({
  declarations: [
    CoursesAndCertificationsPage,
  ],
  imports: [
    IonicPageModule.forChild(CoursesAndCertificationsPage),
  ],
  exports: [
    CoursesAndCertificationsPage
  ]
})
export class CoursesAndCertificationsPageModule {}
