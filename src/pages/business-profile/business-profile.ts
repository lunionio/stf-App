import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

import { conformToMask } from 'angular2-text-mask';

import {
  LoadingProvider,
  LocationProvider,
  MessageProvider,
  PictureProvider,
  PICTURE_ACTION,
  ProfessionalProvider,
  StateProvider
} from '../../providers/index';

import { Masks } from '../../utils/masks';

@IonicPage()
@Component({
  selector: 'page-business-profile',
  templateUrl: 'business-profile.html',
})
export class BusinessProfilePage {
  profile: any = {};
  selectedCity: any = {};
  states: any[];
  cities: any[];

  private readonly PICTURE_RESPONSEID_AVATAR: string = 'AVATAR';

  constructor(
    private loadingProvider: LoadingProvider,
    private locationProvider: LocationProvider,
    public masks: Masks,
    private messageProvider: MessageProvider,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private professionalProvider: ProfessionalProvider,
    private pictureProvider: PictureProvider,
    private stateProvider: StateProvider) {

    this.stateProvider.getStates().subscribe((states) => this.states = states);

    this.professionalProvider.getBusinessProfile().subscribe((profile) => {
      this.profile = profile;
      this.profile.zipCode = conformToMask(this.profile.zipCode, this.masks.ZIPCODE.mask, {}).conformedValue;
      this.profile.companyPhone = conformToMask(this.profile.companyPhone, this.masks.PHONE.mask, {}).conformedValue;
      if (profile.stateId) {
        this.stateProvider.getCities(profile.stateId).subscribe((cities) => {
          this.cities = cities;
          this.setSelectedCity();
        });
      }
    });

    this.pictureProvider.onSelectPicture().subscribe((result) => {
      if (result.id === this.PICTURE_RESPONSEID_AVATAR) {
        switch (result.action) {
          case PICTURE_ACTION.DELETED:
            this.professionalProvider.deleteCompanyAvatar().subscribe(() => {
              this.profile.companyAvatar = this.professionalProvider.getDefaultCompanyAvatar();
            });
            break;
          case PICTURE_ACTION.UPLOADED:
            this.profile.companyAvatar = result.filename;
            break;
        }
      }
    });
  }

  ionViewDidLoad() {
  }

  getCompanyAvatar() {
    return this.profile && this.profile.companyAvatar
      ? this.profile.companyAvatar
      : this.professionalProvider.getDefaultCompanyAvatar();
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
  }

  onStateChange(event: Event) {
    this.stateProvider.getCities(this.profile.stateId).subscribe((cities) => this.cities = cities);
  }

  submit() {
    this.loadingProvider.show();
    this.professionalProvider.setProfile(this.profile).subscribe(
      () => {
        this.loadingProvider.hide().then(() => {
          this.messageProvider.alert('Perfil atualizado com sucesso.');
        });
      },
      (err) => {
        this.loadingProvider.hide().then(()=>{
          this.messageProvider.alert(err);
        });
      }
    );
  }

  selectCompanyAvatar() {
    this.pictureProvider.selectPicture(
      this.PICTURE_RESPONSEID_AVATAR,
      'v1/upload/professionals/company-avatar',
      {
        targetWidth: 184,
        targetHeight: 184,
        allowEdit: true
      },
      null,
      {
        width: 184,
        height: 184
      });
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
}
