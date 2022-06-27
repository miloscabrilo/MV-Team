# MvClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.7. This is front-end Angular application for internet store. <br />
Android app can be generated from js build [script](https://bitbucket.org/mv-team-maker/mv-team-maker-app/src/master/mv-app-builder/runAndroidDebug.js). For more details, see instructions from [README.md](https://bitbucket.org/mv-team-maker/mv-team-maker-app/src/master/mv-app-builder/README.md) of mv-app-builder directory.

## Prerequisite

- [Visual Studio Code, v1.67.2](https://code.visualstudio.com/)
- [Angular, v13.3.7](https://angular.io/)
- [Node, v16.15.1](https://nodejs.org/en/)
- [Npm - node package manager, v8.11.0](https://www.npmjs.com/)
- [Java, jdk11](https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html)
- [Android Sdk manager](https://android-doc.github.io/tools/help/sdk-manager.html) (can be installed within Android studio)
- [Android Sdk Build-Tools](https://developer.android.com/about/versions/12/setup-sdk) (can be installed within Android studio)
- [Android Studio](https://developer.android.com/studio)
- [Sdkman](https://sdkman.io/) (required to manage gradle version)
- [Gradle, v7.4.2](https://gradle.org/releases/)
- [Apache Cordova, v11](https://cordova.apache.org/docs/en/latest/) (nice to have but it is not required since local Cordova is already integrated)
- Export environment variables. Open `.bashrc` script and write the following lines: <br/>
`export JAVA_HOME=/usr/lib/jvm/java-1.11.0-openjdk-amd64` <br />
`export PATH=$PATH:$JAVA_HOME/bin` <br />
`export ANDROID_HOME=$HOME/Android/Sdk` <br />
`export ANDROID_SDK_ROOT=$ANDROID_HOME` <br />
`export PATH=$PATH:$ANDROID_HOME/tools` <br />
`export PATH=$PATH:$ANDROID_HOME/platform-tools`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files. Once you install `npm` (Node package manager), the dev server can be run with `npm start` as well.<br />
After some time, run `npm install` to be sure that you have the latest packages from `packages.json`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.<br />
Content of `dist/` directory will be copied to `www` directory of Cordova project. On that way, Angular files will be used in Cordova app.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.