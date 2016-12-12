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

  this.updating = false;

  this.addToken = function(form) {
    if (form && form.$invalid) {
      self.error = 'Please enter the required fields';
      return;
    }

    var newAsset = {
      assetId: form.assetId.$modelValue,
      symbol: form.symbol.$modelValue,
      pluralSymbol: form.symbol.$modelValue,
      custom: true
    };

    self.updating = true;

    assetService.addCustomAsset(newAsset, function(err) {
      if (err) {
        $timeout(function() {
          self.error = err;
          self.updating = false;
        });
        return;
      }
      $scope.$emit('Local/NewCustomAsset');
      assetService.setSupportedAssets(function() {
        $rootScope.$emit('Local/RefreshAssets');
        self.updating = false;
      });
      $scope.close();
    });
  };


  $scope.close = function() {
    $scope.addTokenModal.hide();
  };
});
