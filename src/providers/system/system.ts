import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ENV } from '../../config/environment.production';

@Injectable()
export class SystemProvider {

  constructor(public authHttp: AuthHttp) { }

  about(): Observable<any> {
    return this.authHttp.get(`${ENV.API_URL}/v1/system/about`).map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  faq(): Observable<any> {
    return this.authHttp.get(`${ENV.API_URL}/v1/system/faq`).map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  privacy(): Observable<any> {
    return this.authHttp.get(`${ENV.API_URL}/v1/system/privacy`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  terms(): Observable<any> {
    return this.authHttp.get(`${ENV.API_URL}/v1/system/terms`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  contact(subject: number, message: string): Observable<any> {
    let body = { subject, message };
    return this.authHttp.post(`${ENV.API_URL}/v1/system/contact`, body)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

}
