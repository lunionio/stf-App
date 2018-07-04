import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventFeedbackPage } from './event-feedback';
 
import { RatingComponentModule } from '../../components/rating/rating.module';

@NgModule({
  declarations: [
    EventFeedbackPage,
  ],
  imports: [
    RatingComponentModule,
    IonicPageModule.forChild(EventFeedbackPage),
  ],
  exports: [
    EventFeedbackPage
  ]
})
export class EventFeedbackPageModule {}