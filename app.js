'use strict';

var express = require('express');
var path = require('path');
var app = express();

app.set('view engine', 'ejs');
app.set('views', './src/views')

var port = process.env.PORT || 3000;
app.listen(port);
console.log("App listening on port " + port);

var homePage = process.env.HOME_PAGE || 'https://www.colu.co/';
var configUrlBase = process.env.CONFIG_URL_BASE || 'https://dashboard.colu.co/config/wallets';

app.get('/:walletName', function(req, res) {
	console.log("getting wallet", req.params.walletName)
	console.log("config url base", configUrlBase)
	console.log("config url is", path.join(configUrlBase, req.params.walletName))
  res.render('index', {
     walletUriPrefix: `/${req.params.walletName}`,
     configUrl: configUrlBase+"/"+req.params.walletName
  });
});

app.get('/', function(req, res) {
    res.redirect(homePage);
});

app.use('/img/', express.static(__dirname + '/public/img'));
app.use('/views/', express.static(__dirname + '/public/views'));
app.use('/:walletName/', express.static(__dirname + '/public'));
