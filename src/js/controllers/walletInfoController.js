'use strict';

angular.module('copayApp.controllers').controller('walletInfoController',
    function ($scope, $rootScope, $timeout, profileService, configService,
              lodash, coloredCoins, walletService, instanceConfig) {
  
  var self = this;

  function initAssets(assets) {
    
    var assets = instanceConfig.assets,
        assetsMap = coloredCoins.assetsMap || {},
        name, balanceStr;
    
    this.assets = assets
        .map(function(asset) {
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
            balanceStr: balanceStr
          };
        })
        .concat([{
          assetName: 'Bitcoin',
          assetId: 'bitcoin',
          balanceStr: walletService.btcBalance
        }])
        .sort(function(a1, a2) {
          return a1.assetName > a2.assetName;
        });
  }

  var setAssets = initAssets.bind(this);

  coloredCoins.getAssets().then(function(assets) {
    self.assetId = walletService.walletAsset.assetId;
    setAssets(assets);
  });

  var disableAssetListener = $rootScope.$on('Local/WalletAssetUpdated', function (event, walletAsset) {
    setAssets(coloredCoins.assets);
    self.assetId = walletService.walletAsset.assetId;
    $timeout(function() {
      $rootScope.$digest();
    });
  });

  $scope.$on('$destroy', function () {
    disableAssetListener();
  });

  this.setSelectedAsset = function(asset) {
    walletService.setSelectedAsset(asset);
  };
});
