'use strict';

angular.module('copayApp.services').factory('assetService',
  function(profileService, coloredCoins, addonManager, lodash, configService,
          $q, $log, $rootScope, go, instanceConfig, walletService, $timeout, storageService) {

  var root = {},
      self = this,
      selectedAssetId,
      btcAsset = {
        assetId: 'bitcoin',
        isAsset: false
      };

  root.btcBalance = null;

  root.walletAsset = {
    isAsset: false
  };

  $rootScope.$on('ColoredCoins/AssetsUpdated', function() {
    root.updateWalletAsset();
  });

  var getZeroAsset = function(assetId) {
    var unitSymbol = coloredCoins.getAssetSymbol(assetId, null);
    var balanceStr = coloredCoins.formatAssetAmount(0, null, unitSymbol);

    return {
      assetId: assetId,
      unitSymbol: unitSymbol,
      balanceStr: balanceStr,
      availableBalance: 0,
      availableBalanceStr: balanceStr,
      divisibility: 0
    };
  };

  var getBtcAsset = function(assetId) {
    var unitSymbol = coloredCoins.getAssetSymbol(assetId, asset);
    var balanceStr = coloredCoins.formatAssetAmount(0, null, unit);

    return {
      assetId: assetId,
      isAsset: false
    };
  };

  var updateAssetBalance = function() {
    if (!self.selectedAssetId) { return {}; }

    var isAsset = self.selectedAssetId !== btcAsset.assetId,
        asset, unit, balanceStr;

    if (isAsset) {
      var asset = lodash.find(coloredCoins.assets, function(asset) {
         return asset.assetId == self.selectedAssetId;
       });

       if (!asset) {
          asset = getZeroAsset(self.selectedAssetId);
       }
       asset.isAsset = isAsset;
     } else {
       asset = btcAsset;
     }

     root.walletAsset = asset;
     $rootScope.$emit("Local/WalletAssetUpdated", root.walletAsset);
     return root.walletAsset;
  };

  root.setBtcBalance = function(btcBalance) {
    root.btcBalance = btcBalance;
  };

  root.updateWalletAsset = function() {
    if (!self.selectedAssetId) {
      var walletId = profileService.focusedClient.credentials.walletId,
          config = configService.getSync();

      config.assetFor = config.assetFor || {};
      root.getSupportedAssets(function(assets) {
        var supportedAssets = lodash.map(assets, 'assetId');
        var selectedAsset = config.assetFor[walletId];
        if (!selectedAsset || supportedAssets.indexOf(selectedAsset) === -1) {
          self.selectedAssetId = instanceConfig.defaultAsset;
        } else {
          self.selectedAssetId = config.assetFor[walletId];
        }
      });
    }

    return updateAssetBalance();
  };

  root.getSupportedAssets = function(cb) {
    storageService.getCustomAssets(function(err, customAssets) {
      if (!customAssets) return cb(instanceConfig.assets);
      cb(lodash(instanceConfig.assets).concat(customAssets).value());
    });
  };

  root.setSelectedAsset = function(assetId) {
    var walletId = profileService.focusedClient.credentials.walletId;

    var opts = {
      assetFor: {
      }
    };
    opts.assetFor[walletId] = assetId;
    self.selectedAssetId = assetId;

    configService.set(opts, function(err) {
      if (err) $log.warn(err);
      updateAssetBalance();
      go.walletHome();
    });
  };

  root.getNormalizedAmount = function(amount) {
    if (root.walletAsset.isAsset) {
      return (amount * Math.pow(10, root.walletAsset.divisibility)).toFixed(0);
    } else {
      var unitToSat = configService.getSync().wallet.settings.unitToSatoshi;
      return parseInt((amount * unitToSat).toFixed(0));
    }
  };

  root.createTransferTx = function(client, txp, cb) {
    if (root.walletAsset.isAsset) {
      return coloredCoins.makeTransferTxProposal(txp.amount, txp.toAddress, txp.message, root.walletAsset, function(err, coloredTxp) {
        if (err) return cb(err);

        client.createTxProposal(coloredTxp, function(err, createdTxp) {
          if (err) {
            return cb(err);
          } else {
            $log.debug('Transaction created');
            return cb(null, createdTxp);
          }
        });
      });
    } else {
      return walletService.createTx(client, addonManager.processCreateTxOpts(txp), cb);
    }
  };

  root.broadcastTx = function(client, txp, cb) {
    if (root.walletAsset.isAsset) {
      return coloredCoins.broadcastTx(txp.raw, txp.customData.financeTxId, function(err) {
        if (err) return cb(err);
        $timeout(function() {
          walletService.broadcastTx(client, txp, cb);
        }, 1000);
      });
    } else {
      return walletService.broadcastTx(client, txp, cb);
    }
  };

  root.addCustomAsset = function(newAsset, cb) {
    storageService.getCustomAssets(function(err, customAssets) {
      customAssets = customAssets || [];
      customAssets.push(newAsset);
      $log.debug('Adding new custom asset: ' + JSON.stringify(newAsset))
      storageService.setCustomAssets(customAssets, cb);
    });
  };

  root.removeCustomAsset = function(assetId, cb) {
    storageService.getCustomAssets(function(err, customAssets) {
      customAssets = customAssets || [];
      $log.debug('Removing custom asset: ' + assetId);
      customAssets = lodash.reject(customAssets, function(a) { return a.assetId === assetId });
      storageService.setCustomAssets(customAssets, cb);
    });
  };

  root.setSupportedAssets = function(cb) {
    root.getSupportedAssets(function(assets) {
      coloredCoins.setSupportedAssets(assets);
      if (cb) cb();
    });
  };

  root.setSupportedAssets();

  return root;
});
