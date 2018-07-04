import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AcademicEducationPage } from './academic-education';
import { AutoCompleteModule } from 'ionic2-auto-complete';
@NgModule({
  declarations: [
    AcademicEducationPage,
  ],
  imports: [
    IonicPageModule.forChild(AcademicEducationPage),
    AutoCompleteModule
  ],
  exports: [
    AcademicEducationPage
  ]
})
export class AcademicEducationPageModule {}
