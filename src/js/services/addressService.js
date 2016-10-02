'use strict';
'use strict';
angular.module('copayApp.services')
  .factory('addressService', function(storageService, profileService, $log, $timeout, lodash, bwcError, gettextCatalog) {
    var root = {};

    root.expireAddress = function(walletId, cb) {
      $log.debug('Cleaning Address ' + walletId);
      storageService.clearLastAddress(walletId, function(err) {
        return cb(err);
      });
    };

    root.isUsed = function(walletId, byAddress, cb) {
      storageService.getLastAddress(walletId, function(err, addr) {
        var used = lodash.find(byAddress, {
          address: addr
        });
        return cb(null, used);
      });
    };

    root._createAddress = function(walletId, isChange, cb) {
      var client = profileService.getClient(walletId);

      $log.debug('Creating address for wallet:', walletId);

      client.createAddress({ isChange: isChange }, function(err, addr) {
        if (err) {
          var prefix = gettextCatalog.getString('Could not create address');
          if (err.error && err.error.match(/locked/gi)) {
            $log.debug(err.error);
            return $timeout(function() {
              root._createAddress(walletId, isChange, cb);
            }, 5000);
          } else if (err.message && err.message == 'MAIN_ADDRESS_GAP_REACHED') {
            $log.warn(err.message);
            prefix = null;
            client.getMainAddresses({
              reverse: true,
              limit: 1
            }, function(err, addr) {
              if (err) return cb(err);
              return cb(null, addr[0].address);
            });
          }
          return bwcError.cb(err, prefix, cb);
        }
        return cb(null, addr.address);
      });
    };

    root.getChangeAddress = function(walletId, cb) {
      return root._getAddress(walletId, true, true, cb);
    };

    root.getAddress = function(walletId, forceNew, cb) {
      return root._getAddress(walletId, forceNew, false, cb);
    }

    root._getAddress = function(walletId, forceNew, isChange, cb) {

      var firstStep;
      if (forceNew) {
        firstStep = storageService.clearLastAddress;
      } else {
        firstStep = function(walletId, cb) {
          return cb();
        };
      }

      firstStep(walletId, function(err) {
        if (err) return cb(err);

        storageService.getLastAddress(walletId, function(err, addr) {
          if (err) return cb(err);

          if (addr) return cb(null, addr);

          root._createAddress(walletId, isChange, function(err, addr) {
            if (err) return cb(err);
            storageService.storeLastAddress(walletId, addr, function() {
              if (err) return cb(err);
              return cb(null, addr);
            });
          });
        });
      });
    };

    return root;
  });
