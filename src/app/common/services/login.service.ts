import { Injectable, Inject, NgZone } from '@angular/core';
import { Config, Store } from '../utils/index';
import { Router } from '@angular/router';

declare let SFAuthSession;
declare let device;

/**
 * LoginService
 * used for open login page and redirect to token after login
 */
@Injectable()
export class LoginService {

    /**
     * Constructor with service injection
     * @param store 
     * @param router 
     * @param zone 
     * @param window 
     */
    constructor(
        private store: Store,
        private router: Router,
        private zone: NgZone,
        @Inject("WINDOW") private window: any
    ) { }

    /**
     * get all params from given query
     * @param query is url query params
     */
    private getParams(query) {
        if (!query) {
            return {};
        }

        return (/^[?#]/.test(query) ? query.slice(1) : query)
            .split('&')
            .reduce((params, param) => {
                let [key, value] = param.split('=');
                params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                return params;
            }, {});
    };

    /**
     * open login page for user login
     */
    doLogin() {
        let me = this,
            url = Config.AUTHORIZE_URL;

        if (typeof window['device'] !== 'undefined' && parseInt(device.version) >= 11 && device.platform == "iOS") {
            SFAuthSession.start(Config.MOBILE_ORIGIN, url, data => {
                let url = new URL(data);
                this.zone.run(() => {
                    this.router.navigate([url.pathname], { queryParams: me.getParams(url.search + "&temp=" + Math.floor((Math.random() * 100) + 1)) });
                })
            }, error => {
                this.zone.run(() => {
                    if(!this.store.get("isSyncAvailable", false)) {
                        this.router.navigate(['/login', Math.floor((Math.random() * 10) + 1)]);
                    } else {
                        this.store.set("isSyncAvailable", false);
                        this.router.navigate(['/home']);
                    }
                })
            });
        } else {
            this.window.location.href = url;
        }
    }
}
