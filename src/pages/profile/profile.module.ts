import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';

import { TextMaskModule } from 'angular2-text-mask';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    LazyLoadImageModule,
    TextMaskModule
  ],
  exports: [
    ProfilePage
  ]
})
export class ProfilePageModule {}
