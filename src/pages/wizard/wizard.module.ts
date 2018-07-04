
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WizardPage } from './wizard';

import { TextMaskModule } from 'angular2-text-mask';
 
@NgModule({
  declarations: [
    WizardPage,
  ],
  imports: [
    IonicPageModule.forChild(WizardPage),
    TextMaskModule
  ],
  exports: [
    WizardPage
  ]
})
export class WizardPageModule {}