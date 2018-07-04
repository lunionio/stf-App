import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BankPage } from './bank';

import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    BankPage,
  ],
  imports: [
    IonicPageModule.forChild(BankPage),
    TextMaskModule
  ],
  exports: [
    BankPage
  ]
})
export class BankPageModule {}
