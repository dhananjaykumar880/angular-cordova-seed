import { NgModule, Optional, SkipSelf, NO_ERRORS_SCHEMA } from '@angular/core';
// app
import { RouterModule } from '@angular/router';
import { HomeRoutes } from './home.routes';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../common';
import { ActionBarModule } from '../action-bar/action-bar.module';

@NgModule({
    imports: [
        RouterModule.forChild(<any>HomeRoutes),
        SharedModule,
        ActionBarModule
    ],
    exports: [
        HomeComponent
    ],
    declarations: [
        HomeComponent
    ]
})
export class HomeModule {

    constructor( @Optional() @SkipSelf() parentModule: HomeModule) {
        if (parentModule) {
            throw new Error('HomeModule already loaded; Import in root module only.');
        }
    }
}
