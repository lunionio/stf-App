import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { FCM } from '@ionic-native/fcm'

import { LocalStorage } from '../utils/storage';

export type EnumProfessionalType = 'Freelancer' | 'Empresa';

@Injectable()
export class Account {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  rating: number;
  cityPushGroup: string;
  imageAvatar: string;
  enumProfessionalType: EnumProfessionalType;
  hasManagementJobs: boolean;

  constructor(private fcm: FCM, private platform: Platform, private storage: LocalStorage) { }

  set(email: string, displayName: string, imageAvatar: string, enumProfessionalType: EnumProfessionalType, rating: number, cityPushGroup: string, hasManagementJobs: boolean) {
    return new Promise((resolve, reject) => {

      this.email = email;
      this.displayName = displayName;
      this.imageAvatar = imageAvatar;
      this.rating = rating;
      this.enumProfessionalType = enumProfessionalType;
      this.cityPushGroup = cityPushGroup;
      this.hasManagementJobs = hasManagementJobs;

      if (this.storage.isMobile()) {
        this.fcm.unsubscribeFromTopic(this.cityPushGroup).then(() => {
          this.fcm.subscribeToTopic(cityPushGroup).then(() => {
            this.storage.setAccount(this).then(() => resolve()).catch(err => reject(err));
          }).catch(err => reject(err));
        }).catch(err => reject(err));
      }
      else {
        this.storage.setAccount(this).then(() => resolve()).catch(err => reject(err));
      }
    });
  }

  public toJSON(): string {
    let obj: any = {};

    for (let key in this) {
      if (key !== 'fcm' && key !== 'storage' && key !== 'platform' && typeof this[key] !== 'function') {
        obj[key] = this[key];
      }
    }

    return JSON.stringify(obj);
  }

  logout(): Promise<any> {
    return new Promise(resolve => {
      if (this.platform.is('cordova')) {
        this.fcm.unsubscribeFromTopic(this.cityPushGroup).then(() => {
          this.storage.removeAccount().then(() => {
            this.storage.removeToken().then(() => {
              resolve();
            });
          });
        });
      }
      else {
        this.storage.removeAccount().then(() => {
          this.storage.removeToken().then(() => {
            resolve();
          });
        });
      }
    });
  }

  getImageAvatar() {
    return this.imageAvatar;
  }

  setImageAvatar(imageAvatar: string) {
    this.imageAvatar = imageAvatar;
    this.storage.setAvatar(imageAvatar);
  }

  setHasManagementJobs(has: boolean) {
    this.hasManagementJobs = has;
  }
}
