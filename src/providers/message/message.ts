import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class MessageProvider {

  constructor(public alertCtrl: AlertController) { }

  public alert(message: string) {
    return new Promise((resolve) => {
      const modal = this.alertCtrl.create({
        subTitle: message,
        buttons: ['Ok']
      });
      modal.onDidDismiss(() => resolve());
      modal.present();
    });
  }

  public confirm(message: string) {
    return new Promise((resolve) => {
      const modal = this.alertCtrl.create({
        subTitle: message,
        buttons: [
          { text: 'Não', role: 'cancel' },
          { text: 'Sim', handler: () => resolve(true) }
        ]
      });
      modal.onDidDismiss(() => resolve());
      modal.present();
    });
  }

}
