import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ENV } from '../../config/environment.production';

@Injectable()
export class UserProvider {
  private readonly prefix = 'users';

  constructor(public authHttp: AuthHttp) {
  }

  getDefaultAvatar(): string {
    return `${ENV.CDN_URL}/users/avatar/default.png`;
  }

  setAvatar(): Observable<any> {
    return this.authHttp.post(`${ENV.API_URL}/v1/${this.prefix}/avatar`, {})
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  deleteAvatar(): Observable<any> {
    return this.authHttp.delete(`${ENV.API_URL}/v1/${this.prefix}/avatar`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  update(user: any): Observable<any> {
    return this.authHttp.put(`${ENV.API_URL}/v1/${this.prefix}`, user)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  changePassword(password: string, newPassword: string, passwordConfirmation: string): Observable<any> {
    let body = { password, newPassword, passwordConfirmation };
    return this.authHttp.post(`${ENV.API_URL}/v1/${this.prefix}/password`, body)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  cellPhoneValidationRequest(): Observable<any> {
    return this.authHttp.post(`${ENV.API_URL}/v1/${this.prefix}/cellphone-validation-start`, {})
      .catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  cellPhoneValidationSubmit(code: String): Observable<any> {
    return this.authHttp.post(`${ENV.API_URL}/v1/${this.prefix}/cellphone-validation-end`, { code: code })
      .catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }
}
