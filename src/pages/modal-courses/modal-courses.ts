import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-courses',
  templateUrl: 'modal-courses.html',
})
export class ModalCoursesPage {

  show: Boolean;
  titleBtn: any;
  userEducation: any; 

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewController: ViewController
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
}
