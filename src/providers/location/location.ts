import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ENV } from '../../config/environment.production';

import { CepResult } from '../../models/cep-result';
import { Geolocation, GeolocationOptions, Geoposition } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';

@Injectable()
export class LocationProvider {

  geolocationOptions: GeolocationOptions = {
    enableHighAccuracy: false,
    timeout: Infinity,
    maximumAge: 600000 // 10 minutes in miliseconds
  };

  constructor(
    public http: Http,
    private geolocation: Geolocation,
    private diagnostic: Diagnostic
  ) { }

  cep(zipCode: string): Observable<CepResult> {
    return this.http.get(`${ENV.API_URL}/v1/location/${zipCode}`)
      .map(res => res.json()).catch((errorRes: Response) => Observable.throw(errorRes.json()));
  }

  currentLocation(): Promise<Geoposition> {
    return new Promise((resolve, reject) => {
      this.diagnostic.isLocationEnabled().then((enabled) => {
        if (enabled) {
          this.geolocation.getCurrentPosition().then((geoPosition) => {
            resolve(geoPosition);
          }).catch((error) => {
            console.log(error);
            reject(this.currentLocationError());
          });
        }
        else {
          reject('Por favor, habilite as configurações de localização do seu device e tente novamente!');
        }
      }).catch((error) => {
        console.log(error);
        reject(this.currentLocationError());
      });
    });
  }

  private currentLocationError(): string {
    return 'Desculpe, houve uma falha ao tentar acessar a localização do seu device. Por favor, tente novamente.';
  }
}
