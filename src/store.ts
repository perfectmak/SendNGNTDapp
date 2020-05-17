import { createContext, useContext } from 'react';
import { types, Instance } from 'mobx-state-tree';
import * as Sentry from '@sentry/browser';
import { persist } from 'mst-persist';
import { WalletModel } from './modules/wallets/state/WalletModels';
import { getEnvNetwork } from './modules/wallets/web3/networks';
import { SendNgntModel } from './modules/home/state/SendNgntModel';
import { AppStoreEnv } from './types';

const AppStore = types.model('AppModel', {
  // register all app models
  walletStore: WalletModel,
  sendNgntStore: SendNgntModel,
});

export type AppStoreType = Instance<typeof AppStore>;

export const createStore = (): AppStoreType => {
  const walletStore = WalletModel.create({
    network: getEnvNetwork() as string,
    showLogin: false,
    isLoggedIn: false,
  });

  const sendNgntStore = SendNgntModel.create({});

  const env: AppStoreEnv = {
    walletStore,
    sendNgntStore,
    walletProvider: null,
    web3: null,
  };

  persist('sendNgnt', sendNgntStore).catch(Sentry.captureException);

  return AppStore.create({ walletStore, sendNgntStore }, env);
};

const AppStoreContext = createContext<AppStoreType>({} as AppStoreType);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useAppStore = () => useContext(AppStoreContext);
export const AppStoreProvider = AppStoreContext.Provider;
