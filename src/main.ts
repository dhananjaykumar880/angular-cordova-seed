import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { Config } from './app/common';
import 'hammerjs';

interface Navigator {
  splashscreen: {
    hide: () => any
  }
}
declare let navigator: Navigator;

if (environment.production) {
  enableProdMode();
}

if (environment.loginLocal) {
	Config.LOGIN_LOCAL = true;
}

const bootstrap = () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
};

if (typeof window['cordova'] !== 'undefined') {
  document.addEventListener('deviceready', () => {
    bootstrap();
    navigator.splashscreen.hide();
  }, false);
} else {
  bootstrap();
}
