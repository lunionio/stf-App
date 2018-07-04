import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventsPage } from './events';

import { RatingComponentModule } from '../../components/rating/rating.module';
 
@NgModule({
  declarations: [
    EventsPage,
  ],
  imports: [
    RatingComponentModule,
    IonicPageModule.forChild(EventsPage),
  ],
  exports: [
    EventsPage
  ]
})
export class EventsPageModule {}