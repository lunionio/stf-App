import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Masks } from '../../utils/masks';
import { UserProvider, LoadingProvider, MessageProvider } from '../../providers/index';

@IonicPage()
@Component({
  selector: 'page-sms-verification',
  templateUrl: 'sms-verification.html',
})
export class SmsVerificationPage {
  title: string;
  subtitle: string;
  codeSms: string;
  processLock: Boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewController: ViewController,
    public masks: Masks,
    private userProvider: UserProvider,
    private loadingProvider: LoadingProvider,
    private messageProvider: MessageProvider) {

    this.title = this.navParams.get('title');
    this.subtitle = this.navParams.get('subtitle');
    this.processLock = false;

  }

  ionViewDidLoad() {

  }

  resend() {
    if (!this.processLock) {
      this.processLock = true;
      this.loadingProvider.show();

      this.userProvider.cellPhoneValidationRequest().subscribe(
        () => {
          this.loadingProvider.hide();
        },
        (err) => {
          this.processLock = false;
          this.loadingProvider.hide().then(() => {
            this.messageProvider.alert(err);
          });
        }
      );
    }
  }

  submit() {
    if (!this.processLock) {
      this.processLock = true;
      this.loadingProvider.show();

      this.userProvider.cellPhoneValidationSubmit(this.masks.getOnlyDigits(this.codeSms)).subscribe(
        () => {
          this.loadingProvider.hide().then(() =>{
            this.viewController.dismiss(true);
          })
        },
        (err) => {
          this.processLock = false;
          this.loadingProvider.hide().then(() => {
            this.messageProvider.alert(err);
          });
        }
      );
    }
  }
}
