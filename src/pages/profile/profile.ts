import { Component } from '@angular/core';
import {
  IonicPage,
  ModalController,
  NavController,
  NavParams
} from 'ionic-angular';

import { conformToMask } from 'angular2-text-mask';

import {
  MessageProvider,
  LoadingProvider,
  LocationProvider,
  PictureProvider,
  PICTURE_ACTION,
  ProfessionalProvider,
  StateProvider,
  UserProvider
} from '../../providers/index';

import { Account } from '../../utils/account';
import { Masks } from '../../utils/masks';
import { LocalStorage } from '../../utils/storage';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  profile: any = {};
  states: any[];
  cities: any[];
  lastImage: string;
  selectedCity: any = {};
  year = (new Date()).getFullYear();
  maxYear = this.year.toString();
  minYear = (this.year - 80).toString();
  processLock: Boolean;
  currentCellPhone: string;

  private readonly PICTURE_RESPONSEID_AVATAR: string = 'AVATAR';

  constructor(
    private account: Account,
    private messageProvider: MessageProvider,
    private professionalProvider: ProfessionalProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingProvider: LoadingProvider,
    private locationProvider: LocationProvider,
    private storage: LocalStorage,
    public masks: Masks,
    private modalCtrl: ModalController,
    private pictureProvider: PictureProvider,
    private stateProvider: StateProvider,
    private userProvider: UserProvider) {

    this.processLock = false;
    stateProvider.getStates().subscribe((states) => this.states = states);

    professionalProvider.getProfile().subscribe((profile) => {
      this.profile = profile;
      this.profile.zipCode = conformToMask(this.profile.zipCode, this.masks.ZIPCODE.mask, {}).conformedValue;
      this.profile.phone = conformToMask(this.profile.phone, this.masks.PHONE.mask, {}).conformedValue;
      this.profile.cellPhone = conformToMask(this.profile.cellPhone, this.masks.CELLPHONE.mask, {}).conformedValue;
      this.currentCellPhone = this.masks.getOnlyDigits(this.profile.cellPhone);
      if (profile.stateId) {
        this.stateProvider.getCities(profile.stateId).subscribe((cities) => {
          this.cities = cities;
          this.setSelectedCity();
        });
      }
    });

    pictureProvider.onSelectPicture().subscribe((result) => {
      if (result.id === this.PICTURE_RESPONSEID_AVATAR) {
        switch (result.action) {
          case PICTURE_ACTION.DELETED:
            this.userProvider.deleteAvatar().subscribe(() => {
              this.profile.imageAvatar = this.userProvider.getDefaultAvatar();
              this.account.setImageAvatar(this.profile.imageAvatar);
            });
            break;
          case PICTURE_ACTION.UPLOADED:
            this.profile.imageAvatar = result.filename;
            this.account.setImageAvatar(this.profile.imageAvatar);
            break;
        }
      }
    });
  }

  onZipcodeChange(event: Event) {
    let zipCode = this.profile.zipCode ? this.profile.zipCode.replace(/[^0-9]/g, '') : '';
    if (zipCode.length === 8) {
      this.locationProvider.cep(zipCode).subscribe((response) => {
        this.cities = response.cities;
        this.profile.address1 = response.address;
        this.profile.stateId = response.stateId;
        this.profile.cityId = response.cityId;
        this.profile.neighborhood = response.neighborhood;
        this.setSelectedCity();
      });
    }

    this.onConformToMaskChange("zipCode");
  }

  onStateChange(event: Event) {
    this.stateProvider.getCities(this.profile.stateId).subscribe((cities) => this.cities = cities);
  }

  submit() {
    this.loadingProvider.show();
    this.professionalProvider.setProfile(this.profile).subscribe(
      () => {

        this.loadingProvider.hide().then(() => {
          this.account.set(this.profile.email, [this.profile.name, this.profile.lastName].join(' '), this.profile.imageAvatar, this.profile.enumProfessionalType, this.account.rating, `cidade_${this.profile.cityId}`, this.account.hasManagementJobs);
          if (this.currentCellPhone != this.masks.getOnlyDigits(this.profile.cellPhone)){
            this.profile.isCellPhoneValid = false;
            this.currentCellPhone = this.masks.getOnlyDigits(this.profile.cellPhone);
          }
          this.messageProvider.alert('Perfil atualizado com sucesso.');
        });
      },
      (err) => {
        this.loadingProvider.hide().then(() => {
          this.messageProvider.alert(err);
        });
      }
    );
  }

  selectAvatar() {
    this.pictureProvider.selectPicture(
      this.PICTURE_RESPONSEID_AVATAR,
      'v1/upload/users/avatar',
      {
        targetWidth: 184,
        targetHeight: 184,
        allowEdit: true
      },
      null,
      {
        width: 184,
        height: 184
      }
    );
  }

  setSelectedCity() {
    for (let i = 0, _len = this.cities.length; i < _len; i++) {
      if (this.cities[i].cityId === this.profile.cityId) {
        this.selectedCity = this.cities[i];
        break;
      }
    }
  }

  selectCity() {
    const citySelect = this.modalCtrl.create('SelectPage', { items: this.cities, title: 'Selecione a cidade' });
    citySelect.onDidDismiss((data) => {
      if (data) {
        this.selectedCity = data;
        this.profile.cityId = this.selectedCity.cityId;
      }
    });
    citySelect.present();
  }

  smsVerification() {
    if (!this.processLock) {
      this.processLock = true;
      this.loadingProvider.show();

      this.userProvider.cellPhoneValidationRequest().subscribe(
        () => {
          this.loadingProvider.hide().then(() => {

            let modal = this.modalCtrl.create('SmsVerificationPage', {
              title: "Verificação via SMS",
              subtitle: "Digite o código enviado para seu celular para confirmar seu número."
            });

            modal.onDidDismiss((valid) => {
              this.processLock = false;
              this.profile.isCellPhoneValid = valid;
            })

            modal.present();

          });
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


  onConformToMaskChange(typeMaskName) {
    switch (typeMaskName) {
      case "zipCode":
        this.profile.zipCode = conformToMask(this.profile.zipCode, this.masks.ZIPCODE.mask, { guide: false }).conformedValue;
        break;
      case "phone":
        this.profile.phone = conformToMask(this.profile.phone, this.masks.PHONE.mask, { guide: false }).conformedValue;
        break;
      case "cellPhone":
        this.profile.cellPhone = conformToMask(this.profile.cellPhone, this.masks.CELLPHONE.mask, { guide: false }).conformedValue;
        break;
    }
  } //função para corrigir o bug da mascara em tempo real/ enquanto o usario digita no campo
}
