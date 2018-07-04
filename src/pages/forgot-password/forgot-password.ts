import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthProvider, LoadingProvider, MessageProvider, UserProvider } from '../../providers/index';

@IonicPage(0)
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  email: string;

  constructor(
    private authProvider: AuthProvider,
    private messageProvider: MessageProvider,
    private userProvider: UserProvider,
    private loadingProvider: LoadingProvider,
    public navCtrl: NavController,
    public navParams: NavParams) { }

  ionViewDidLoad() { }

  submit() {
    this.loadingProvider.show();
    this.authProvider.forgotPassword(this.email).subscribe(
      (res) => {
        this.loadingProvider.hide();
        this.messageProvider
          .alert(res);
      },
      (err) => {
        this.loadingProvider.hide();
        this.messageProvider
          .alert(err);
      }
    );
  };
}
