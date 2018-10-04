import { Component, OnInit, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { ClientDbService, Config, Store, LoadingService, EventHandler } from './common';
import { CookieService } from 'ngx-cookie-service';
import { routeAnimation } from './animations';
import { environment } from '../environments/environment';

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
  @ViewChild('sidenav') sideNav;

  /**
   * Constructor with service injection
   * set default settings and subscribe spinner and back event
   * @param translate 
   * @param dbService 
   * @param store 
   * @param cookie 
   * @param spinner 
   * @param eventHandler 
   * @param cd 
   * @param window 
   */
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
    translate.setDefaultLang('en');
    if (translate.getBrowserLang() !== undefined) {
      translate.use(translate.getBrowserLang());
    } else {
      translate.use('en');
    }

    this.spinner.onLoadingChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
      this.cd.detectChanges();
    });
    
    this.eventHandler.on("isBack", isBack => {
      me.isBack = isBack;
      setTimeout(() => {
        me.isBack = false;
      }, 500);
      me.cd.detectChanges();
    });

    this.eventHandler.on("isSideBar", () => {
      this.sideNav.toggle();
    });
  }
  
  /**
   * check for deviceready and database connection
   */
  ngOnInit() {
    document.addEventListener("deviceready", () => {
      Config.PLATFORM_TARGET = Config.PLATFORMS.MOBILE_NATIVE;
      Config.DEFAULT_SETTINGS = { ...Config.DEFAULT_SETTINGS, ...Config.DEFAULT_SETTINGS_MOBILE };
      window.open = cordova.ThemeableBrowser.open;
      if (environment.production) {
        Config.API = Config.APP_PROD;
      } else {
        Config.API = Config.APP_TEST;
      }
    }, false);
    this.setSettings(Config.DEFAULT_SETTINGS);
    
    this.connectToLocalDb();
  }

  /**
   * initiate database connection
   */
  connectToLocalDb() {
    this.dbService.init().then(() => {
      console.log("Connected to local db ...");
    });
  }

  /**
   * return router animation state
   * @param outlet 
   */
  getState(outlet) {
    return outlet.activatedRouteData.state;
  }

  /**
   * set default settings
   * @param settings 
   */
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
