import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocumentsPage } from './documents';

import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    DocumentsPage,
  ],
  imports: [
    IonicPageModule.forChild(DocumentsPage),
    TextMaskModule
  ],
  exports: [
    DocumentsPage
  ]
})
export class DocumentsPageModule {}
