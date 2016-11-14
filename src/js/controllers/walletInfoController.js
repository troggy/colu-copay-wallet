'use strict';

angular.module('copayApp.controllers').controller('walletInfoController',
    function ($scope, $rootScope, $timeout, profileService, configService,
              lodash, coloredCoins, assetService, instanceConfig, $ionicModal) {

  var self = this;

  function initAssets() {

    var assetsMap = coloredCoins.assetsMap || {},
        name, balanceStr;

    assetService.getSupportedAssets(function(assets) {
      self.assets = assets.map(function(asset) {
        var existingAsset = assetsMap[asset.assetId];
        name = asset.name || asset.symbol || asset.assetId;

        if (existingAsset) {
          balanceStr = existingAsset.balanceStr;
        } else {
          var unit = coloredCoins.getAssetSymbol(asset.assetId, null);
          balanceStr = coloredCoins.formatAssetAmount(0, null, unit);
        }
        return {
          assetName: name,
          assetId: asset.assetId,
          balanceStr: balanceStr,
          custom: asset.custom
        };
      })
      .concat([{
        assetName: 'Bitcoin',
        assetId: 'bitcoin',
        balanceStr: assetService.btcBalance
      }])
      .sort(function(a1, a2) {
        return a1.assetName > a2.assetName;
      });
    });
  }

  var setAssets = initAssets.bind(this);

  coloredCoins.getAssets().then(function(assets) {
    self.assetId = assetService.walletAsset.assetId;
    setAssets();
  });

  var disableAssetListener = $rootScope.$on('Local/WalletAssetUpdated', function (event, walletAsset) {
    setAssets();
    self.assetId = assetService.walletAsset.assetId;
    $timeout(function() {
      $rootScope.$digest();
    });
  });

  var disableSupportedAssetsChangeListener = $rootScope.$on('Local/NewCustomAsset', function (event, walletAsset) {
    setAssets();
  });

  $scope.$on('$destroy', function () {
    disableAssetListener();
    disableSupportedAssetsChangeListener();
  });

  this.setSelectedAsset = function(assetId) {
    assetService.setSelectedAsset(assetId);
  };

  this.removeCustomAsset = function(assetId) {
    assetService.removeCustomAsset(assetId, function() {
      if (self.assetId == assetId) {
        assetService.setSelectedAsset(instanceConfig.defaultAsset);
      }
      setAssets();
    });
  };

  this.showTokenModal = function() {
    $ionicModal.fromTemplateUrl('views/modals/addToken.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.addTokenModal = modal;
      $scope.addTokenModal.show();
    });
  }
});
