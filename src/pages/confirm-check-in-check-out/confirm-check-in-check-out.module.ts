import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmCheckInCheckOutPage } from './confirm-check-in-check-out';

@NgModule({
  declarations: [
    ConfirmCheckInCheckOutPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmCheckInCheckOutPage),
  ],
  exports: [
    ConfirmCheckInCheckOutPage
  ]
})
export class ConfirmCheckInCheckOutPageModule {}
