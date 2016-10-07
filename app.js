'use strict';

var express = require('express');
var path = require('path');
var app = express();

var port = process.env.PORT || 3000;



if (process.env.STATIC_CONFIG) {
  app.use(express.static(__dirname + '/public'));

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public'));
  });
} else {
  var homePage = process.env.HOME_PAGE || 'https://www.colu.co/';
  var configUrlBase = process.env.CONFIG_URL_BASE || 'https://dashboard.colu.co/config/wallets';

  app.set('view engine', 'ejs');
  app.set('views', './src/views')

  app.get('/:walletName', function(req, res) {
    res.render('index', {
       walletUriPrefix: `/${req.params.walletName}`,
       configUrl: `${configUrlBase}/${req.params.walletName}`
    });
  });

  app.get('/', function(req, res) {
      res.redirect(homePage);
  });

  app.use('/img/', express.static(__dirname + '/public/img'));
  app.use('/views/', express.static(__dirname + '/public/views'));
  app.use('/:walletName/', express.static(__dirname + '/public'));
}

app.listen(port);
console.log("App listening on port " + port);
