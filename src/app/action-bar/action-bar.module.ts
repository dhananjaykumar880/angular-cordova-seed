import { NgModule, Optional, SkipSelf, NO_ERRORS_SCHEMA } from '@angular/core';
// app
import { RouterModule } from '@angular/router';
import { SharedModule } from '../common';
import { ActionBarRoutes } from './action-bar.routes';
import { ActionBarComponent } from './components/action-bar/action-bar.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    imports: [
        RouterModule.forChild(<any>ActionBarRoutes),
        MatToolbarModule,
        SharedModule
    ],
    exports: [
        ActionBarComponent
    ],
    declarations: [
        ActionBarComponent
    ]
})
export class ActionBarModule {

    constructor( @Optional() @SkipSelf() parentModule: ActionBarModule) {
        if (parentModule) {
            throw new Error('ActionBarModule already loaded; Import in root module only.');
        }
    }
}
