'use strict';

var MongoClient = require('mongodb');

let getWallet = function(dbUrl, walletName) {
    return new Promise(function(resolve, reject) {
        MongoClient.connect(dbUrl, function(err, db) {
          db.collection('wallets')
            .find({ walletName: walletName })
            .next((err, wallet) => {
              if (err) {
                reject(err);
              } else {
                resolve(wallet);
              }
              db.close();
            });
        });
    });
};

module.exports = function(dbUrl) {
    return {
      getWallet: function(walletName) { return getWallet(dbUrl, walletName); }
    }
};
