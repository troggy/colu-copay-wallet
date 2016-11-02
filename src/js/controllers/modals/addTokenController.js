'use strict';

angular.module('copayApp.controllers')
  .controller('addTokenController', function(
    $scope,
    $rootScope,
    $timeout,
    $log,
    storageService,
    assetService
) {

  var self = this;

  this.addToken = function(form) {
    if (form && form.$invalid) {
      this.error = gettext('Please enter the required fields');
      return;
    }

    var newAsset = {
      assetId: form.assetId.$modelValue,
      name: form.tokenName.$modelValue,
      symbol: form.symbol.$modelValue,
      pluralSymbol: form.symbol.$modelValue,
      custom: true
    };

    assetService.addCustomAsset(newAsset, function(err) {
      if (err) {
        this.error = err;
        return;
      }
      $scope.$emit('Local/NewCustomAsset');
      assetService.setSupportedAssets(function() {
        $rootScope.$emit('Local/RefreshAssets');
      });
      $scope.close();
    });
  };


  $scope.close = function() {
    $scope.addTokenModal.hide();
  };
});
