import { Component, NgZone } from "@angular/core";
import { IonicPage, NavController, NavParams, MenuController } from "ionic-angular";

import { LoginService } from "./login.service";
import {
  LoadingProvider,
  MessageProvider,
  FacebookProvider
} from "../../providers/index";

import { LocalStorage } from "../../utils/storage";
import { SideMenuProvider } from "../../providers/side-menu/side-menu";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  initial: boolean;
  form: any;
  forgotPasswordPage = "ForgotPasswordPage";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private messageProvider: MessageProvider,
    private storage: LocalStorage,
    private loginService: LoginService,
    private loadingProvider: LoadingProvider,
    private zone: NgZone,
    private facebookProvider: FacebookProvider,
    public sideMenuProvider: SideMenuProvider,
    private menuCtrl: MenuController
  ) {
    this.storage
      .getInitial()
      .then(isInitial => (this.initial = isInitial || false));
    this.form = { email: "", password: "" };
  }

  ionViewDidLoad() {}

  ionViewDidEnter() {
    this.menuCtrl.swipeEnable(false);
    this.menuCtrl.enable(false);
  }

  submit(event: Event): void {
    event.preventDefault();
    this.loadingProvider.show();
    this.loginService.login(this.form.email, this.form.password).subscribe(
      () => {
        this.loadingProvider.hide();
        this.sideMenuProvider.loadSideMenu();
        this.zone.run(() => {
          this.navCtrl.setRoot("HomePage");
        });
      },
      err => {
        this.loadingProvider.hide();
        this.messageProvider.alert(err);
      }
    );
  }

  submitFacebook(): void {
    this.loadingProvider.show();
    this.facebookProvider
      .getAccessToken()
      .then(res => {
        this.loginService.facebookLogin(res).subscribe(
          () => {
            this.loadingProvider.hide();
            this.sideMenuProvider.loadSideMenu();
            this.zone.run(() => {
              this.navCtrl.setRoot("HomePage");
            });
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
