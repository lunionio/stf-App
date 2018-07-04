import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

const APP_ACCOUNT: string = 'APP-ACCOUNT';
const APP_TOKEN: string = 'APP-TOKEN';
const APP_INIT: string = 'APP-APP_INIT';

@Injectable()
export class LocalStorage {
  accessToken: string;

  constructor(private platform: Platform, private storage: Storage) {
    this.getToken().then(accessToken => this.accessToken = accessToken);
  }

  private getItem(itemName: string): Promise<any> {
    return new Promise(
      (resolve, reject) =>
        this.storage.get(itemName)
          .then((value) => resolve(JSON.parse(value)))
          .catch(err => reject(err))
    );
  }

  /* Init */
  getInitial(): Promise<any> {
    return this.getItem(APP_INIT);
  }
  setInitial() {
    this.storage.set(APP_INIT, JSON.stringify(true));
  }

  /* Token */
  getToken(): Promise<any> {
    return this.getItem(APP_TOKEN);
  }
  setToken(token: string): Promise<any> {
    return this.storage.set(APP_TOKEN, JSON.stringify(token));
  }
  removeToken(): Promise<any> {
    return this.storage.remove(APP_TOKEN);
  }

  /* Account */
  getAccount(): Promise<any> {
    return this.getItem(APP_ACCOUNT);
  }
  setAccount(account: any): Promise<any> {
    return this.storage.set(APP_ACCOUNT, account.toJSON());
  }
  setAvatar(imageAvatar: string): Promise<any> {
    return new Promise(resolve => {
      this.getAccount().then(account => {
        account.imageAvatar = imageAvatar;
        this.storage.set(APP_ACCOUNT, JSON.stringify(account)).then(() => resolve);
      });
    });
  }
  removeAccount(): Promise<any> {
    return this.storage.remove(APP_ACCOUNT);
  }

  /* Check browser */
  isMobile() {
    return !this.platform.is('core') && !this.platform.is('mobileweb');
  }
}
