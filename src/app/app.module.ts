import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { MyApp } from './app.component';

import { IonicStorageModule } from '@ionic/storage';
import { RatingComponentModule } from '../components/rating/rating.module';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { TextMaskModule } from 'angular2-text-mask';
import { IonicImageLoader } from 'ionic-image-loader';

import { LoginService } from '../pages/login/login.service';

import { AppVersion } from '@ionic-native/app-version';
import { Camera } from '@ionic-native/camera';
import { Facebook } from '@ionic-native/facebook';
import { FCM } from '@ionic-native/fcm'
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Geolocation } from '@ionic-native/geolocation';
import { ImageResizer } from '@ionic-native/image-resizer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Transfer } from '@ionic-native/transfer';

import { LazyLoadImageModule } from 'ng-lazyload-image';

import { CustomTabIndexDirective } from '../directives/custom-tab-index/custom-tab-index';

import { Account } from '../utils/account';
import { LocalStorage } from '../utils/storage';
import { Masks } from '../utils/masks';

import { AuthProvider } from '../providers/auth/auth';
import { LocationProvider } from '../providers/location/location';
import { LoadingProvider } from '../providers/loading/loading';
import { ServiceGroupProvider } from '../providers/service-group/service-group';
import { StateProvider } from '../providers/state/state';
import { SystemProvider } from '../providers/system/system';
import { UserProvider } from '../providers/user/user';
import { ProfessionalProvider } from '../providers/professional/professional';
import { EventProvider } from '../providers/event/event';
import { ContractProvider } from '../providers/contract/contract';
import { PictureProvider } from '../providers/picture/picture';
import { MessageProvider } from '../providers/message/message';
import { FacebookProvider } from '../providers/facebook/facebook';
import { SpecialContractProvider } from '../providers/special-contract/special-contract';
import { SideMenuProvider } from '../providers/side-menu/side-menu';
import { Diagnostic } from '@ionic-native/diagnostic';
import { CustomCurrencyPipe } from '../pipes/custom-currency/custom-currency';

import { AutoCompleteModule } from 'ionic2-auto-complete';
import { ListingsProvider } from '../providers/listings/listings';
import { AutoCompleteEducationalInstitutionsProvider } from '../providers/auto-complete-educational-institutions/auto-complete-educational-institutions';
import { AutoCompleteCourseProvider } from '../providers/auto-complete-course/auto-complete-course';
import { AutoCompleteCertificatesProvider } from '../providers/auto-complete-certificates/auto-complete-certificates';
export function getAuthHttp(http: Http, storage: LocalStorage) {
  return new AuthHttp(new AuthConfig({
    headerPrefix: 'Bearer',
    noJwtError: true,
    globalHeaders: [{ 'Accept': 'application/json' }],
    tokenGetter: (() => storage.getToken()),
  }), http);
}

@NgModule({
  declarations: [
    MyApp,
    CustomTabIndexDirective,
    CustomCurrencyPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      statusbarPadding: false,
      monthNames: ['janeiro', 'fevereiro', 'mar\u00e7o', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
      monthShortNames: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
      dayNames: ['domingo', 'segunda-feira', 'ter\u00e7a-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sabado'],
      dayShortNames: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
    }),
    IonicStorageModule.forRoot({
      name: 'STAFFPRO',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    FormsModule,
    LazyLoadImageModule,
    RatingComponentModule,
    IonicImageLoader.forRoot(),
    TextMaskModule,
    AutoCompleteModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Account,
    AppVersion,
    Camera,
    CustomCurrencyPipe,
    Facebook,
    FCM,
    File,
    FilePath,
    Geolocation,
    Masks,
    ImageResizer,
    InAppBrowser,
    StatusBar,
    SplashScreen,
    Transfer,
    Diagnostic,

    LoginService,

    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: LOCALE_ID, useValue: "pt-BR" },

    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http, LocalStorage]
    },

    AuthProvider,
    LoadingProvider,
    LocationProvider,
    LocalStorage,
    ServiceGroupProvider,
    StateProvider,
    SystemProvider,
    UserProvider,
    ProfessionalProvider,
    EventProvider,
    ContractProvider,
    PictureProvider,
    MessageProvider,
    FacebookProvider,
    SpecialContractProvider,
    SideMenuProvider,
    SideMenuProvider,
    ListingsProvider,
    AutoCompleteEducationalInstitutionsProvider,
    AutoCompleteCourseProvider,
    AutoCompleteCertificatesProvider,
  ]
})
export class AppModule { }
