import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ENV } from '../../config/environment.production';

@Injectable()
export class EventProvider {
  private readonly prefix = 'events';

  constructor(public authHttp: AuthHttp) {
  }

  details(eventId: number): Observable<any> {
    return this.authHttp.get(`${ENV.API_URL}/v2/${this.prefix}/${eventId}/professional-context`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  favorite(eventId: number): Observable<any> {
    return this.authHttp.post(`${ENV.API_URL}/v1/${this.prefix}/${eventId}/favorite`, null)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  unfavorite(eventId: number): Observable<any> {
    return this.authHttp.delete(`${ENV.API_URL}/v1/${this.prefix}/${eventId}/unfavorite`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

}
