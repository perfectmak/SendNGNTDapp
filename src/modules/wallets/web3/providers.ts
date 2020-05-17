import {
  Web3Network,
  SupportedProvider,
  Provider,
  Resolvers,
  ProviderConfigMapType,
} from './types';
import {
  isNetworkMainnet,
  isNetworkTestnet,
  getEnvNetwork,
  networkToCode,
} from './networks';

/**
 * Map of resolver logic for each supported web3 providers.
 *
 */
export const ProviderResolvers: Resolvers = {
  [SupportedProvider.Injected]: async window => {
    if (window.ethereum) {
      await window.ethereum.enable();
      return window.ethereum;
    }

    if (window.web3) {
      return window.web3.currentProvider;
    }

    throw new Error(
      'No injected provider in this browser. Try some other wallet provider.'
    );
  },

  [SupportedProvider.Portis]: async (_window, config) => {
    if (!config.portisApiKey) {
      throw new Error(
        'Portis not properly configured. Try some other provider.'
      );
    }
    const Portis = await import('@portis/web3').then(m => m.default);
    const portis = new Portis(
      config.portisApiKey,
      config.network || Web3Network.Mainnet
    );

    // add close() function to provider to log user out
    // close() is similar to our Provider interface
    portis.provider.close = async (): Promise<void> => {
      await portis.logout();
    };
    return portis.provider;
  },

  [SupportedProvider.Fortmatic]: async (_window, config) => {
    let apiKey: string;
    if (isNetworkMainnet(config.network) && config.fmMainnetApiKey) {
      apiKey = config.fmMainnetApiKey;
    } else if (isNetworkTestnet(config.network) && config.fmTestnetApiKey) {
      apiKey = config.fmTestnetApiKey;
    } else {
      throw new Error(
        'Fortmatic not properly configured. Try some other provider.'
      );
    }

    const Fortmatic = await import('fortmatic').then(m => m.default);
    const fm = new Fortmatic(apiKey);
    return (fm.getProvider() as unknown) as Provider;
  },

  [SupportedProvider.WalletConnect]: async (_window, config) => {
    if (!config.infuraApiKey) {
      throw new Error('Wallet Connect requires infura id to work');
    }

    const WalletConnectProvider = await import(
      '@walletconnect/web3-provider'
    ).then(m => m.default);
    const provider = new WalletConnectProvider({
      infuraId: config.infuraApiKey,
      chainId: networkToCode(config.network),
    });

    await provider.enable();

    return provider;
  },

  [SupportedProvider.WalletLink]: async (_window, config) => {
    if (!config.infuraApiKey) {
      throw new Error('Wallet Link requires infura id to work');
    }

    const WalletLink = await import('walletlink').then(m => m.default);
    const walletLink = new WalletLink({
      appName: 'SendNGNT',
    });

    const ethereum = walletLink.makeWeb3Provider(
      `https://${process.env.ETH_NETWORK}.infura.io/v3/${config.infuraApiKey}`,
      networkToCode(config.network)
    );

    await ethereum.enable();

    return (ethereum as unknown) as Provider;
  },
  [SupportedProvider.Torus]: async (_window, config) => {
    const Torus = await import('@toruslabs/torus-embed').then(m => m.default);
    const isProduction = process.env.NODE_ENV === 'production';
    const torus = new Torus({ buttonPosition: 'top-right' });
    await torus.init({
      buildEnv: isProduction ? 'production' : 'development',
      network: { host: config.network },
      showTorusButton: false,
    });
    await torus.login({});

    const provider = (torus.provider as unknown) as Provider;
    provider.close = async (): Promise<void> => {
      return torus.logout();
    };

    return provider;
  },
};

export const ProviderConfigMap: ProviderConfigMapType = {
  [SupportedProvider.Fortmatic]: {
    provider: SupportedProvider.Fortmatic,
    network: getEnvNetwork(),
    fmMainnetApiKey: process.env.REACT_APP_FORTMATIC_LIVE_KEY,
    fmTestnetApiKey: process.env.REACT_APP_FORTMATIC_TEST_KEY,
  },
  [SupportedProvider.Injected]: {
    provider: SupportedProvider.Injected,
    network: getEnvNetwork(),
  },
  [SupportedProvider.Portis]: {
    provider: SupportedProvider.Portis,
    network: getEnvNetwork(),
    portisApiKey: process.env.REACT_APP_PORTIS_DAPP_ID,
  },
  [SupportedProvider.WalletConnect]: {
    provider: SupportedProvider.WalletConnect,
    network: getEnvNetwork(),
    infuraApiKey: process.env.REACT_APP_INFURA_API_KEY,
  },
  [SupportedProvider.WalletLink]: {
    provider: SupportedProvider.WalletLink,
    network: getEnvNetwork(),
    infuraApiKey: process.env.REACT_APP_INFURA_API_KEY,
  },
  [SupportedProvider.Torus]: {
    provider: SupportedProvider.Torus,
    network: getEnvNetwork(),
  },
};
