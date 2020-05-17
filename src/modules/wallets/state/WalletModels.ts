/* eslint-disable no-param-reassign */
import { types, Instance, getEnv, flow } from 'mobx-state-tree';
import * as Sentry from '@sentry/browser';
import { Wallet } from '../types';
// eslint-disable-next-line import/no-cycle
import { AppStoreEnv } from '../../../types';

/**
 * Represents the current wallet in the application
 *
 */
export const WalletModel = types
  .model('WalletModel', {
    address: types.optional(types.string, ''),
    network: types.string,
    showLogin: types.boolean,
    isLoggedIn: types.boolean,
  })
  .actions(self => ({
    /**
     * Sets the actives the wallet provider used through the application.
     *
     */
    setWallet: (wallet: Wallet): void => {
      const appEnv = getEnv<AppStoreEnv>(self);
      if (wallet.web3) {
        appEnv.web3 = wallet.web3;
        appEnv.walletProvider = wallet.provider;
        self.isLoggedIn = true;
        self.address = wallet.address;
        self.showLogin = false;
        Sentry.configureScope(scope => {
          scope.setUser({
            id: wallet.address.toLowerCase(),
            network: wallet.network,
          });
        });
      } else {
        // error here
      }
    },

    /**
     * Signals to the Login Component to login
     */
    startLogin(): void {
      self.showLogin = true;
    },

    stopLogin(): void {
      self.showLogin = false;
    },

    logout: flow(function*() {
      const appEnv = getEnv<AppStoreEnv>(self);
      self.isLoggedIn = false;
      self.showLogin = false;

      if (!appEnv.sendNgntStore.showTransfer) {
        if (appEnv.walletProvider?.close) {
          try {
            yield appEnv.walletProvider.close();
          } catch (err) {
            Sentry.captureException(err);
          }
        }
        appEnv.web3 = null;
        appEnv.walletProvider = null;
        appEnv.sendNgntStore.cancelTransfer();
      }
    }),
  }));

export type WalletModelType = Instance<typeof WalletModel>;
