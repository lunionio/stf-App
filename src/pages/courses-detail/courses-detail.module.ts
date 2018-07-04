import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoursesDetailPage } from './courses-detail';
import { AutoCompleteModule } from 'ionic2-auto-complete';

@NgModule({
  declarations: [
    CoursesDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CoursesDetailPage),
    AutoCompleteModule
  ],
  exports: [
    CoursesDetailPage
  ]
})
export class CoursesDetailPageModule {}
