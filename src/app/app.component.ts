import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { ClientDbService, Config, Store, LoadingService, EventHandler } from './common';
import { CookieService } from 'ngx-cookie-service';
import { routeAnimation } from './animations';

declare let cordova;

@Component({
  selector: 'App-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimation]
})
export class AppComponent implements OnInit {
  isLoading: boolean = false;
  isBack: boolean = false;
  constructor(
    translate: TranslateService,
    private dbService: ClientDbService,
    private store: Store,
    private cookie: CookieService,
    private spinner: LoadingService,
    private eventHandler: EventHandler,
    private cd: ChangeDetectorRef,
    @Inject("WINDOW") private window: any
  ) {
    let me = this;
    this.setSettings(Config.DEFAULT_SETTINGS);
    translate.setDefaultLang('en');
    translate.use('en');

    this.spinner.onLoadingChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
      this.cd.detectChanges();
    });
    
    this.eventHandler.on("isBack", isBack => {
      me.isBack = isBack;
      setTimeout(() => {
        me.isBack = false;
      }, 500);
      this.cd.detectChanges();
    });
  }
  
  ngOnInit() {
    document.addEventListener("deviceready", () => {
      Config.PLATFORM_TARGET = Config.PLATFORMS.MOBILE_NATIVE;
      window.open = cordova.InAppBrowser.open;
    }, false);
    
    this.connectToLocalDb();
  }

  connectToLocalDb() {
    this.dbService.init().then(() => {
      console.log("Connected to local db ...");
    });
  }

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }

  setSettings(settings) {
    for (let setting of Object.keys(settings)) {
      if (setting.indexOf('cookie:') !== -1) {
        this.cookie.set(setting.replace("cookie:", ""), settings[setting]);
      } else if (setting.indexOf('force:') !== -1) {
        this.store.set(setting.replace("force:", ""), settings[setting]);
      } else if (!this.store.get(setting, false)) {
        this.store.set(setting, settings[setting]);
      }
    }
  }
}
