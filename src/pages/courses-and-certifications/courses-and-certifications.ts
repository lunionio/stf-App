import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Tabs } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-courses-and-certifications',
  templateUrl: 'courses-and-certifications.html',
})
export class CoursesAndCertificationsPage {


  @ViewChild('myTabs') tabRef: Tabs;

  cursosParams: any;
  certificadoParams: any;
  graduacaoParams: any;

  cursos = 'CoursesDetailPage';
  certificados = 'CertificationsDetailPage';
  graduacao = 'AcademicEducationPage';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private menuCtrl: MenuController) 
  {
    this.graduacaoParams = { tab: 0, page: 'graduacao' };
    this.cursosParams = { tab: 1, page: 'cursos' };
    this.certificadoParams = { tab: 2, page: 'certificados'};
  }


  ionViewDidLoad() { }

}
