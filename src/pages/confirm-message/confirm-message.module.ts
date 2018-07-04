import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmMessagePage } from './confirm-message';

@NgModule({
  declarations: [
    ConfirmMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmMessagePage),
  ],
  exports: [
    ConfirmMessagePage
  ]
})
export class ConfirmMessagePageModule {}
