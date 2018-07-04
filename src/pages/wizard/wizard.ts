import { Component, ViewChild } from "@angular/core";
import {
  Content,
  IonicPage,
  ModalController,
  NavController,
  NavParams,
  Slides
} from "ionic-angular";

import {
  AuthProvider,
  LocationProvider,
  LoadingProvider,
  MessageProvider,
  ServiceGroupProvider,
  StateProvider
} from "../../providers/index";

import { Account } from "../../utils/account";
import { LocalStorage } from "../../utils/storage";
import { Masks } from "../../utils/masks";

import { Signup } from "../../models/signup";
import { FacebookUser } from "../../models/facebook-user";
import { SideMenuProvider } from "../../providers/side-menu/side-menu";

@IonicPage()
@Component({
  selector: "page-wizard",
  templateUrl: "wizard.html"
})
export class WizardPage {
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Content) content: Content;

  signup: Signup;
  step: number;
  areas: any[];
  states: any[];
  cities: any[] = [];
  serviceGroups: any[] = [];
  services: any[] = [];
  selectedCity: any = {};
  selectedServiceGroup: number;
  year = new Date().getFullYear();
  maxYear = this.year.toString();
  minYear = (this.year - 80).toString();

  constructor(
    private account: Account,
    private authProvider: AuthProvider,
    private loadingProvider: LoadingProvider,
    private storage: LocalStorage,
    private locationProvider: LocationProvider,
    public masks: Masks,
    private messageProvider: MessageProvider,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private serviceGroupProvider: ServiceGroupProvider,
    private stateProvider: StateProvider,
    public sideMenuProvider: SideMenuProvider
  ) {
    this.signup = new Signup();
    this.stateProvider.getStates().subscribe(states => (this.states = states));
    this.serviceGroupProvider
      .getGroups()
      .subscribe(serviceGroups => (this.serviceGroups = serviceGroups));
  }

  ionViewDidLoad() {
    this.slides.lockSwipes(true);
    this.step = 1;

    const fbUser: FacebookUser = this.navParams.get("fbUser");

    if(fbUser){
      this.signup.name = fbUser.first_name || fbUser.name;
      this.signup.lastName = fbUser.last_name;
      this.signup.birthdate = fbUser.birthday;
      this.signup.email = fbUser.email;
      this.signup.facebookId = fbUser.id;
      this.signup.facebookAcessToken = fbUser.accessToken;
    }
  }

  onZipcodeChange(event: Event) {
    let zipCode = this.signup.zipCode
      ? this.signup.zipCode.replace(/[^0-9]/g, "")
      : "";
    if (zipCode.length === 8) {
      this.locationProvider.cep(zipCode).subscribe(cepResult => {
        this.cities = cepResult.cities;
        this.signup.address1 = cepResult.address;
        this.signup.stateId = cepResult.stateId;
        this.signup.cityId = cepResult.cityId;
        this.signup.neighborhood = cepResult.neighborhood;
        this.setSelectedCity();
      });
    }
  }

  onStateChange(event: Event) {
    this.stateProvider
      .getCities(this.signup.stateId)
      .subscribe(cities => (this.cities = cities));
  }

  onServiceGroupChange(event: Event) {
    this.serviceGroupProvider
      .getServices(this.selectedServiceGroup)
      .subscribe(services => (this.services = services));
  }

  next() {
    switch (this.step) {
      case 1:
        if (!this.signup.name)
          return this.messageProvider.alert("É necessário informar o nome.");
        else if (!this.signup.lastName)
          return this.messageProvider.alert(
            "É necessário informar o sobrenome."
          );
        else if (!this.signup.email)
          return this.messageProvider.alert("É necessário informar o email.");
        else if (!this.signup.facebookId) {
          if (!this.signup.password)
            // else if (!this.signup.birthdate) return this.messageProvider.alert('É necessário informar a data de nascimento.');
            return this.messageProvider.alert("É necessário informar a senha.");
          else if (this.signup.password.length < 6)
            return this.messageProvider.alert(
              "A senha deve ter ao menos 6 caracteres."
            );
          else if (this.signup.password !== this.signup.passwordConfirmation)
            return this.messageProvider.alert("As senhas não coincidem.");
        } else if (!this.signup.cellPhone)
          return this.messageProvider.alert("É necessário informar o celular.");
        break;
      case 2:
        if (!this.signup.name)
          return this.messageProvider.alert("É necessário informar o nome.");
        else if (
          this.signup.zipCode &&
          this.masks.getOnlyDigits(this.signup.zipCode).length !== 8
        )
          // else if (!this.signup.zipCode) return this.messageProvider.alert('É necessário informar o cep.');
          return this.messageProvider.alert("Cep inválido.");
        // else if (!this.signup.address1) return this.messageProvider.alert('É necessário informar o endereço.');
        // else if (!this.signup.neighborhood) return this.messageProvider.alert('É necessário informar o bairro.');
        // else if (!this.signup.stateId) return this.messageProvider.alert('É necessário informar o estado.');
        // else if (!this.signup.cityId) return this.messageProvider.alert('É necessário informar a cidade.');
        // else if (!this.signup.neighborhood) return this.messageProvider.alert('É necessário informar a cidade.');
        break;
    }

    this.step++;
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
    this.content.scrollToTop();
  }

  prev() {
    this.step--;
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
    this.content.scrollToTop();
  }

  submit() {
    if (!this.selectedServiceGroup)
      return this.messageProvider.alert(
        "É necessário selecionar a área de atuação."
      );
    else if (!this.signup.serviceId)
      return this.messageProvider.alert(
        "É necessário informar a especialização."
      );

    this.loadingProvider.show();
    this.authProvider
      .signup(this.signup)
      .then(response => {
        this.account.set(
          response.user.email,
          response.user.displayName,
          response.user.imageAvatar,
          response.user.enumProfessionalType,
          response.user.rating,
          response.user.cityPushGroup,
          response.user.hasManagementJobs
        ).then(() => {
          this.storage.setToken(response.token);
          this.loadingProvider.hide();
          this.sideMenuProvider.loadSideMenu();
          this.navCtrl.setRoot("SuccessPage");
        });
      })
      .catch(err => {
        this.loadingProvider.hide().then(() => {
          this.messageProvider.alert(err);
        });
      });
  }

  setSelectedCity() {
    for (let i = 0, _len = this.cities.length; i < _len; i++) {
      if (this.cities[i].cityId === this.signup.cityId) {
        this.selectedCity = this.cities[i];
        break;
      }
    }
  }

  selectCity() {
    const citySelect = this.modalCtrl.create("SelectPage", {
      items: this.cities,
      title: "Selecione a cidade"
    });
    citySelect.onDidDismiss(data => {
      if (data) {
        this.selectedCity = data;
        this.signup.cityId = this.selectedCity.cityId;
      }
    });
    citySelect.present();
  }
}
