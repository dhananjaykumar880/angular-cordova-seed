import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '../utils';
import { LoginService } from './login.service';

/**
 * AuthGaurd service
 * This service check for user login and do actions based on authentication
 */
@Injectable()
export class AuthGuard implements CanActivate {

    /**
     * Constructor with service injection
     * @param store 
     * @param loginService 
     */
    constructor(
        private store: Store,
        private loginService: LoginService
    ) { }

    /**
     * user will be allowed for current navigation
     * or will be redirected to login page
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log("AuthGaurd: checking for authentication...");
        if (this.store.get("authenticated", false)) {
            console.log("AuthGaurd: authenticated");
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return 
        this.loginService.doLogin();
        return false;
    }
}
