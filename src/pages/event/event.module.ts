import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventPage } from './event';

import { IonicImageLoader } from 'ionic-image-loader';
import { BackgroundImageModule } from '../../directives/background-image/background-image.module';

@NgModule({
  declarations: [
    EventPage,
  ],
  imports: [
    BackgroundImageModule,
    IonicPageModule.forChild(EventPage),
    IonicImageLoader
  ],
  exports: [
    EventPage
  ]
})
export class EventPageModule {}
