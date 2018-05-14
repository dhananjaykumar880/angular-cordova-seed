import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store, Config } from '../utils/index';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

/**
 * GetToken Service
 * get token form token url after user login
 */
@Injectable()
export class GetToken implements CanActivate {

    /**
     * Constructor with service injection
     * @param store 
     * @param router 
     * @param http 
     */
    constructor(
        private store: Store,
        private router: Router,
        private http: HttpClient
    ) { }

    /**
     * return header with authorization
     */
    private createRequestHeader() {
        let headers = new HttpHeaders({});
        headers = headers.append("Authorization", 'Basic ' + btoa(Config.API.OAUTH_CLIENTID + ':' + Config.API.OAUTH_SECRET));
        headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return headers;
    }

    /**
     * get token when code is available
     * @param route 
     * @param state 
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (route.queryParams.code) {
            Config.CODE = route.queryParams.code;
            this.http.post(
                Config.TOKEN_URL,
                Config.TOKEN_BODY,
                {
                    headers: this.createRequestHeader()
                })
                .subscribe((res: any) => {
                    this.store.set('token', res);
                    this.store.set('authenticated', true);
                    this.router.navigate(['/home', Math.floor((Math.random() * 10) + 1)]);
                }, error => {
                    this.router.navigate(['/login', 'error']);
                });
            return false;
        }
        return true;
    }
}
