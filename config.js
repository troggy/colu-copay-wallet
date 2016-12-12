window.unicoisaConfig = {

  // wallet UI configuration
  walletName: 'Espressos',
  mainColor: '',      // if blank default color will be used
  secondaryColor: '', // if blank default color will be used
  logo: '',           // if blank default logo will be used
  allowAssetChange: true,
  noUserColors: false,
  needsBackup: false,

  // Assets configuration
  assets: [
    {
      assetId: 'Ua9E8E4kY4XrEezyamNAqZAQ4fZzAsUmeKEf4b',
      name: 'BitReal',
      symbol: 'R$',
      pluralSymbol: 'R$'
    }
  ],
  defaultAsset: 'Ua9E8E4kY4XrEezyamNAqZAQ4fZzAsUmeKEf4b',

  // Colu connectivity configuration
  // see https://github.com/troggy/colu-copay-addon
  colu: {
    mode: 'sdk',
    rpcConfig: {
      livenet: {
        baseUrl: ''
      },
      testnet: {
        baseUrl: ''
      }
    }
  },
  coluApiKey: ''
};
