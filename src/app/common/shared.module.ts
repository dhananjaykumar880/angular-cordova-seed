import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SafeHTML, SafeURL, SafeResourceURL } from './pipes/index';

const pipes = [
    SafeHTML,
    SafeURL,
    SafeResourceURL
]

@NgModule({
    imports: [CommonModule],
    declarations: [
        ...pipes
    ],
    exports: [
        CommonModule,
        FormsModule,
        RouterModule,
        TranslateModule,
        MatCardModule,
        FlexLayoutModule,
        MatIconModule,
        MatButtonModule,
        ...pipes
    ]
})
export class SharedModule { };