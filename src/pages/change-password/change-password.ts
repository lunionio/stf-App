import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LoadingProvider, MessageProvider, UserProvider } from '../../providers/index';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  password: string;
  newPassword: string;
  passwordConfirmation: string;

  constructor(private messageProvider: MessageProvider, private loadingProvider: LoadingProvider, public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider) {
  }

  ionViewDidLoad() { }

  submit() {
    this.loadingProvider.show();
    this.userProvider.changePassword(this.password, this.newPassword, this.passwordConfirmation).subscribe(
      () => {
        this.loadingProvider.hide().then(() => {
          this.messageProvider.alert('Senha atualizada com sucesso!').then(() => {
            this.password = this.newPassword = this.passwordConfirmation = '';
            this.navCtrl.pop();
          });
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
