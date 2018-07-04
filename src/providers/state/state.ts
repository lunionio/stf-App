import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ENV } from '../../config/environment.production';

import { City } from '../../models/city';
import { State } from '../../models/state';

@Injectable()
export class StateProvider {

  constructor(public http: Http) {
  }

  getStates(): Observable<State[]> {
    return this.http.get(`${ENV.API_URL}/v1/states`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  getCities(stateId: number): Observable<City[]> {
    return this.http.get(`${ENV.API_URL}/v1/states/${stateId}/cities`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

}
