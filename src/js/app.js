'use strict';

var modules = [
  'ui.router',
  'angularMoment',
  'mm.foundation',
  'monospaced.qrcode',
  'gettext',
  'ngLodash',
  'uiSwitch',
  'ngSanitize', 
  'ngCsv',
  'bwcModule',
  'logglyLogger',
  'copayApp.filters',
  'copayApp.services',
  'copayApp.controllers',
  'copayApp.directives',
  'copayApp.addons'
];

var copayApp = window.copayApp = angular.module('copayApp', modules);

copayApp.constant('loggly', {
  enabled: @@urv2_log_enabled,
  token: '@@urv2_log_token',
  env: '@@urv2_log_env',
});

angular.module('copayApp.filters', []);
angular.module('copayApp.services', []);
angular.module('copayApp.controllers', []);
angular.module('copayApp.directives', []);
angular.module('copayApp.addons', ['copayAddon.colu']);

