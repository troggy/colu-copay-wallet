'use strict';
angular.module('copayApp.services')
  .factory('storageService', function(logHeader, fileStorageService, localStorageService,
      sjcl, $log, lodash, isCordova, instanceConfig) {

    var root = {};

    // File storage is not supported for writing according to
    // https://github.com/apache/cordova-plugin-file/#supported-platforms
    var shouldUseFileStorage = isCordova && !isMobile.Windows();
    $log.debug('Using file storage:', shouldUseFileStorage);


    var storage = shouldUseFileStorage ? fileStorageService : localStorageService;

    var getUUID = function(cb) {
      // TO SIMULATE MOBILE
      //return cb('hola');
      if (!window || !window.plugins || !window.plugins.uniqueDeviceID)
        return cb(null);

      window.plugins.uniqueDeviceID.get(
        function(uuid) {
          return cb(uuid);
        }, cb);
    };

    var encryptOnMobile = function(text, cb) {

      // UUID encryption is disabled.
      return cb(null, text);
      //
      // getUUID(function(uuid) {
      //   if (uuid) {
      //     $log.debug('Encrypting profile');
      //     text = sjcl.encrypt(uuid, text);
      //   }
      //   return cb(null, text);
      // });
    };


    var decryptOnMobile = function(text, cb) {
      var json;
      try {
        json = JSON.parse(text);
      } catch (e) {};

      if (!json) return cb('Could not access storage')

      if (!json.iter || !json.ct) {
        $log.debug('Profile is not encrypted');
        return cb(null, text);
      }

      $log.debug('Profile is encrypted');
      getUUID(function(uuid) {
        $log.debug('Device UUID:' + uuid);
        if (!uuid)
          return cb('Could not decrypt storage: could not get device ID');

        try {
          text = sjcl.decrypt(uuid, text);

          $log.info('Migrating to unencrypted profile');
          return storage.set(instanceConfig.walletName + '-profile', text, function(err) {
            return cb(err, text);
          });
        } catch (e) {
          $log.warn('Decrypt error: ', e);
          return cb('Could not decrypt storage: device ID mismatch');
        };
        return cb(null, text);
      });
    };



    root.tryToMigrate = function(cb) {
      if (!shouldUseFileStorage) return cb();

      localStorageService.get('profile', function(err, str) {
        if (err) return cb(err);
        if (!str) return cb();

        $log.info('Starting Migration profile to File storage...');

        fileStorageService.create('profile', str, function(err) {
          if (err) cb(err);
          $log.info('Profile Migrated successfully');

          localStorageService.get('config', function(err, c) {
            if (err) return cb(err);
            if (!c) return root.getProfile(cb);

            fileStorageService.create('config', c, function(err) {

              if (err) {
                $log.info('Error migrating config: ignoring', err);
                return root.getProfile(cb);
              }
              $log.info('Config Migrated successfully');
              return root.getProfile(cb);
            });
          });
        });
      });
    };

    root.storeNewProfile = function(profile, cb) {
      encryptOnMobile(profile.toObj(), function(err, x) {
        storage.create(instanceConfig.walletName + '-profile', x, cb);
      });
    };

    root.storeProfile = function(profile, cb) {
      encryptOnMobile(profile.toObj(), function(err, x) {
        storage.set(instanceConfig.walletName + '-profile', x, cb);
      });
    };

    root.getProfile = function(cb) {
      storage.get(instanceConfig.walletName + '-profile', function(err, str) {
        if (err || !str)
          return cb(err);

        decryptOnMobile(str, function(err, str) {
          if (err) return cb(err);
          var p, err;
          try {
            p = Profile.fromString(str);
          } catch (e) {
            $log.debug('Could not read profile:', e);
            err = new Error('Could not read profile:' + p);
          }
          return cb(err, p);
        });
      });
    };

    root.deleteProfile = function(cb) {
      storage.remove(instanceConfig.walletName + '-profile', cb);
    };

    root.storeFocusedWalletId = function(id, cb) {
      storage.set(instanceConfig.walletName + '-focusedWalletId', id || '', cb);
    };

    root.getFocusedWalletId = function(cb) {
      storage.get(instanceConfig.walletName + '-focusedWalletId', cb);
    };

    root.getLastAddress = function(walletId, cb) {
      storage.get(instanceConfig.walletName + '-lastAddress-' + walletId, cb);
    };

    root.storeLastAddress = function(walletId, address, cb) {
      storage.set(instanceConfig.walletName + '-lastAddress-' + walletId, address, cb);
    };

    root.clearLastAddress = function(walletId, cb) {
      storage.remove(instanceConfig.walletName + '-lastAddress-' + walletId, cb);
    };

    root.setBackupFlag = function(walletId, cb) {
      storage.set(instanceConfig.walletName + '-backup-' + walletId, Date.now(), cb);
    };

    root.getBackupFlag = function(walletId, cb) {
      storage.get(instanceConfig.walletName + '-backup-' + walletId, cb);
    };

    root.clearBackupFlag = function(walletId, cb) {
      storage.remove(instanceConfig.walletName + '-backup-' + walletId, cb);
    };

    root.setCleanAndScanAddresses = function(walletId, cb) {
      storage.set(instanceConfig.walletName + '-CleanAndScanAddresses', walletId, cb);
    };

    root.getCleanAndScanAddresses = function(cb) {
      storage.get(instanceConfig.walletName + '-CleanAndScanAddresses', cb);
    };

    root.removeCleanAndScanAddresses = function(cb) {
      storage.remove(instanceConfig.walletName + '-CleanAndScanAddresses', cb);
    };

    root.getConfig = function(cb) {
      storage.get(instanceConfig.walletName + '-config', cb);
    };

    root.storeConfig = function(val, cb) {
      $log.debug('Storing Preferences', val);
      storage.set(instanceConfig.walletName + '-config', val, cb);
    };

    root.clearConfig = function(cb) {
      storage.remove(instanceConfig.walletName + '-config', cb);
    };

    //for compatibility
    root.getCopayDisclaimerFlag = function(cb) {
      storage.get(instanceConfig.walletName + '-agreeDisclaimer', cb);
    };

    root.setRemotePrefsStoredFlag = function(cb) {
      storage.set(instanceConfig.walletName + '-remotePrefStored', true, cb);
    };

    root.getRemotePrefsStoredFlag = function(cb) {
      storage.get(instanceConfig.walletName + '-remotePrefStored', cb);
    };

    root.setGlideraToken = function(network, token, cb) {
      storage.set(instanceConfig.walletName + '-glideraToken-' + network, token, cb);
    };

    root.getGlideraToken = function(network, cb) {
      storage.get(instanceConfig.walletName + '-glideraToken-' + network, cb);
    };

    root.removeGlideraToken = function(network, cb) {
      storage.remove(instanceConfig.walletName + '-glideraToken-' + network, cb);
    };

    root.setAddressbook = function(network, addressbook, cb) {
      storage.set(instanceConfig.walletName + '-addressbook-' + network, addressbook, cb);
    };

    root.getAddressbook = function(network, cb) {
      storage.get(instanceConfig.walletName + '-addressbook-' + network, cb);
    };

    root.setDeviceToken = function(token, cb) {
      storage.set(instanceConfig.walletName + '-token', token, cb);
    }

    root.getDeviceToken = function(cb) {
      storage.get(instanceConfig.walletName + '-token', cb);
    }

    root.removeAddressbook = function(network, cb) {
      storage.remove(instanceConfig.walletName + '-addressbook-' + network, cb);
    };

    root.setTxHistory = function(txs, walletId, cb) {
      storage.set(instanceConfig.walletName + '-txsHistory-' + walletId, txs, cb);
    }

    root.getTxHistory = function(walletId, cb) {
      storage.get(instanceConfig.walletName + '-txsHistory-' + walletId, cb);
    }

    root.removeTxHistory = function(walletId, cb) {
      storage.remove(instanceConfig.walletName + '-txsHistory-' + walletId, cb);
    }

    return root;
  });
