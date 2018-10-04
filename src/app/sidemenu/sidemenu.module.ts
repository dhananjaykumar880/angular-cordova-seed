import { NgModule, Optional, SkipSelf } from '@angular/core';
// app
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from './components/sidemenu/sidemenu.component';
import { SharedModule } from '../common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

@NgModule({
    imports: [
        SharedModule,
        MatToolbarModule,
        MatListModule
    ],
    exports: [
        SideMenuComponent
    ],
    declarations: [
        SideMenuComponent
    ]
})
export class SideMenuModule {

    constructor(@Optional() @SkipSelf() parentModule: SideMenuModule) {
        if (parentModule) {
            throw new Error('SideMenuModule already loaded; Import in root module only.');
        }
    }
}
