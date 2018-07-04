import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ENV } from '../../config/environment.production';
import { ManagementJob } from '../../models/management-job';
import { EventContractsManagement } from '../../models/event-contracts-management';

@Injectable()
export class SpecialContractProvider {

  constructor(public authHttp: AuthHttp) {
  }

  getManagementEvents(): Observable<ManagementJob[]> {
    return this.authHttp.get(`${ENV.API_URL}/v1/special-contracts`).map(res =>
      res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  changeSpecialContractStatus(specialContractId: number, accept: boolean): Observable<any> {
    const endPoint = accept ? 'accept' : 'cancel';
    return this.authHttp.post(`${ENV.API_URL}/v1/special-contracts/${specialContractId}/${endPoint}`, null)
    .catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  getEventManagementContracts(specialContractId: number): Observable<EventContractsManagement> {
    return this.authHttp.get(`${ENV.API_URL}/v1/special-contracts/${specialContractId}/contracts-management`)
    .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  manageProfessionalPresence(contractId: number, action: string): Observable<any> {
    return this.authHttp.post(`${ENV.API_URL}/v1/contracts/${contractId}/${action}`, null)
    .catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }
}
