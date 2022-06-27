/**
 * Building MV-Team-App for Android
 * for testing
 */

const shell = require('shelljs');
const cordovaTools = require('./cordova-tools');

shell.rm('-rf', 'tmp');
shell.rm('-rf', 'out');
shell.mkdir('tmp');
shell.mkdir('out');

const PACKAGE_VERSION = require('../mv-client/package.json').version;
const PACKAGE_VERSION_FILE = require('../mv-client/package.json').version.split('.').join('_');
const PACKAGE_BUILD = require('../mv-client/package.json').build;

(async () => {
    // initialize, check options, ask for keys.
    cordovaTools.init();

    // build cordova, if required.
    if (cordovaTools.options.clean === true) {
        await cordovaTools.cordovaBootstrapAndroid({
            bundleId: 'com.mvteam.app',
            platform: 'android',
            name: 'MV_Team_App',
            version: PACKAGE_VERSION,
            build: PACKAGE_BUILD,
            description: 'MV Team App',
            skin: 'temp1',
            tlsUauthorized: true,
            cordova: cordovaTools.options.cordova,
            isAndroid: true
        });
    }
    build('DEV', 'temp1', cordovaTools.options);
})();

function build(line, skin, options) {
    let cordova = options.cordova;

    // backup mv-client/package.json
    shell.cp('../mv-client/package.json', 'tmp/package.json');
    // backup mv-team-app/config.xml
    shell.cp('../mv-team-app/config.xml', 'tmp/config.xml');

    let p = require('./tmp/package.json');
    p.lineName = line;
    p.skin = skin;
    // ship modified package.json to ../mv-client/package.json
    shell.ShellString(JSON.stringify(p, null, 2)).to('../mv-client/package.json');

    // build app release with ng via npm
    shell.pushd('../mv-client');
    shell.exec('npm run build');
    shell.popd();
    shell.pushd('../mv-app-builder');
    console.log("Copying Angular distribution files to Cordova project.");
    shell.exec('./copy-dist-to-cordova.sh');
    shell.popd();
    shell.pushd('../mv-team-app');
    shell.rm('-rf', 'platform/android/app/biuld/outputs/apk/debug/app-debug.apk');
    shell.rm('-rf', 'platform/android/app/biuld/outputs/apk/release/app-release.apk');
    shell.rm('-rf', 'platform/android/app/biuld/outputs/bundle/release/app-release.aab');

    console.log("Running Cordova project");
    shell.exec(cordova + ' run android --debug');
    shell.popd();
    shell.cp('../mv-team-app/platform/android/app/build/outputs/apk/debug/app-debug.apk', 'out/mv-team-app-' + line + '-android-debug-' + PACKAGE_VERSION_FILE + '.apk');
    // restore the original version of the mv-client/package.json
    shell.cp('tmp/package.json', '../mv-client/package.json');
}
