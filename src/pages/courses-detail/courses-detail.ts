import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ItemSliding } from 'ionic-angular';
import { PictureProvider, AutoCompleteEducationalInstitutionsProvider, LoadingProvider, MessageProvider, ProfessionalProvider, PICTURE_ACTION, AutoCompleteCourseProvider } from '../../providers/index';

@IonicPage()
@Component({
  selector: 'page-courses-detail',
  templateUrl: 'courses-detail.html',
})
export class CoursesDetailPage {
  private courseDetail_initialized: boolean = false;
  private courseDetail_show: boolean;
  private courseDetail_processLock: Boolean = false;
  private courseDetail_userEducation: any;
  private courseDetail_userEducationList: any[];

  private readonly PICTURE_RESPONSEID_COURSE: string = 'COURSE';
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
      this.lockProcessToogle(false);
      if (result.id === this.PICTURE_RESPONSEID_COURSE) {
        switch (result.action) {
          case PICTURE_ACTION.UPLOADED:
            this.courseDetail_userEducation.degreeImage = result.filename;
            break;
        }
      }}, (err) => {
        this.lockProcessToogle(false);
        console.log(err);
        this.messageProvider.alert('Desculpe, houve uma falha em seu upload, por favor, tente novamente.');
      });

    if (!this.courseDetail_userEducationList || !this.courseDetail_userEducationList.length) {
      this.courseDetail_initialized = true;
    } else {
      this.courseDetail_initialized = false;
    }
  }

  showFooter() {
    this.courseDetail_show = !this.courseDetail_show;
  }

  showDetail(item: any, slidingItem: ItemSliding) {
    if (!this.courseDetail_processLock) {
      this.courseDetail_processLock = true;
      let modal = this.modalCtrl.create('ModalCoursesPage', {
        userEducation: item
      });
      modal.onDidDismiss(() => {
        this.courseDetail_processLock = false;
        slidingItem.close();
      })
      modal.present();
    }
  }

  delete(education, slidingItem: ItemSliding) {
    if (!this.courseDetail_processLock) {
      this.courseDetail_processLock = true;
      let confirmation = this.modalCtrl.create('ConfirmMessagePage', {
        title: 'Deseja realmente excluir?',
        subtitle: "Sua ação confirmará a exclusão desse curso."
      });

      confirmation.onDidDismiss(data => {
        this.courseDetail_processLock = false;
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
    if (!this.courseDetail_processLock) {
      this.lockProcessToogle(true);

      this.professionalProvider.getCourses().subscribe((result) => {
        this.lockProcessToogle(false);
        this.courseDetail_userEducationList = result;

      }, (err) => {

        this.lockProcessToogle(false);
        this.messageProvider.alert(err);

      });
    }
  }

  insert() {
    if (!this.courseDetail_processLock) {
      this.lockProcessToogle(true);
      if (!this.courseDetail_userEducation.courseName) {
        this.courseDetail_userEducation.courseName = this.autoCompleteCourseProvider.blankResult;
      }
      if (!this.courseDetail_userEducation.educationalInstitution) {
        this.courseDetail_userEducation.educationalInstitution = this.autoCompleteEducationalInstitutionsProvider.blankResult;
      }
      this.professionalProvider.setCourses(this.courseDetail_userEducation).subscribe(() => {
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
      this.courseDetail_processLock = true;
      this.loadingProvider.show();
    }
    else {
      this.courseDetail_processLock = false;
      this.loadingProvider.hide();
    }
  }

  uploadDegree() {
    if (!this.courseDetail_processLock) {
      this.lockProcessToogle(true);
      this.pictureProvider.selectPicture(
        this.PICTURE_RESPONSEID_COURSE,
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
    this.courseDetail_userEducation = {
      enumCourseType: "Curso"
    };
    this.courseDetail_show = false;
  }
}
