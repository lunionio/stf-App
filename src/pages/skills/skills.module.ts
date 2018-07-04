
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SkillsPage } from './skills';
import { CustomIonInputCurrencyMaskModule } from '../../directives/custom-ion-input-currency-mask/custom-ion-input-currency-mask.module';

@NgModule({
  declarations: [
    SkillsPage,
  ],
  imports: [
    IonicPageModule.forChild(SkillsPage),
    CustomIonInputCurrencyMaskModule
  ],
  exports: [
    SkillsPage
  ]
})
export class SkillsPageModule {}
