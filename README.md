# angular-cordova-seed
Angular 5 + Cordova + Material + basic cordova plugin for cross device ( browser/mobile/tablet )

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.6.

## Get started

Run `mkdir www` if unavailable because cordova only work when `www` folder is exists.
Run `npm install`
Run `cordova prepare`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Run on device

Run `npm run device:[platform]` to execute application on desire platform.

Use "assests/path/to/file" path instead of "/assets/path/to/file" for local device file

## Create icons and splash screen

Refer [Splash](https://www.npmjs.com/package/cordova-splash) and [Icon](https://www.npmjs.com/package/cordova-icon) to setup the cli.

then run below command after platfrom remove/add.

`cordova-splash --splash=res/splash.png` and `cordova-icon --icon=res/icon.png`