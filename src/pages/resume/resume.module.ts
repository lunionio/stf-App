
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResumePage } from './resume';
 
@NgModule({
  declarations: [
    ResumePage,
  ],
  imports: [
    IonicPageModule.forChild(ResumePage),
  ],
  exports: [
    ResumePage
  ]
})
export class ResumePageModule {}