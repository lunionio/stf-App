import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ItemSliding } from 'ionic-angular';
import { PictureProvider, AutoCompleteEducationalInstitutionsProvider, AutoCompleteCertificatesProvider, LoadingProvider, MessageProvider, ProfessionalProvider, PICTURE_ACTION } from '../../providers/index';

@IonicPage()
@Component({
  selector: 'page-certifications-detail',
  templateUrl: 'certifications-detail.html',
})
export class CertificationsDetailPage {
  private certification_initialized: boolean = false;
  private certification_show: boolean;
  private certification_processLock: Boolean = false;
  private certification_userEducation: any;
  private certification_userEducationList: any[];

  private readonly PICTURE_RESPONSEID_CERTIFICATE: string = 'CERTIFICATE';
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private pictureProvider: PictureProvider,
    private modalCtrl: ModalController,
    private loadingProvider: LoadingProvider,
    private messageProvider: MessageProvider,
    private professionalProvider: ProfessionalProvider,
    private autoCompleteEducationalInstitutionsProvider: AutoCompleteEducationalInstitutionsProvider,
    private autoCompleteCertificatesProvider: AutoCompleteCertificatesProvider
  ) {
    this.clear();
    this.loadData();
  }

  ionViewDidLoad() {
    this.pictureProvider.onSelectPicture().subscribe((result) => {
      this.lockProcessToogle(false);
      if (result.id === this.PICTURE_RESPONSEID_CERTIFICATE) {
        switch (result.action) {
          case PICTURE_ACTION.UPLOADED:
            this.certification_userEducation.degreeImage = result.filename;
            break;
        }
      }}, (err) => {
        this.lockProcessToogle(false);
        console.log(err);
        this.messageProvider.alert('Desculpe, houve uma falha em seu upload, por favor, tente novamente.');
      });

    if (!this.certification_userEducationList || !this.certification_userEducationList.length) {
      this.certification_initialized = true;
    } else {
      this.certification_initialized = false;
    }
  }

  showFooter() {
    this.certification_show = !this.certification_show;
  }

  showDetail(item: any, slidingItem: ItemSliding) {
    if (!this.certification_processLock) {
      this.certification_processLock = true;
      let modal = this.modalCtrl.create('ModalCertificationsPage', {
        userEducation: item
      });
      modal.onDidDismiss(() => {
        this.certification_processLock = false;
        slidingItem.close();
      })
      modal.present();
    }
  }

  delete(education, slidingItem: ItemSliding) {
    if (!this.certification_processLock) {
      this.certification_processLock = true;
      let confirmation = this.modalCtrl.create('ConfirmMessagePage', {
        title: 'Deseja realmente excluir?',
        subtitle: "Sua ação confirmará a exclusão desse certificado."
      });

      confirmation.onDidDismiss(data => {
        this.certification_processLock = false;
        if (data) {
          this.lockProcessToogle(true);
          this.professionalProvider.deleteCertificates(education.professionalCertificateId)
            .subscribe(() => {
              this.lockProcessToogle(false);
              this.loadData();
            },
              (err) => {
                this.lockProcessToogle(false);
                this.messageProvider.alert(err);
              });
        }
        slidingItem.close();
      });

      confirmation.present();
    }
  }

  loadData() {
    if (!this.certification_processLock) {
      this.lockProcessToogle(true);

      this.professionalProvider.getCertificates().subscribe((result) => {
        this.lockProcessToogle(false);
        this.certification_userEducationList = result;

      }, (err) => {

        this.lockProcessToogle(false);
        this.messageProvider.alert(err);

      });
    }
  }

  insert() {
    if (!this.certification_processLock) {
      this.lockProcessToogle(true);
      if (!this.certification_userEducation.certificateName) {
        this.certification_userEducation.certificateName = this.autoCompleteCertificatesProvider.blankResult;
      }
      if (!this.certification_userEducation.educationalInstitution) {
        this.certification_userEducation.educationalInstitution = this.autoCompleteEducationalInstitutionsProvider.blankResult;
      }
      this.professionalProvider.setCertificates(this.certification_userEducation).subscribe(() => {
        this.lockProcessToogle(false);
        this.clear();
        this.loadData();
      },
        (err) => {
          this.lockProcessToogle(false);
          this.messageProvider.alert(err);
        }
      );
    }
  }

  lockProcessToogle(lock: Boolean) {
    if (lock) {
      this.certification_processLock = true;
      this.loadingProvider.show();
    }
    else {
      this.certification_processLock = false;
      this.loadingProvider.hide();
    }
  }

  uploadDegree() {
    if (!this.certification_processLock) {
      this.lockProcessToogle(true);
      this.pictureProvider.selectPicture(
        this.PICTURE_RESPONSEID_CERTIFICATE,
        `v1/upload/professionals/degree`,
        {
          targetWidth: 184,
          targetHeight: 184,
          allowEdit: true
        },
        null,
        {
          width: 184,
          height: 184,
          hideDeleteOption: true,
        }
      );
    }
  }

  clear() {
    this.certification_userEducation = {};
    this.certification_show = false;
  }
}
