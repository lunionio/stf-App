import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagementJobsPage } from './management-jobs';

import { RatingComponentModule } from '../../components/rating/rating.module';

@NgModule({
  declarations: [
    ManagementJobsPage,
  ],
  imports: [
    RatingComponentModule,
    IonicPageModule.forChild(ManagementJobsPage),
  ],
  exports: [
    ManagementJobsPage
  ]
})
export class ManagementJobsPageModule {}
