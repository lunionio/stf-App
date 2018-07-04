import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { LoadingController, Loading } from 'ionic-angular';

import 'rxjs/add/operator/map';

@Injectable()
export class LoadingProvider {
  loading: Loading;

  constructor(public http: Http, private loadingCtrl: LoadingController) {
  }

  show() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `
        <div class="staffpro-spinner-container">
          <div class="staffpro-spinner-box">
            <img src="assets/img/loading-bars.svg" />
            <p>Carregando...</p>
          </div>
        </div>`
      });
      this.loading.present();
    }
  }

  hide() {
    return new Promise((resolve) => {
      try {
        if (!this.loading) return resolve();
        this.loading.dismiss().then(() => {
          resolve();
        });
        this.loading = null;
      } catch (e) {
        this.loading = null;
        resolve();
      }
    });
  }
}
