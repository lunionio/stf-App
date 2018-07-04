import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/map';

import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';

import { ENV } from '../../config/environment.production';

import {
  ActionSheetController,
  Platform,
  ToastController
} from 'ionic-angular';

import { File } from '@ionic-native/file';
import { FileUploadOptions, Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { MessageProvider, LoadingProvider } from '../../providers/index';
import { LocalStorage } from '../../utils/storage';

export enum PICTURE_ACTION {
  DELETED,
  UPLOADED,
  CANCELED,
  ERROR
}

@Injectable()
export class PictureProvider {
  public lastImage: string;
  private cameraOptions: CameraOptions;
  private endpoint: string;
  private params: any = {};
  public selectPictureObservable: Observable<any>;
  public selectPictureObserver: any;
  private id: string;
  private options: any = {};

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private messageProvider: MessageProvider,
    private authHttp: AuthHttp,
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    private imageResizer: ImageResizer,
    private loadingProvider: LoadingProvider,
    private platform: Platform,
    private storage: LocalStorage,
    private transfer: Transfer,
    private toastCtrl: ToastController) {
    this.selectPictureObservable = Observable.create((observer) => {
      this.selectPictureObserver = observer;
    });
  }

  public selectPicture(id: string, endpoint: string, cameraOptions?: CameraOptions, params?: any, options?: any) {
    this.id = id;
    this.endpoint = endpoint;
    this.cameraOptions = cameraOptions;
    this.params = params || {};
    this.options = Object.assign({}, options || {});

    if (params && params.cameraOnly) {
      this.takePicture(this.camera.PictureSourceType.CAMERA);
    } else {
      let buttons = [
        {
          icon: 'camera',
          text: 'Tirar Foto',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          icon: 'images',
          text: 'Da Galeria',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          icon: 'close',
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.selectPictureObserver.next({ id: this.id, action: PICTURE_ACTION.CANCELED });
          }
        }
      ];

      if (!this.options.hideDeleteOption) {
        buttons.unshift({
          icon: 'trash',
          text: 'Remover Atual',
          role: 'destructive',
          handler: () => {
            this.messageProvider.confirm('Deseja realmente remover a imagem atual?')
              .then((answer) => {
                if (answer) {
                  this.selectPictureObserver.next({ id: this.id, action: PICTURE_ACTION.DELETED });
                }
              });
          }
        });
      }

      this.actionSheetCtrl.create({
        title: 'Selecionr Imagem',
        buttons: buttons
      }).present();
    }

    return this.selectPictureObserver;
  }

  public onSelectPicture(): Observable<any> {
    return this.selectPictureObservable;
  }

  private takePicture(sourceType) {
    // Create options for the Camera Dialog
    const cameraOptions: CameraOptions = {
      quality: 100,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    if (this.platform.is('ios')) {
      cameraOptions.destinationType = this.camera.DestinationType.FILE_URI;
    }

    if (this.cameraOptions) {
      Object.assign(cameraOptions, this.cameraOptions);
    }

    // Get the data of an image
    this.loadingProvider.show();
    this.camera.getPicture(cameraOptions).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android')) {
        if (sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          this.filePath.resolveNativePath(imagePath)
            .then(filePath => {
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            });
        } else {
          var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        }
      } else {
        const currentName = imagePath.replace(/^.*[\\\/]/, '');
        const now = Date.now();
        const newFileName = `${now}.jpg`;
        const namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

        this.file
          .moveFile(
          namePath,
          currentName,
          this.file.dataDirectory,
          newFileName
          )
          .then(res => {
            const filepath = this.pathForImage(newFileName);
            this.lastImage = newFileName;

            if (this.endpoint) {
              return this.uploadImage();
            }

            this.loadingProvider.hide();
            this.selectPictureObserver.next({
              id: this.id,
              action: PICTURE_ACTION.UPLOADED,
              filename: newFileName,
              filepath,
            });
          }).catch(err => this.handleUploadError(err));
      }
    }, (err) => {
      if (err.indexOf('cancelled') > -1) {
        this.loadingProvider.hide();
        this.selectPictureObserver.next({ id: this.id, action: PICTURE_ACTION.CANCELED });
      } else {
        this.handleUploadError(err);
      }
    });
  }

  public uploadImage() {
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;

    this.params.fileName = filename;

    this.storage.getToken().then((token) => {
      const fileUploadOptions: FileUploadOptions = {
        fileKey: this.options.fileKey || 'file',
        fileName: filename,
        chunkedMode: false,
        //mimeType: "multipart/form-data",
        params: this.params,
        headers: {
          'Accept': 'application/json; odata=verbose',
          'Authorization': `Bearer ${token}`
        }
      };

      const fileTransfer: TransferObject = this.transfer.create();

      // Use the FileTransfer to upload the image
      fileTransfer.upload(targetPath, `${ENV.API_URL}/${this.endpoint}`, fileUploadOptions).then(data => {
        this.loadingProvider.hide();
        let filename = '';
        if (data.response)
          filename = JSON.parse(data.response);
        this.selectPictureObserver.next({ id: this.id, action: PICTURE_ACTION.UPLOADED, filename: filename });
      }).catch((err) => this.handleUploadError(err));
    }).catch((err) => this.handleUploadError(err));
  }

  // Create a new name for the image
  private createFileName() {
    return `${(new Date()).getTime()}.jpg`;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    if (this.options.width && this.options.height) {
      let imageResizerOptions: ImageResizerOptions = {
        uri: `${namePath}${currentName}`,
        folderName: this.file.dataDirectory,
        fileName: newFileName,
        width: this.options.width,
        height: this.options.height,
        quality: 100
      };
      this.imageResizer.resize(imageResizerOptions)
        .then((filePath) => {
          this.lastImage = newFileName;
          this.uploadImage();
        }).catch(error => this.handleUploadError(error));
    } else {
      this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName)
        .then(success => {
          this.lastImage = newFileName;
          this.uploadImage();
        })
        .catch(error => this.handleUploadError(error));
    }
  }

  // Always get the accurate path to your apps folder
  private pathForImage(img) {
    if (img) {
      return `${this.file.dataDirectory}${img}`;
    }
    return '';
  }

  private presentToast(text) {
    this.toastCtrl
      .create({
        message: text,
        duration: 3000,
        position: 'top'
      })
      .present();
  }

  private handleUploadError(err) {
    console.log(err);
    this.loadingProvider.hide();
    this.presentToast('Desculpe, houve uma falha. Por favor, tente novamente.');
    this.selectPictureObserver.next({ id: this.id, action: PICTURE_ACTION.ERROR });
  }

}
