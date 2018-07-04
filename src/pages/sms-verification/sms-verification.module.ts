import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SmsVerificationPage } from './sms-verification';

import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    SmsVerificationPage,
  ],
  imports: [
    IonicPageModule.forChild(SmsVerificationPage),
    TextMaskModule
  ],
  exports: [
    SmsVerificationPage
  ]
})
export class SmsVerificationPageModule {}
