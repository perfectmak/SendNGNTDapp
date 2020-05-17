import Web3 from 'web3';
import { Web3Network, Provider } from './web3/types';

export enum DetectedWallet {
  Metamask = 'MetaMask',
  Trust = 'Trust Wallet',
  Unknown = 'Browser Wallet',
  None = 'None',
}

export interface Wallet {
  address: string;
  network: Web3Network;
  provider: Provider;
  web3?: Web3;
}
