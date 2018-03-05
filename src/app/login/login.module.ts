import { NgModule, Optional, SkipSelf, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginRoutes } from './login.routes';
import { SharedModule } from '../common';
import { LoginComponent } from './components/login/login.component';
import { ActionBarModule } from '../action-bar/action-bar.module';

@NgModule({
    imports: [
        RouterModule.forChild(<any>LoginRoutes),
        SharedModule,
        ActionBarModule
    ],
    exports: [
        LoginComponent
    ],
    declarations: [
        LoginComponent
    ]
})
export class LoginModule { 
    constructor( @Optional() @SkipSelf() parentModule: LoginModule) {
        if (parentModule) {
            throw new Error('LoginModule already loaded; Import in root module only.');
        }
    }
}
