# Digital wallet for [Colu](https://colu.co) assets.

Based on [Copay](https://github.com/bitpay/copay) 2.7.0 and [Colu SDK](http://documentation.colu.co/)

This project can be used in two ways:

1. As a server application hosting multiple web wallets (like Colu does). Which wallet to use will be determined by URI: e.g. ``http://localhost:3000/foo`` will open wallet for `foo` configuration (see Installation section on how to set this up).
2. A a single wallet either hosted on the web or packaged as mobile application.

## Installation

Clone the source:

```sh
git clone https://github.com/troggy/colu-copay-wallet.git
cd colu-copay-wallet
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

## More documentation

Refer to official Copay docs

## License

MIT
