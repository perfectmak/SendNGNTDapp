import Web3 from 'web3';
// eslint-disable-next-line import/no-cycle
import { WalletModelType } from './modules/wallets/state/WalletModels';
// eslint-disable-next-line import/no-cycle
import { SendNgntModelType } from './modules/home/state/types';
import { Provider } from './modules/wallets/web3/types';

export type AppStoreEnv = {
  // register env here too
  walletStore: WalletModelType;
  sendNgntStore: SendNgntModelType;
  walletProvider: Provider | null;
  web3: Web3 | null;
};
