import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ItemSliding } from 'ionic-angular';
import { PictureProvider, AutoCompleteEducationalInstitutionsProvider, LoadingProvider, MessageProvider, ProfessionalProvider, PICTURE_ACTION, AutoCompleteCourseProvider } from '../../providers/index';

@IonicPage()
@Component({
  selector: 'page-academic-education',
  templateUrl: 'academic-education.html',
})
export class AcademicEducationPage {
  public academic_initialized: boolean = false;
  public academic_show: boolean;
  public academic_processLock: Boolean = false;
  public academic_userEducation: any;
  public academic_userEducationList: any[];

  private readonly PICTURE_RESPONSEID_ACADEMIC: string = 'ACADEMIC';
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private pictureProvider: PictureProvider,
    private modalCtrl: ModalController,
    private loadingProvider: LoadingProvider,
    private messageProvider: MessageProvider,
    private professionalProvider: ProfessionalProvider,
    private autoCompleteEducationalInstitutionsProvider: AutoCompleteEducationalInstitutionsProvider,
    private autoCompleteCourseProvider: AutoCompleteCourseProvider
  ) {
    this.clear();
    this.loadData();
  }

  ionViewDidLoad() {
    this.pictureProvider.onSelectPicture().subscribe((result) => {
      if (result.id === this.PICTURE_RESPONSEID_ACADEMIC) {
        switch (result.action) {
          case PICTURE_ACTION.UPLOADED:
            this.academic_userEducation.degreeImage = result.filename;
            break;
        }
      }
    }, (err) => {
      this.messageProvider.alert('Desculpe, houve uma falha em seu upload, por favor, tente novamente.');
    });

    if (!this.academic_userEducationList || !this.academic_userEducationList.length) {
      this.academic_initialized = true;
    } else {
      this.academic_initialized = false;
    }
  }

  showFooter() {
    this.academic_show = !this.academic_show;
  }

  showDetail(item: any, slidingItem: ItemSliding) {
    if (!this.academic_processLock) {
      this.academic_processLock = true;
      let modal = this.modalCtrl.create('ModalCoursesPage', {
        userEducation: item
      });
      modal.onDidDismiss(() => {
        this.academic_processLock = false;
        slidingItem.close();
      })
      modal.present();
    }
  }

  delete(education, slidingItem: ItemSliding) {
    if (!this.academic_processLock) {
      this.academic_processLock = true;
      let confirmation = this.modalCtrl.create('ConfirmMessagePage', {
        title: 'Deseja realmente excluir?',
        subtitle: "Sua ação confirmará a exclusão desse curso."
      });

      confirmation.onDidDismiss(data => {
        this.academic_processLock = false;
        if (data) {
          this.lockProcessToogle(true);
          this.professionalProvider.deleteCourses(education.professionalCourseId)
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
    if (!this.academic_processLock) {
      this.lockProcessToogle(true);

      this.professionalProvider.getGraduations().subscribe((result) => {
        this.lockProcessToogle(false);
        this.academic_userEducationList = result;

      }, (err) => {

        this.lockProcessToogle(false);
        this.messageProvider.alert(err);

      });
    }
  }

  insert() {
    if (!this.academic_processLock) {
      this.lockProcessToogle(true);
      if (!this.academic_userEducation.courseName) {
        this.academic_userEducation.courseName = this.autoCompleteCourseProvider.blankResult;
      }
      if (!this.academic_userEducation.educationalInstitution) {
        this.academic_userEducation.educationalInstitution = this.autoCompleteEducationalInstitutionsProvider.blankResult;
      }
      this.professionalProvider.setCourses(this.academic_userEducation).subscribe(() => {
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
      this.academic_processLock = true;
      this.loadingProvider.show();
    }
    else {
      this.academic_processLock = false;
      this.loadingProvider.hide();
    }
  }

  uploadDegree() {
    if (!this.academic_processLock) {
      this.pictureProvider.selectPicture(
        this.PICTURE_RESPONSEID_ACADEMIC,
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
    this.academic_userEducation = {};
    this.academic_show = false;
  }
}
