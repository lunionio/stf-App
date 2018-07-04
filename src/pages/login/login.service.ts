import { Injectable } from '@angular/core';
import { LocalStorage } from '../../utils/storage';

import { Account } from '../../utils/account';

import { AuthProvider, MessageProvider, LoadingProvider } from '../../providers/index';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class LoginService {
  constructor(
    private account: Account,
    private authProvider: AuthProvider,
    private loadingProvider: LoadingProvider,
    private storage: LocalStorage,
    private messageProvider: MessageProvider) { }

  login(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.authProvider.signin(email, password).subscribe(
        async response => {
          await this.account.set(response.user.email, response.user.displayName, response.user.imageAvatar, response.user.enumProfessionalType, response.user.rating || 0, response.user.cityPushGroup, response.user.hasManagementJobs);
          await this.storage.setToken(response.token);

          observer.next();
          observer.complete();
        },
        (err) => {
          observer.error(err);
          observer.complete();
        }
      );
    });
  }

  facebookLogin(accessToken: string): Observable<any> {
    return new Observable(observer => {
      this.authProvider.signinOAuth2('facebook', accessToken).subscribe(
        async response => {
          await this.account.set(response.user.email, response.user.displayName, response.user.imageAvatar, response.user.enumProfessionalType, response.user.rating || 0, response.user.cityPushGroup, response.user.hasManagementJobs);
          await this.storage.setToken(response.token);

          observer.next();
          observer.complete();
        },
        (err) => {
          observer.error(err);
          observer.complete();
        }
      );
    });
  }
}
