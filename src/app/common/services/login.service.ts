import { Injectable, Inject, NgZone } from '@angular/core';
import { Config, Store } from '../utils/index';
import { ICON_REGISTRY_PROVIDER } from '@angular/material/icon';
import { Router } from '@angular/router';

declare let SafariViewController;

@Injectable()
export class LoginService {
    constructor(
        private store: Store,
        private router: Router,
        private zone: NgZone,
        @Inject("WINDOW") private window: any
    ) {
        let me = this;
        this.zone.runOutsideAngular(() => {
            window.handleOpenURL = function (url) {
                url = new URL(url);
                setTimeout(function () {
                    SafariViewController.hide();
                    me.zone.run(() => {
                        router.navigate([url.pathname], { queryParams: me.getParams(url.search + "&temp=" + Math.floor((Math.random() * 100) + 1)) });
                    })
                }, 0);
            }
        })
    }

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

    doLogin(returnUrl: string = "/home") {
        let me = this,
            url = Config.AUTHORIZE_URL;

        if (typeof SafariViewController !== "undefined") {
            SafariViewController.show({
                url: url,
                animated: true,
                transition: 'curl', // (this only works in iOS 9.1/9.2 and lower) unless animated is false you can choose from: curl, flip, fade, slide (default)
                enterReaderModeIfAvailable: true,
                barColor: "#071d49", // iOs status bar color, on iOS 10+ you can change the background color as well
                toolbarColor: '#071d49' // Android toolbar color
            },
                // this success handler will be invoked for the lifecycle events 'opened', 'loaded' and 'closed'
                function (result) {
                    if (result.event === 'opened') {
                        console.log('opened');
                    } else if (result.event === 'loaded') {
                        console.log('loaded');
                    } else if (result.event === 'closed') {
                        me.zone.run(() => {
                            me.router.navigate(['/login', Math.floor((Math.random() * 10) + 1)]);
                        })
                    }
                },
                function (msg) {
                    console.log("KO: " + msg);
                })
        } else {
            this.window.location.href = url;
        }
    }
}