import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Camera } from '@ionic-native/camera';
import { CPF, CNPJ } from 'cpf_cnpj';

import { DocumentStatus } from '../../models/document';

import { Masks } from '../../utils/masks';

import { LoadingProvider, MessageProvider, PictureProvider, PICTURE_ACTION, ProfessionalProvider } from '../../providers/index'

@IonicPage()
@Component({
  selector: 'page-documents',
  templateUrl: 'documents.html',
})
export class DocumentsPage {
  documents: any[];

  private readonly PICTURE_RESPONSEID_CNPJ: string = 'Cnpj';
  private readonly PICTURE_RESPONSEID_RG: string = 'Rg';
  private readonly PICTURE_RESPONSEID_CPF: string = 'Cpf';
  private readonly PICTURE_RESPONSEID_DRIVER_LICENSE: string = 'DriverLicense';

  year = (new Date()).getFullYear();
  maxYear = (this.year + 10).toString();
  minYear = (this.year - 5).toString();

  constructor(
    private loadingProvider: LoadingProvider,
    private messageProvider: MessageProvider,
    private camera: Camera,
    public navCtrl: NavController,
    public navParams: NavParams,
    public masks: Masks,
    private pictureProvider: PictureProvider,
    private professionalProvider: ProfessionalProvider) {

    pictureProvider.onSelectPicture().subscribe((result) => {
      if (result.action === PICTURE_ACTION.UPLOADED) {
        if (result.id === this.PICTURE_RESPONSEID_CPF) {
          this.documents[0].status = 'Waiting';
        }
        if (result.id === this.PICTURE_RESPONSEID_RG) {
          this.documents[1].status = 'Waiting';
        }
        if (result.id === this.PICTURE_RESPONSEID_CNPJ) {
          this.documents[2].status = 'Waiting';
        }
        if (result.id === this.PICTURE_RESPONSEID_DRIVER_LICENSE) {
          this.documents[3].status = 'Waiting';
        }
      }
    });
  }

  ionViewDidLoad() {
    this.professionalProvider.getDocuments().subscribe((documents) => {
      this.documents = [
        { label: 'CPF', name: this.PICTURE_RESPONSEID_CPF, value: CPF.format(documents.cpf), status: documents.enumStatusCpf || 'Pending', showDate: false, hasMask: true, mask: this.masks.CPF },
        { label: 'RG', name: this.PICTURE_RESPONSEID_RG, value: documents.rg, status: documents.enumStatusRg || 'Pending', showDate: false, hasMask: false },
        { label: 'CNPJ', name: this.PICTURE_RESPONSEID_CNPJ, value: CNPJ.format(documents.cnpj), status: documents.enumStatusCnpj || 'Pending', showDate: false, hasMask: true, mask: this.masks.CNPJ },
        { label: 'CNH', name: this.PICTURE_RESPONSEID_DRIVER_LICENSE, value: documents.driverLicense, status: documents.enumStatusDriverLicense || 'Pending', showDate: true, hasMask: false, date: documents.driverLicenseExpiration }
      ];
    });
  }

  statusDescription(status: DocumentStatus): string {
    switch (status) {
      case 'Approved': return 'Aprovado';
      case 'Reproved': return 'Reprovado';
      case 'Waiting': return 'Aguardando';
      case 'Pending': return 'Pendente';
      default: return '--';
    }
  }

  selectDocument(doc) {
    if (!doc.value) {
      return this.messageProvider.alert('É necessário preencher o número do documento.');
    }

    else if (doc.name === this.PICTURE_RESPONSEID_CNPJ && !CNPJ.isValid(doc.value)) {
      return this.messageProvider.alert('Código de Cnpj inválido.');
    }

    else if (doc.name === this.PICTURE_RESPONSEID_CPF && !CPF.isValid(doc.value)) {
      return this.messageProvider.alert('Código de Cpf inválido.');
    }

    if (doc.name === this.PICTURE_RESPONSEID_DRIVER_LICENSE && !doc.date) {
      return this.messageProvider.alert('É necessário preencher a data de vencimento do documento.');
    }

    let obj: any = {
      number: doc.value.replace(/[^0-9]/g, ''),
      type: doc.name
    };
    if (doc.date) {
      obj.driverLicenseExpiration = doc.date;
    }
    const query = Object.keys(obj).reduce(function (a, k) {
      a.push(k + '=' + encodeURIComponent(obj[k])); return a
    }, []).join('&');

    this.pictureProvider.selectPicture(
      doc.name,
      `v1/upload/professionals/documents?${query}`,
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

  remove(doc) {
    return this.messageProvider.confirm('Deseja realmente excluir o documento?').then((answer) => {
      if (answer) {
        this.loadingProvider.show();
        this.professionalProvider.deleteDocument(doc.name).subscribe(
          () => {
            this.loadingProvider.hide();
            doc.value = '';
            doc.date = null;
            doc.status = 'Pending';
          },
          (err) => {
            this.loadingProvider.hide().then(() => {
              this.messageProvider.alert(err);
            });
          }
        );
      }
    });
  }

}
