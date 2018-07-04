This is a starter template for [Ionic](http://ionicframework.com/docs/) projects.

## How to use this template

*This template does not work on its own*. The shared files for each starter are found in the [ionic2-app-base repo](https://github.com/driftyco/ionic2-app-base).

To use this template, either create a new ionic project using the ionic node.js utility, or copy the files from this repository into the [Starter App Base](https://github.com/driftyco/ionic2-app-base).

### With the Ionic CLI:

Take the name after `ionic2-starter-`, and that is the name of the template to be used when using the `ionic start` command below:

```bash
$ sudo npm install -g ionic cordova
$ ionic start mySideMenu sidemenu
```

Then, to run it, cd into `mySideMenu` and run:

```bash
$ ionic cordova platform add ios
$ ionic cordova run ios
```

Substitute ios for android if not on a Mac.

## Publicação
[https://ionicframework.com/docs/guide/publishing.html](https://ionicframework.com/docs/guide/publishing.html)

### Geração da chave de3 publicação
```
keytool -genkey -v -keystore android-release-key.keystore -alias staffpro -keyalg RSA -keysize 2048 -validity 10000
```

### Geração da chave do Facebook
```
keytool -exportcert -alias staffpro -keystore android-release-key.keystore | openssl sha1 -binary | openssl base64
```

PS. A chave já está na raiz do projeto 'android-release-key.keystore' alias 'staffpro' senha 'staffpro1209'
PS. É necessário configurar o java e o java-tools na variavel PATH para o comando jarsigner funcionar
PS. É necessario configurar o local do sdk do android na variavel ANDROID_HOME para o comando zipalign funcionar (Observar que a versão pode ser diferente de 25.0.3)
PS. Observe o caminho da aplicacao no exemplo abaixo de acordo a sua instalação local: /d/projects/cordova/asteria/

### Android

PS. $ANDROID_BUILD_TOOLS é uma variável de sistema para $ANDROID_HOME/build-tools/25.0.3 (versão pode variar)

PS. $PROJECT_HOME correponde ao diretório raiz do app na sua máquina (EX: /d/projects/cordova/asteria/ricardo-dias-app-staff-pro)
```
$ rm -f staffpro.apk

$ ionic cordova build --release --prod android

$ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore android-release-key.keystore "$PROJECT_HOME/platforms/android/build/outputs/apk/release/android-release-unsigned.apk" staffpro

$ $ANDROID_BUILD_TOOLS/zipalign -v 4 "$PROJECT_HOME/platforms/android/build/outputs/apk/release/android-release-unsigned.apk" staffpro.apk

```

### Em linha
```
$ rm -f staffpro.apk && ionic cordova build --release --prod android && jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore android-release-key.keystore "$PROJECT_HOME/platforms/android/build/outputs/apk/release/android-release-unsigned.apk" staffpro && $ANDROID_BUILD_TOOLS/zipalign -v 4 "$PROJECT_HOME/platforms/android/build/outputs/apk/release/android-release-unsigned.apk" staffpro.apk
```

### Workarounds
- No iOS antes de rodar o comando "build" sera necessario adicionar a plataforma android