import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ENV } from '../../config/environment.production';

import { ServiceGroup } from '../../models/service-group';
import { Service } from '../../models/service';

@Injectable()
export class ServiceGroupProvider {

  constructor(public http: Http) {
  }

  getGroups(): Observable<ServiceGroup[]> {
    return this.http.get(`${ENV.API_URL}/v1/servicegroups`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  getServices(serviceGroupId: number): Observable<Service[]> {
    return this.http.get(`${ENV.API_URL}/v1/servicegroups/${serviceGroupId}/services`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

}
