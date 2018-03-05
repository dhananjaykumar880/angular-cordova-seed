import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '../utils';
import { LoginService } from './login.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private store: Store,
        private loginService: LoginService,
        @Inject("WINDOW") private window: any
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log("AuthGaurd: checking for authentication...");
        if (this.store.get("authenticated", false)) {
            console.log("AuthGaurd: authenticated");
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return 
        this.loginService.doLogin(this.window.location.origin + state.url);
        return false;
    }
}