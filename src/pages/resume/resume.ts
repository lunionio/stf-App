import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { MessageProvider, LoadingProvider, ProfessionalProvider } from '../../providers/index';

@IonicPage()
@Component({
  selector: 'page-resume',
  templateUrl: 'resume.html',
})
export class ResumePage {
  resume = {
    experience: '',
    education: ''
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private messageProvider: MessageProvider,
    private loadingProvider: LoadingProvider,
    private professionalProvider: ProfessionalProvider) {
    this.professionalProvider.getResume().subscribe(resume =>
      this.resume = resume);
  }

  ionViewDidLoad() {
  }

  submit() {
    this.loadingProvider.show();
    this.professionalProvider.setResume(this.resume).subscribe(
      () => {
        this.loadingProvider.hide().then(() => {
          this.messageProvider.alert('Currículo atualizado com sucesso!');
        });
      },
      (err) => {
        this.loadingProvider.hide().then(() => {
          this.messageProvider.alert(err);
        });
      }
    );
  }

}
