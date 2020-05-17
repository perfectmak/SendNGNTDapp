import { useCallback } from 'react';
import Web3 from 'web3';
import { WalletModelType } from './state/WalletModels';
import { useAppStore } from '../../store';
import { DetectedWallet, Wallet } from './types';
import { asWeb3Window } from './web3/util';
import { Web3Window, ResolverConfig } from './web3/types';
import { ProviderResolvers } from './web3/providers';
import { codeToNetwork, getEnvNetwork } from './web3/networks';

/**
 * Returns a memoized function that triggers wallet login
 * and invokes the successCallback when user is logged in.
 *
 * It is always used to get a callback on every action that needs to
 * interact with a wallet provider.
 */
export const useLoggedInWalletStore = <T extends unknown[]>(
  successCallback: (provider: WalletModelType, ...args: T) => void,
  errorCallback?: (() => void) | null,
  deps: unknown[] = [],
  preCallback?: (() => void) | null
): (() => (() => void) | void) => {
  const { walletStore } = useAppStore();

  return useCallback(
    (...args: T) => {
      if (preCallback) {
        preCallback();
      }
      if (walletStore.isLoggedIn) {
        successCallback(walletStore, ...args);
      } else {
        walletStore.startLogin();
        const pollStoreState = (): void => {
          setTimeout((): void => {
            if (walletStore.isLoggedIn) {
              return successCallback(walletStore, ...args);
            }

            if (!walletStore.showLogin) {
              if (errorCallback) {
                errorCallback();
              }
              return undefined;
            }

            return pollStoreState();
          }, 500);
        };

        pollStoreState();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walletStore, successCallback, errorCallback, ...deps]
  );
};

/**
 * Try and get a detected wallet from injected provider.
 *
 */
export const detectBrowserWallet = (): DetectedWallet => {
  const web3Window = asWeb3Window(window);
  if (web3Window.ethereum || web3Window.web3) {
    if (web3Window.trust) {
      return DetectedWallet.Trust;
    }

    if (web3Window.ethereum?.isMetaMask) {
      return DetectedWallet.Metamask;
    }

    return DetectedWallet.Unknown;
  }

  return DetectedWallet.None;
};

export const resolveWalletProvider = async (
  window: Web3Window,
  config: ResolverConfig
): Promise<Wallet> => {
  const resolver = ProviderResolvers[config.provider];
  if (!resolver) {
    throw new Error('unsupported provider');
  }

  const provider = await resolver(window, config);
  const web3 = new Web3(provider);

  const accounts = await web3.eth.getAccounts();
  if (accounts.length === 0) {
    throw new Error('Please unlock your web3 account');
  }

  const networkId = await web3.eth.net.getId();
  const network = codeToNetwork(networkId);

  if (network !== getEnvNetwork()) {
    throw new Error(`Please switch your wallet network to ${getEnvNetwork()}`);
  }

  return {
    address: accounts[0],
    network,
    provider,
    web3,
  };
};
