'use strict';

angular.module('copayApp.services').provider('instanceConfig', function() {
  var provider = {};

  if (window.unicoisaConfig) {
    provider.config = window.unicoisaConfig;
  } else {
    console.error('No wallet config found');
    provider.config = {
      walletName: 'Wallet not found'
    };
  }

  provider.$get = function() {
    return provider.config;
  }

  return provider;
});
