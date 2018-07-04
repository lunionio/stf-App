import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ENV } from '../../config/environment.production';

import { EventFilter } from '../../models/event';

@Injectable()
export class ProfessionalProvider {
  private readonly prefix = 'professionals';
  public eventsObservable: any;
  public eventsObserver: any;

  public pagers: any = {
    [EventFilter.Eventos_Agendados]: { total: 0, rows: [], page: 1 },
    [EventFilter.Eventos_EmAnalise]: { total: 0, rows: [], page: 1 },
    [EventFilter.Eventos_Realizados]: { total: 0, rows: [], page: 1 },
    [EventFilter.Oportunidades_Disponiveis]: { total: 0, rows: [], page: 1 },
    [EventFilter.Oportunidades_Favoritas]: { total: 0, rows: [], page: 1 },
    [EventFilter.Oportunidades_Recusadas]: { total: 0, rows: [], page: 1 },
    [EventFilter.Oportunidades_Convites]: { total: 0, rows: [], page: 1 }
  };

  constructor(public authHttp: AuthHttp) {
    this.eventsObservable = Observable.create((observer) => {
      this.eventsObserver = observer;
    });
  }

  getEvents(filter: EventFilter, page: number, pagesize: number = 10): Observable<any> {
    const requestOptions = {
      params: { page, pagesize }
    };
    return this.authHttp.get(`${ENV.API_URL}/v2/${this.prefix}/events/${EventFilter[filter].toLowerCase()}`, requestOptions).map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  public clearEvents() {
    this.pagers = {
      [EventFilter.Eventos_Agendados]: { total: 0, rows: [], page: 1 },
      [EventFilter.Eventos_EmAnalise]: { total: 0, rows: [], page: 1 },
      [EventFilter.Eventos_Realizados]: { total: 0, rows: [], page: 1 },
      [EventFilter.Oportunidades_Disponiveis]: { total: 0, rows: [], page: 1 },
      [EventFilter.Oportunidades_Favoritas]: { total: 0, rows: [], page: 1 },
      [EventFilter.Oportunidades_Recusadas]: { total: 0, rows: [], page: 1 },
      [EventFilter.Oportunidades_Convites]: { total: 0, rows: [], page: 1 }
    };
  }

  public removeEvent(filter: EventFilter, eventId: number) {
    for (let i = 0, _len = this.pagers[filter].rows.length; i < _len; i++) {
      if (this.pagers[filter].rows[i].eventId === eventId) {
        this.pagers[filter].rows.splice(i, 1);
        this.pagers[filter].total--;
        break;
      }
    }
  }

  public moveEvent(source: any, target: any) {
    for (let i = 0, _len = this.pagers[source.filter].rows.length; i < _len; i++) {
      if (this.pagers[source.filter].rows[i].eventId === source.eventId) {
        this.pagers[target.filter].rows.push(this.pagers[source.filter].rows[i]);
        this.pagers[target.filter].total++;
        this.pagers[source.filter].rows.splice(i, 1);
        break;
      }
    }
  }

  public copyEvent(source: any, target: any) {
    for (let i = 0, _len = this.pagers[source.filter].rows.length; i < _len; i++) {
      if (this.pagers[source.filter].rows[i].eventId === source.eventId) {
        this.pagers[target.filter].rows.push(this.pagers[source.filter].rows[i]);
        this.pagers[target.filter].total++;
        break;
      }
    }
  }

  getProfile(): Observable<any> {
    return this.authHttp.get(`${ENV.API_URL}/v1/${this.prefix}/profile`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  setProfile(profile: any): Observable<any> {
    const body = { ...profile };
    body.phone = body.phone.replace(/\D+/g, '');
    body.cellPhone = body.cellPhone.replace(/\D+/g, '');
    body.zipCode = body.zipCode.replace(/\D+/g, '');
    return this.authHttp.put(`${ENV.API_URL}/v1/${this.prefix}/profile`, body)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  getBusinessProfile(): Observable<any> {
    return this.authHttp.get(`${ENV.API_URL}/v1/${this.prefix}/business-profile`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  setBusinessProfile(profile: any): Observable<any> {
    const body = { ...profile };
    body.phone = body.phone.replace(/\D+/g, '');
    body.zipCode = body.zipCode.replace(/\D+/g, '');
    return this.authHttp.put(`${ENV.API_URL}/v1/${this.prefix}/business-profile`, body)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  getResume(): Observable<any> {
    return this.authHttp.get(`${ENV.API_URL}/v1/${this.prefix}/experience`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  setResume(resume: any): Observable<any> {
    return this.authHttp.post(`${ENV.API_URL}/v1/${this.prefix}/experience`, resume)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  getNotificationSettings(): Observable<any> {
    return this.authHttp.get(`${ENV.API_URL}/v1/${this.prefix}/notifications`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  setNotificationSettings(settings: any): Observable<any> {
    return this.authHttp.post(`${ENV.API_URL}/v1/${this.prefix}/notifications`, settings)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  getServices(): Observable<any> {
    return this.authHttp.get(`${ENV.API_URL}/v1/${this.prefix}/services`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  setService(serviceId: number, budget: any): Observable<any> {
    return this.authHttp.post(`${ENV.API_URL}/v2/${this.prefix}/services`, {
      serviceId: serviceId,
      defaultBudgetByEvent: budget
    }).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  deleteService(serviceId: number): Observable<any> {
    return this.authHttp.delete(`${ENV.API_URL}/v1/${this.prefix}/services/${serviceId}`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  getDocuments(): Observable<any> {
    return this.authHttp.get(`${ENV.API_URL}/v1/${this.prefix}/documents`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  deleteDocument(type: string): Observable<any> {
    return this.authHttp.delete(`${ENV.API_URL}/v1/${this.prefix}/documents/${type}`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  getDefaultCompanyAvatar(): string {
    return `${ENV.CDN_URL}/images/companies/avatar/default.png`;
  }

  deleteCompanyAvatar(): Observable<any> {
    return this.authHttp.delete(`${ENV.API_URL}/v1/${this.prefix}/company-avatar`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  isDocumentsPending(documents: any): boolean {
    const cpfPending = !documents.cpf || documents.enumStatusCpf !== 'Approved';
    const rgPending = !documents.rg || documents.enumStatusRg !== 'Approved';
    const cnpjPending = documents.cnpj && documents.enumStatusRg !== 'Approved';
    const driverLicensePending = documents.driverLicense && documents.enumStatusDriverLicense !== 'Approved';

    return cpfPending || rgPending || cnpjPending || driverLicensePending;
  }

  getBillingDetails(): Observable<any> {
    return this.authHttp.get(`${ENV.API_URL}/v2/${this.prefix}/billing`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  setBillingDetails(model: any): Observable<any> {
    return this.authHttp.post(`${ENV.API_URL}/v2/${this.prefix}/billing`, model)
      .catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }


  getCourses(): Observable<any> {
    return this.authHttp.get(`${ENV.API_URL}/v2/${this.prefix}/courses`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  setCourses(model: any): Observable<any> {
    return this.authHttp.post(`${ENV.API_URL}/v2/${this.prefix}/courses`, model)
      .catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  deleteCourses(professionalCourseId: number): Observable<any> {
    return this.authHttp.delete(`${ENV.API_URL}/v2/${this.prefix}/courses/${professionalCourseId}`)
      .catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  getCertificates(): Observable<any> {
    return this.authHttp.get(`${ENV.API_URL}/v2/${this.prefix}/certificates`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  setCertificates(model: any): Observable<any> {
    return this.authHttp.post(`${ENV.API_URL}/v2/${this.prefix}/certificates`, model)
      .catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  deleteCertificates(professionalCertificateId: number): Observable<any> {
    return this.authHttp.delete(`${ENV.API_URL}/v2/${this.prefix}/certificates/${professionalCertificateId}`)
      .catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  getGraduations(): Observable<any> {
    return this.authHttp.get(`${ENV.API_URL}/v2/${this.prefix}/graduations`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

 
}
