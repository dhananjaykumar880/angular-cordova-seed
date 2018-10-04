import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SERVICE_PROVIDERS, CustomHttpInterceptor, HttpDataService, Store } from './common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideMenuModule } from './sidemenu/sidemenu.module';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(<any>http, 'assets/i18n/', '.json');
}

export function getWindow() {
  return (typeof window !== "undefined") ? window : null;
}

export function createPreloader(httpData: HttpDataService, store: Store) {
  return () => {
    return new Promise((resolve, reject) => {
      /* httpData.getUserData().subscribe(res => {
        store.set("userData", res, true);
        resolve();
      }, error => {
        reject();
      }); */
      resolve();
    });
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    SideMenuModule,
    FlexLayoutModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    ...SERVICE_PROVIDERS,
    { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: createPreloader, deps: [HttpDataService, Store], multi: true },
    { provide: 'WINDOW', useFactory: (getWindow) }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
