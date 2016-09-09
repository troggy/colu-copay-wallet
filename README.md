# Digital wallet for [Colu](https://colu.co) assets.

Based on [Copay](https://github.com/bitpay/copay) 1.8 and [Colu SDK](http://documentation.colu.co/)

This project can be used in two ways:

1. As a server application hosting multiple web wallets (like Colu does). Which wallet to use will be determined by URI: e.g. ``http://localhost:3000/foo`` will open wallet for `foo` configuration (see Installation section on how to set this up).
2. A a single wallet either hosted on the web or packaged as mobile application.

## Installation

Clone the source:

```sh
git clone https://bitbucket.com/teamcolu/wallet-generator.git colu-copay
cd colu-copay
```

Install [bower](http://bower.io/) and [grunt](http://gruntjs.com/getting-started) if you haven't already:

```sh
npm install -g bower
npm install -g grunt-cli
```

Install project dependencies:

```sh
bower install
npm install
```

Next steps depend on how you plan to use the app.

### Option 1. Run as an app hosting multiple web wallets

1. This option will require you to setup another service hosting configurations for your wallets (not described here). This service should vend configuration files by their name like https://<some-domain-and-optional-uri>/<wallet name>. Example of working URL vending configuration for SmashCoin wallet: https://dashboard.colu.co/config/wallets/SmashCoin
[Config file example](https://github.com/troggy/unicoisa/blob/master/config.js)

2. Set `CONFIG_URL_BASE` env variable to the base URL of the service that serves configs. If not set, `https://dashboard.colu.co/config/wallets` will be used. 

3. Build the app and start it:

        grunt
        npm start

  
Colu-Copay is now ready to serve your wallets. E.g. `foo` wallet will be served from `http://localhost:3000/foo` and config for it will be requested from ``<CONFIG_BASE_URL>/foo``. Root page will redirect to `https://www.colu.co/` - could be configured with `HOME_PAGE` env variable

### Option 2. Build Colu-Copay as a single web wallet, mobile or desktop application

1. Edit ``config.js`` to match your wallet settings.
If you set up the wallet using Colu dashboard, you can download your config using the link (adjust it to include your wallet name):
``https://dashboard.colu.co/config/wallets/<your wallet name>``. E.g. config file for web wallet https://wallets.colu.co/SmashCoin#/ is available at https://dashboard.colu.co/config/wallets/SmashCoin

2. Build the app: 

        grunt static
  

3. Your app is now ready to be served from the ``public/`` folder as a web wallet. It is a static web site (no backend required), so you can use webserver like Nginx or any static file hosting to serve it.

4. If you want to make a mobile or desktop application see below for instructions for your target platform. You may not be able to publish the app to AppStore/Play Market, unless you make all the rebranding changes in the app (change logos, trademarks etc).

#### Android

- Install Android SDK
- Run `make android-prod`

#### iOS

- Install Xcode 6.1 (or newer)
- Run `make ios-prod`

##### Notes for Xcode 7.0

###### ATS support

Before starting Copay from Xcode, add these lines to "Custom iOS Target Properties":

```
<key>NSAppTransportSecurity</key>
 <dict>
  <key>NSAllowsArbitraryLoads</key>
  <true/>
 </dict>
```

![Example](http://i.stack.imgur.com/nGw3j.png)


App Transport Security (ATS) enforces best practices in the secure connections between an app and its back end. [Read complete documentation](https://developer.apple.com/library/prerelease/ios/releasenotes/General/WhatsNewIniOS/Articles/iOS9.html).

###### Invalid Bundle while submitting application

`iPad Multitasking support requires launch story board in bundle`

To fix this problem, add the following:

```
<key>UIRequiresFullScreen</key>
<string>YES</string>
```
###### Build settings, headers search path

Add this line to your Build Settings -> Header Search Paths -> Release

"$(OBJROOT)/UninstalledProducts/$(PLATFORM_NAME)/include"



#### Windows Phone

- Install Visual Studio 2013 (or newer)
- Run `make wp8-prod`

#### Desktop versions (Windows, OS X, Linux)

Copay uses NW.js (also know as node-webkit) for its desktop version. NW.js is an app runtime based on `Chromium` and `node.js`.

- Install NW.js on your system from [nwjs.io](http://nwjs.io/)
- Run `grunt desktop`

#### Google Chrome App

- Run `npm run-script chrome`

On success, the Chrome extension will be located at: `browser-extensions/chrome/copay-chrome-extension`.  To install it go to `chrome://extensions/` in your browser and ensure you have the 'developer mode' option enabled in the settings.  Then click on "Load unpacked chrome extension" and choose the directory mentioned above.

## License

Copay is released under the MIT License.  Please refer to the [LICENSE](https://github.com/bitpay/copay/blob/master/LICENSE) file that accompanies this project for more information including complete terms and conditions.