import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusinessProfilePage } from './business-profile';

import { TextMaskModule } from 'angular2-text-mask';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [
    BusinessProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(BusinessProfilePage),
    LazyLoadImageModule,
    TextMaskModule
  ],
  exports: [
    BusinessProfilePage
  ]
})
export class BusinessProfilePageModule {}
