import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventSubscribePage } from './event-subscribe';
 
@NgModule({
  declarations: [
    EventSubscribePage,
  ],
  imports: [
    IonicPageModule.forChild(EventSubscribePage),
  ],
  exports: [
    EventSubscribePage
  ]
})
export class EventSubscribePageModule {}