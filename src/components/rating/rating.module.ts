import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RatingComponent } from './rating';

@NgModule({
  declarations: [
    RatingComponent,
  ],
  imports: [
    IonicPageModule.forChild(RatingComponent),
  ],
  exports: [
    RatingComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class RatingComponentModule {}
