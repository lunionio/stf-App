import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-modal-certifications',
  templateUrl: 'modal-certifications.html',
})
export class ModalCertificationsPage {

  
  show: Boolean;
  titleBtn: any;
  userEducation: any; 
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewController: ViewController, 
    private inAppBrowser: InAppBrowser 
  ) {

    this.show = true;
    this.titleBtn = "Ver Imagem do Certificado";
    this.userEducation = this.navParams.get('userEducation');
  }

  ionViewDidLoad() { }

  dismiss() {
    this.viewController.dismiss();
  }

  showImageCertificado() {
    this.show = !this.show;

    if(this.show){
      this.titleBtn = "Ver Imagem do Certificado";
    }else{
      this.titleBtn = "Ver informações";
    }
  }

  linkTap(link: string){
    const browser = this.inAppBrowser.create(link);
    browser.show();
  }
  
}
