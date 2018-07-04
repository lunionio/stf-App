import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook";
import "rxjs/add/operator/map";

@Injectable()
export class FacebookProvider {
  constructor(private fb: Facebook, public http: Http) {}

  getAccessToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fb
        .getLoginStatus()
        .then(loginStatus => {
          console.log(loginStatus);
          if (loginStatus.status === "connected") {
            this.fb
              .logout()
              .then(() => {
                this.fbToken()
                  .then(fbToken => resolve(fbToken))
                  .catch(err => reject(err));
              })
              .catch(err => reject(err));
          } else {
            this.fbToken()
              .then(fbToken => resolve(fbToken))
              .catch(err => reject(err));
          }
        })
        .catch(err => reject(err));
    });
  }

  fbToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fb
        .login(["public_profile", "email", "user_birthday"])
        .then((res: FacebookLoginResponse) => {
          resolve(res.authResponse.accessToken);
        })
        .catch(err => reject(err));
    });
  }
}
