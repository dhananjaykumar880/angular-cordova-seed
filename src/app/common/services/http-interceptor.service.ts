import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import { Config, Store } from '../../common/utils';
import { LoginService } from './login.service';
import { LoadingService } from './loader.service';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private location: Location,
        private store: Store,
        private loginService: LoginService,
        private spinner: LoadingService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authorization = request.headers.get('Authorization'),
            token = this.store.get("token", false);

        request = request.clone({
            withCredentials: true
        });
        if (!authorization && token) {
            request = request.clone({
                headers: request.headers.set("Authorization", "Bearer " + token.access_token),
            });
        }

        console.log("interceptor started for " + request.url);
        this.spinner.onStarted(request);
        return next.handle(request).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // do stuff with response if needed
                console.log("interceptor finished for " + event.url);
            }
        }, (err: HttpErrorResponse) => {
            console.dir(err);
            if (err.url && err.ok === false) {
                console.log("interceptor error occurred for " + err.url);
                switch (err.status) {
                    case 401:
                    case 403:
                        // not logged in so redirect to login page with the return url
                        this.store.set("authenticated", false);
                        this.location.replaceState("/");
                        this.loginService.doLogin();
                        break;
                    case 500:
                        this.router.navigate(['/login'], { queryParams: err.error });
                        break;
                }
            }
        }).finally(() => {
            this.spinner.onFinished(request);
        });
    }
}