import { WebsocketProvider } from 'web3-core';

export type Provider = WebsocketProvider & {
  enable: () => Promise<any>;
  isMetaMask: boolean;
  close?: () => Promise<void>;
};

export type Web3Window = Window & {
  ethereum?: Provider;
  web3: { currentProvider: Provider };
  trust?: Provider;
};

export enum SupportedProvider {
  Injected = 'MetaMask',
  Portis = 'Portis',
  Fortmatic = 'Fortmatic',
  WalletConnect = 'WalletConnect',
  WalletLink = 'WalletLink',
  Torus = 'Torus',
}

export enum Web3Network {
  Unknown = 'unknown',
  Rinkeby = 'rinkeby',
  Kovan = 'kovan',
  Ropsten = 'ropsten',
  Mainnet = 'mainnet',
  Truffle = 'truffle',
}

export enum Web3NetworkCode {
  Unknown = 0,
  Rinkeby = 4,
  Kovan = 42,
  Ropsten = 3,
  Mainnet = 1,
  Truffle = 4447,
}

export interface ResolverConfig {
  network: Web3Network;
  provider: SupportedProvider;
  fmTestnetApiKey?: string;
  fmMainnetApiKey?: string;
  portisApiKey?: string;
  infuraApiKey?: string;
}

export type ProviderResolver = (
  window: Web3Window,
  config: ResolverConfig
) => Promise<Provider>;

export type Resolvers = {
  [provider in SupportedProvider]: ProviderResolver;
};

export type ProviderConfigMapType = {
  [provider in SupportedProvider]: ResolverConfig;
};

/**
 * Etherchain response
 *
 */
export interface EtherchainPriceResponse {
  safeLow: string;
  standard: string;
  fast: string;
  fastest: string;
}
