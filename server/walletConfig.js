'use strict';

module.exports = function(walletData) {

  return `
window.unicoisaConfig = {
  walletName: "${walletData.walletName}",
  mainColor: "${walletData.mainColor || ''}",
  secondaryColor: "${walletData.secondaryColor || ''}",
  assets: [
    {
      assetId: '${walletData.assetId}',
      name: '${walletData.assetName}',
      symbol: '${walletData.symbol || ''}',
      pluralSymbol: '${walletData.pluralSymbol || ''}'
    }
  ],
  defaultAsset: '${walletData.assetId}',
  logo: "${walletData.logo || ''}",
  coluApiKey: "${walletData.coluApiKey || ''}"
};
  `
};
