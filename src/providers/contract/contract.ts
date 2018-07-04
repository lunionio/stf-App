import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ENV } from '../../config/environment.production';

@Injectable()
export class ContractProvider {
  private readonly prefix = 'contracts';

  constructor(public authHttp: AuthHttp) {
  }

  apply(jobId: number, eventId: number, enumMeetingPoint: number): Observable<any> {
    return this.authHttp.post(`${ENV.API_URL}/v2/${this.prefix}/${jobId}`, { enumMeetingPoint, eventId })
      .catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  refuse(contractId: number): Observable<any> {
    return this.authHttp.delete(`${ENV.API_URL}/v1/${this.prefix}/${contractId}`)
      .catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  rate(jobId: number, score: number, comment: string = ''): Observable<any> {
    return this.authHttp.post(`${ENV.API_URL}/v1/${this.prefix}/${jobId}/rate`, { score, comment })
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  professionalCheck(contractId: number, endPoint: string, location?: any): Observable<any> {
    return this.authHttp.post(`${ENV.API_URL}/v1/${this.prefix}/${contractId}/${endPoint}`, location || {})
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  answerContractInvite(contractId: number, accept: boolean): Observable<any> {
    let endpoint = (accept ? 'accept' : 'refuse');

    return this.authHttp.post(`${ENV.API_URL}/v1/${this.prefix}/invite/${contractId}/${endpoint}`, {})
      .catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }
}
