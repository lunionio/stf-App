import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import { FCM } from '@ionic-native/fcm';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergemap';

import { ENV } from '../../config/environment.production';
import { LocalStorage } from '../../utils/storage';
import { Masks } from '../../utils/masks';

import { Signup } from '../../models/signup';
import { FacebookUser } from '../../models/facebook-user';

@Injectable()
export class AuthProvider {

  constructor(public authHttp: AuthHttp, private platform: Platform, private storage: LocalStorage, private masks: Masks, private fcm: FCM, public http: Http) {
  }

  signin(email: string, password: string): Observable<any> {
    if (this.platform.is('cordova')) {
      return Observable
        .fromPromise(this.fcm.getToken())
        .flatMap((deviceToken) => {
          const body = { email, password, deviceToken };
          return this.http.post(`${ENV.API_URL}/v1/signin`, body)
            .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
        });
    } else {
      const body = { email, password };
      return this.http.post(`${ENV.API_URL}/v1/signin`, body)
        .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
    }
  }

  oauth2Data(provider: string, accessToken: string): Observable<FacebookUser> {
    const headers = new Headers();
    headers.append('x-access-token', accessToken);

    if (this.platform.is('cordova')) {
         return this.http.get(`${ENV.API_URL}/v1/oauth2/${provider}`, { headers })
            .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
    } else {
      return this.http.get(`${ENV.API_URL}/v1/oauth2/${provider}`, { headers })
        .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
    }
  }

  signinOAuth2(provider: String, accessToken: string): Observable<any> {
    if (this.platform.is('cordova')) {
      return Observable
        .fromPromise(this.fcm.getToken())
        .flatMap((deviceToken) => {
          const body = { accessToken, deviceToken };
          return this.http.post(`${ENV.API_URL}/v1/signin/oauth2/${provider}`, body)
            .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
        });
    } else {
      const body = { accessToken };
      return this.http.post(`${ENV.API_URL}/v1/signin/oauth2/${provider}`, body)
        .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
    }
  }

  logout(): Observable<any> {
    if (this.platform.is('cordova')) {
      return Observable
        .fromPromise(this.fcm.getToken())
        .flatMap((deviceToken) => {
          return this.authHttp.post(`${ENV.API_URL}/v1/logout`, { deviceToken })
            .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
        });
    } else {
      return this.authHttp.post(`${ENV.API_URL}/v1/logout`, { deviceToken: '123456' })
        .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
    }
  }

  refreshToken(deviceToken: string, refreshToken: string): Observable<any> {
    const body = { deviceToken, refreshToken };
    return this.authHttp.post(`${ENV.API_URL}/v1/refresh-token`, body)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${ENV.API_URL}/v1/forgot-password`, { email })
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  signup(signup: Signup): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = {
        deviceToken: null,
        name: signup.name,
        lastName: signup.lastName,
        birthdate: signup.birthdate,
        email: signup.email,
        password: signup.password,
        passwordConfirmation: signup.passwordConfirmation,
        phone: this.masks.getOnlyDigits(signup.phone),
        cellPhone: this.masks.getOnlyDigits(signup.cellPhone),
        facebookAcessToken: signup.facebookAcessToken,
        facebookId: signup.facebookId,
        professional: {
          address: {
            address1: signup.address1,
            address2: signup.address2,
            neighborhood: signup.neighborhood,
            zipCode: this.masks.getOnlyDigits(signup.zipCode),
            cityId: signup.cityId
          },
          serviceId: signup.serviceId
        }
      };
      if (this.storage.isMobile()) {
        this.fcm.getToken().then((deviceToken) => {
          body.deviceToken = deviceToken;
          this.http.post(`${ENV.API_URL}/v1/signup`, body)
            .map(res => res.json())
            .catch((errorRes: Response) => Observable.throw(errorRes.json()))
            .subscribe((response) => resolve(response), (err) => reject(err));
        }).catch((err) => {
          reject(err);
        });
      } else {
        this.http.post(`${ENV.API_URL}/v1/signup`, body)
          .map(res => res.json())
          .catch((errorRes: Response) => Observable.throw(errorRes.json()))
          .subscribe((response) => resolve(response), (err) => reject(err));
      }
    });
  }

}
