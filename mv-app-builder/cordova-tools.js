

const xml2js = require('xml2js');
const fs = require('fs');
const shell = require('shelljs');
// Configuration setting to exclude (if shell.config.silent = true) printing output of comand exec(). 
shell.config.silent = false;

const readlineSync = require('readline-sync');
// Name of the Cordova app
const appName = 'mv-team-app';
// Name of the folder for building the app
const appBuilderDir = require('path').basename(__dirname);
console.log('\nThis script is running from ' + appBuilderDir + ' directory.\n');

// Define a global parameters/objects.
module.exports = {
    // create cordova project in ../appName
    options: {
        cordova: getCordovaPath(),
        clean: false,
        runBuild: 'run'
    }, 
    init() {
        let self = this;
        process.argv.forEach(function (val) {
            if (val.includes('node')) {
                console.log('Node will be used from: ' + val);
                console.log('Node version: ' + shell.exec('node --version'));
            }
            if (val == 'clean') {
                console.log("Latest created project " + appName + " will be deleted.\n");
                self.options.clean = true;
            }
            if (val == 'build') self.options.runBuild = 'build';
            if (val == 'help' || val == '-help' || val == '--help') {
                console.log('Options:');
                console.log('  "clean": provide cleaning and creating new cordova project in ../' + appName);
                console.log('  "build": provide building the app, default is "run" for running the app on the device')
                console.log();
                process.exit();
            }
        });
    }, 
    updateCordovaConfigXml(options) {
        return new Promise((resolve, reject) => {
            // retreive working copy of appName/config.xml file.
            shell.cp('../' + appName + '/config.xml', 'tmp/config.xml');
            // read file and parse with xml2js
            let xmlText = fs.readFileSync('tmp/config.xml');
            let parser = new xml2js.Parser();
            parser.parseString(xmlText, ((err, result) => {
                if (err) {
                    reject(new Error('updateCordovaConfigXml: failed to parse XML'));
                }
                // Now set particular values
                // Version
                result.widget['$'].version = options.version;
                // iOS build number in ios-CFBundleVersion
                if (options.build != undefined) {
                    result.widget['$']['ios-CFBundleVersion'] = options.build;
                }
                // Andriod namespace - xmlns:android
                result.widget['$']['xmlns:android'] = 'http://schemas.android.com/apk/res/android';
                // Description
                result.widget.description[0] = options.description;
                // Author
                result.widget.author[0] = {
                    "_": "MV TEAM",
                    "$": {
                        "email": "mlscabrilo5@gmail.com", 
                        "contact": "Milos Cabrilo"
                    }
                };
                // Platform
                if (options.isAndroid) {
                    result.widget.platform = [
                        {
                            "$": {
                                "name": "android"
                            },
                            "allow-intent": [{
                                "$": {
                                    "href": "markert:*"
                                }
                            }],
                            "preference": [
                                {
                                    "$": {
                                        "name": "android-minSdkVersion",
                                        "value": "23"
                                    }
                                },
                                {
                                    "$": {
                                        "name": "android-targetSdkVersion",
                                        "value": "30.0.3"
                                    }
                                },
                                {
                                    "$": {
                                        "name": "AndroidPersistentFileLocation",
                                        "value": "Compatibility"
                                    }
                                },
                                {
                                    "$": {
                                        "name": "AndroidXEnabled",
                                        "value": "true"
                                    }
                                },
                                {
                                    "$": {
                                        "name": "AndroidPersistentFileLocation",
                                        "value": "Compatibility"
                                    }
                                }
                            ],
                            "config-file": {
                                "$": {
                                    "parent": "/*",
                                    "target": "AndroidManifest.xml",
                                    "mode": "merge"
                                },
                                "uses-permission": [
                                    {
                                        "$": { "android:name": "android.permission.FOREGROUND_SERVICE" }
                                    },
                                    {
                                        "$": { "android:name": "android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" }
                                    }
                                ]
                            },
                        }
                    ]
                }
                else {
                    result.widget.platform = [
                        {
                            "$": {
                                "name": "ios"
                            },
                            "allow-intent": [{
                                "$": {
                                    "href": "itms:*" 
                                }
                            },
                            {
                                "$": {
                                    "href": "itms-apps:*"
                                }
                            }],
                        }
                    ];
                    result.widget.platform = [
                        {
                            "$": {
                                "name": "DisallowOverscroll",
                                "value": "true"
                            }
                        },
                        {
                            "$": {
                                "name": "BackupWebStorage",
                                "value": "none"
                            }
                        },
                        {
                            "$": {
                                "name": "AllowInlineMediaPlayback",
                                "value": "true"
                            }
                        },
                        {
                            "$": {
                                "name": "AlowBackForwardNavigationGestures",
                                "value": "false"
                            }
                        }
                    ];
                }
                // Create a new builder object and then convert our json back to xml.
                let builder = new xml2js.Builder();

                let xml_out = builder.buildObject(result);

                fs.writeFileSync('../' + appName + '/config.xml', xml_out);
                console.log('Updated ../' + appName + '/config.xml');
                resolve({
                    config: result,
                    xml: xml_out
                });
            }));

        });
    },
    async cordovaBootstrapAndroid(config) {
        if (config == undefined || config.bundleId == undefined || config.platform == undefined || config.name == undefined || config.version == undefined
        || config.description == undefined || config.skin == undefined || config.platform != 'android') {
            console.log('cordovaBootsrap: undefined or invalid configuration.');
            process.exit();
        }
        let cordova = config.cordova;

        // Create Cordova project
        
        shell.pushd('..');
        // Delete appName directory if it exists
        console.log("Deleting latest created project...");
        shell.exec('if [ -d ' +  appName +' ]; then rm -rf ' + appName + '; fi');

        // Create appName Cordova project
        console.log("Creating new Cordova project...");
        console.log("Application name: " + appName);
        console.log("BundleId: " + config.bundleId);
        console.log("Configuration name: " + config.name);
        shell.exec(cordova + ' create ' + appName + ' ' + config.bundleId + ' "' + config.name + '"');
    
        // Change back to appBuilderDir and configure config.xml
        shell.pushd(appBuilderDir);
        await this.updateCordovaConfigXml(config);
        // Copy skinned information
        console.log('Cleaning generic assets');
        shell.exec('rm -rf ../' + appName + '/res');
        shell.exec('mkdir -p ../' + appName + '/res');
        console.log('Copying ' + config.skin + ' assets');
        shell.exec('cp -r ../cordova-assets/' + config.skin + '/res/* ../' + appName + '/res');
        shell.popd();

        // Use Cordova 11 -> cordova-android@10.1.1
        shell.pushd(appName);
        shell.exec(cordova + ' platform add android@10.1.1');
        // Add plugins
        console.log("Add Cordova plugins");
        // Example: shell.exec(cordova + ' plugin add cordova-plugin-name@version);
        shell.exec(cordova + ' plugin add cordova-plugin-screen-orientation@3.0.2');
        // Prepare Cordova project
        shell.exec(cordova + ' prepare');
        shell.popd();
        shell.popd();
    }
}

/**
 * Get Cordova Path: 
 * For local cordova, it will be <some_path>/
 * For global cordova, it will be just cordova
 */
function getCordovaPath() {
    console.log("Checking Cordova path: whether is global or local?");
    console.log("The local option is desirable because you don't have to have cordova installed on your machine!")
    console.log("Local Cordova requires node_module/cordova/bin directory inside " + appBuilderDir + " directory.");
    let currentDir = require('path').basename(__dirname);
    let cordovaCurrentPath;

    // If the script is not executed for proper dir.
    if (currentDir !== appBuilderDir) {
        console.error("This script must be executed from dir: " + appBuilderDir);
        return '';
    }
    shell.pushd('node_modules/cordova/bin');
    let currentPath = process.cwd();
    // If local cordova does not exist, global cordova must be chosen.
    if (currentPath.split("/").splice(-1)[0] !== "bin") {
        console.log("The global Cordova is chosen!\n");
        cordovaCurrentPath = 'cordova';
    }
    else {
        console.log("The local Cordova is chosen!\n");
        cordovaCurrentPath = currentPath + '/cordova';
        shell.popd();
    }
    return cordovaCurrentPath;
}
