import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AuthHttp } from 'angular2-jwt';
import { ENV } from '../../config/environment.production';
import { Observable } from 'rxjs';

@Injectable()
export class ListingsProvider {

  private readonly prefix = 'listings';

  constructor(public authHttp: AuthHttp) { }

  getEducationalInstitutions(): Observable<any> {
    return this.authHttp.get(`${ENV.API_URL}/v1/${this.prefix}/educational-institutions`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  getCourses(): Observable<any> {
    return this.authHttp.get(`${ENV.API_URL}/v1/${this.prefix}/courses`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  getCertificates(): Observable<any> {
    return this.authHttp.get(`${ENV.API_URL}/v1/${this.prefix}/certificates`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }
}
