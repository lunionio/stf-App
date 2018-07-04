import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCoursesPage } from './modal-courses';

@NgModule({
  declarations: [
    ModalCoursesPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalCoursesPage),
  ],
  exports: [
    ModalCoursesPage
  ]
})
export class ModalCoursesPageModule {}
