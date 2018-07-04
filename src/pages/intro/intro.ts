import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, MenuController} from "ionic-angular";
import { AuthProvider, MessageProvider, LoadingProvider, FacebookProvider } from '../../providers/index';

@IonicPage()
@Component({
  selector: "page-intro",
  templateUrl: "intro.html"
})
export class IntroPage {
  wizardPage = "WizardPage";
  loginPage = "LoginPage";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingProvider: LoadingProvider,
    private messageProvider: MessageProvider,
    private authProvider: AuthProvider,
    private facebookProvider: FacebookProvider,
    private menuCtrl: MenuController
  ) {}

  ionViewDidLoad() {}

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
    this.menuCtrl.enable(false);
  }

  facebookSignup() {
    this.loadingProvider.show();
    this.facebookProvider
      .getAccessToken()
      .then(res => {
        this.authProvider.oauth2Data('facebook', res).subscribe(
          (res) => {
            this.loadingProvider.hide();
            this.navCtrl.push('WizardPage', { fbUser: res });
          },
          err => {
            this.loadingProvider.hide();
            this.messageProvider.alert(err);
          }
        );
      })
      .catch(err => {
        this.loadingProvider.hide();
        this.messageProvider.alert('Desculpe, houve um erro de comunicação com o facebook. Por favor, tente novamente ou entre em contato.');
      });
  }
}
