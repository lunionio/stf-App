import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IonicImageLoader } from 'ionic-image-loader';
import { EventDetailManagementPage } from './event-detail-management';
import { BackgroundImageModule } from '../../directives/background-image/background-image.module';

@NgModule({
  declarations: [
    EventDetailManagementPage
  ],
  imports: [
    BackgroundImageModule,
    IonicPageModule.forChild(EventDetailManagementPage),
    IonicImageLoader
  ],
  exports: [
    EventDetailManagementPage
  ]
})
export class EventDetailManagementPageModule {}
