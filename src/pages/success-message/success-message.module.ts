import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SuccessMessagePage } from './success-message';
 
@NgModule({
  declarations: [
    SuccessMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(SuccessMessagePage),
  ],
  exports: [
    SuccessMessagePage
  ]
})
export class SuccessMessagePageModule {}