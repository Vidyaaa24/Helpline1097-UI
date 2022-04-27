import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild, Router, ActivatedRoute,
  ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate
} from '@angular/router';
import { dataService } from '../dataService/data.service';
import { Http, Response } from '@angular/http';
import { InterceptedHttp } from './../../http.interceptor';
import { ConfigService } from '../config/config.service';
import { AuthService } from './../../services/authentication/auth.service';
import 'rxjs/add/operator/toPromise'
import { SetLanguageComponent } from 'app/set-language.component';
import { HttpServices } from '../http-services/http_services.service';
@Injectable()
export class AuthGuard implements CanActivate {
  _baseURL = this._config.getCommonBaseURL();
  _authorisedUser = this._baseURL + 'user/getLoginResponse';
  _deleteToken = this._baseURL + 'user/userLogout';
  currentLanguageSet: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute, public dataSettingService: dataService, private _http: InterceptedHttp
    , private _config: ConfigService, private authService: AuthService,public httpServices:HttpServices) { }

    ngOnInit() {
      this.assignSelectedLanguage();
    }
  
    ngDoCheck() {
			this.assignSelectedLanguage();
		  }

		assignSelectedLanguage() {
			const getLanguageJson = new SetLanguageComponent(this.httpServices);
			getLanguageJson.setLanguage();
			this.currentLanguageSet = getLanguageJson.currentLanguageObject;
		 
		 }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const key = sessionStorage.getItem('isOnCall');
    const authkey = sessionStorage.getItem('authToken');

    // if (authkey) {
    //   this._http.post(this._authorisedUser, {})
    //     .toPromise()
    //     .then(response => {
    //       if (response) {
    // debugger;
    //         this.dataSettingService.Userdata = response.json().data;
    //         // this.dataSettingService.userPriveliges = response.Previlege;
    //         this.dataSettingService.userPriveliges = response.json().data.previlegeObj;
    //         this.dataSettingService.uid = response.json().data.userID;
    //         this.dataSettingService.uname = response.json().data.userID;
    //         this.dataSettingService.Userdata.agentID = response.json().data.agentID;
    //         this.dataSettingService.loginIP = response.json().data.loginIPAddress;
    //       }
    //       return true;
    //     }).catch(response => {
    //       this._http.post(this._deleteToken, {})
    //         .toPromise()
    //         .then(res => {
    //           this.authService.removeToken();
    //           this.router.navigate(['']);
    //         });
    //       return false;
    //     });
    // }
    if (authkey) {

      if (key === 'yes') {
        alert(this.currentLanguageSet.NotAllowedToGoBackPleaseComplete);
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }

  }

}

