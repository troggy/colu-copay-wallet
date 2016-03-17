'use strict';

var express = require('express');
var path = require('path');
var app = express();

var dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/wallets';
var db = require('./server/db')(dbUrl);
var walletConfig = require('./server/walletConfig');

app.use('/:walletName/',express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;
app.listen(port);
console.log("App listening on port " + port);

app.get('/:walletName/config.js', function(req, res) {
  db.getWallet(req.params.walletName)
    .then((wallet) => {
      if (!wallet) {
        res.status(404).end();
        return Promise.reject(`No such wallet found: ${req.params.walletName}`);
      }
      return walletConfig(wallet);
    })
    .then((walletConfigStr) => {
      res.setHeader('Content-type', 'application/javascript');
      res.send(walletConfigStr).end();
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send(e);
    });
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public'));
});
