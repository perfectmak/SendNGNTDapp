/* eslint-disable no-param-reassign */
import ReactGA from 'react-ga';
import { types, flow, getEnv } from 'mobx-state-tree';
import { PromiEvent, TransactionReceipt } from 'web3-core';
import * as Sentry from '@sentry/browser';
import BigNumber from 'bignumber.js';
// eslint-disable-next-line import/no-cycle
import { AppStoreEnv } from '../../../types';
// eslint-disable-next-line import/no-cycle
import { TransferState } from './types';
import { getNgntContract } from '../../contracts/NgntContract';
import { toBaseUnit, fromBaseUnit, wait } from '../utils';
import {
  getDefaultWeb3,
  getEnsAddress,
  isAddress,
  getGasPrice,
} from '../../wallets/web3/util';

/**
 * Represents the state for the whole SendNgntPage
 *
 */
export const SendNgntModel = types
  .model('SendNgntModel', {
    // view states
    showLogin: types.optional(types.boolean, true),
    showConfirmation: types.optional(types.boolean, false),
    showTransfer: types.optional(types.boolean, false),
    // loading state
    preparingConfirmation: types.optional(types.boolean, false),
    preparingTransfer: types.optional(types.boolean, false),
    // error state
    recipientAddressError: types.optional(types.string, ''),
    transferError: types.optional(types.string, ''),
    // transfer information
    sendersAddress: types.optional(types.string, ''),
    recipientEnsName: types.optional(types.string, ''),
    recipientAddress: types.optional(types.string, ''),
    transferAmount: types.optional(types.string, '0'),
    transferFees: types.optional(types.string, ''),
    sendersBalance: types.optional(types.string, '0'),
    // transfer state
    transferState: types.optional(
      types.enumeration(Object.keys(TransferState)),
      TransferState.SIGN_TX
    ),
    transactionHash: types.optional(types.string, ''),
    // specially set to true to continue transactionWatch
    triggerTransactionWatch: types.optional(types.boolean, false),
  })
  /**
   * When mst-persist restores the state of this store after a page reload, this
   * ensures that we continue watching any transfers pending confirmation.
   *
   * Else, it resets the state of this store.
   */
  .preProcessSnapshot(snapshot => {
    if (snapshot.showTransfer) {
      if (snapshot.transferState === TransferState.SUBMITTING_TX) {
        // transaction is actually submitted here, so
        snapshot.transferState = TransferState.AWAITING_CONFIRMATION;
      }

      if (snapshot.transferState === TransferState.AWAITING_CONFIRMATION) {
        if (!snapshot.transferError) {
          snapshot.triggerTransactionWatch = true;
        }
      } else {
        // reset snapshot state
        snapshot.transferAmount = '';
        snapshot.transferFees = '';
        snapshot.recipientAddress = '';
        snapshot.recipientEnsName = '';
        snapshot.sendersAddress = '';
        snapshot.showLogin = true;
        snapshot.showConfirmation = false;
        snapshot.showTransfer = false;
        snapshot.preparingConfirmation = false;
        snapshot.transactionHash = '';
        snapshot.transferError = '';
        snapshot.triggerTransactionWatch = false;
      }
    }

    snapshot.preparingConfirmation = false;
    snapshot.preparingTransfer = false;
    snapshot.recipientAddressError = '';

    return snapshot;
  })
  .views(self => ({
    get totalTransferAmount(): string {
      return new BigNumber(self.transferAmount)
        .plus(self.transferFees)
        .toString();
    },
  }))
  .actions(self => ({
    prepareConfirmation: () => {
      self.preparingConfirmation = true;
    },

    stopPrepareConfirmation: () => {
      self.preparingConfirmation = false;
    },

    /**
     * Setup transfer information and await startTransfer() action
     *
     */
    confirmTransfer: flow(function*(
      recipientAddressOrEns: string,
      amount: string
    ) {
      const { walletStore, web3: walletProvider } = getEnv<AppStoreEnv>(self);
      self.recipientAddressError = '';
      self.preparingConfirmation = true;
      if (!walletProvider) {
        throw new Error(
          'Something went wrong. Please refresh your browser and try again.'
        );
      }

      const ngntContract = getNgntContract(walletProvider);

      if (!self.transferFees) {
        const transferFeesBase = yield ngntContract.methods.gsnFee().call();
        self.transferFees = fromBaseUnit(transferFeesBase).toFixed(2);
      }

      self.sendersAddress = walletStore.address;
      self.transferAmount = amount;

      if (isAddress(recipientAddressOrEns)) {
        self.recipientAddress = recipientAddressOrEns;
      } else {
        // try and resolve ens domain
        const ensAddress = yield getEnsAddress(recipientAddressOrEns);
        if (!ensAddress || !isAddress(ensAddress)) {
          self.preparingConfirmation = false;
          self.recipientAddressError = 'Not a valid address or ENS name';
          return;
        }
        self.recipientEnsName = recipientAddressOrEns;
        self.recipientAddress = ensAddress;
      }

      const usersBalanceBase = yield ngntContract.methods
        .balanceOf(self.sendersAddress)
        .call();
      self.sendersBalance = fromBaseUnit(usersBalanceBase).toFixed(2);

      self.showLogin = false;
      self.showConfirmation = true;
    }),

    cancelTransfer: (): void => {
      // reset all states
      self.transferAmount = '';
      self.transferFees = '';
      self.recipientAddress = '';
      self.recipientEnsName = '';
      self.sendersAddress = '';
      self.showLogin = true;
      self.showConfirmation = false;
      self.showTransfer = false;
      self.preparingConfirmation = false;
      self.transactionHash = '';
      self.transferError = '';
      self.triggerTransactionWatch = false;
    },

    startTransfer: flow(function*() {
      Sentry.configureScope(scope => {
        scope.setExtra('txHash', self.transactionHash);
      });
      self.showLogin = false;
      self.showConfirmation = true;
      self.preparingTransfer = true;
      self.transferState = TransferState.SIGN_TX;
      self.showTransfer = yield Promise.resolve(true);

      try {
        const { web3: walletProvider } = getEnv<AppStoreEnv>(self);
        if (!walletProvider) {
          throw new Error(
            'Something went wrong. Please refresh your browser and try again.'
          );
        }
        const ngntContract = getNgntContract(walletProvider);
        const baseTransferAmount = toBaseUnit(self.transferAmount);

        const txEvent: PromiEvent<number> = ngntContract.methods
          .transfer(self.recipientAddress, baseTransferAmount.toString())
          .send({
            from: self.sendersAddress,
            gasPrice: yield getGasPrice(),
          });

        self.transactionHash = yield new Promise((resolve, reject) => {
          txEvent.on('transactionHash', txHash => {
            ReactGA.event({
              category: 'general',
              action: 'transaction_submitted',
            });
            ReactGA.event({
              category: 'general',
              action: 'transaction_amount',
              value: baseTransferAmount.integerValue().toNumber(),
            });
            resolve(txHash);
          });

          txEvent.on('error', err => {
            reject(err);
          });
        });
        self.transferState = TransferState.SUBMITTING_TX;
        yield wait(1500); // dummy wait for better UX

        self.transferState = TransferState.AWAITING_CONFIRMATION;
        yield txEvent;
        self.transferState = TransferState.COMPLETED;

        ReactGA.event({
          category: 'general',
          action: 'successful_transaction_amount',
          value: baseTransferAmount.integerValue().toNumber(),
        });
        ReactGA.event({
          category: 'general',
          action: 'successful_transaction_submitted',
        });
      } catch (err) {
        // special error handling for trustwallet (and possibly other wallets)
        // because of provider re-submitting after relayer may have submitted
        if (err.message.includes('Failed to check for transaction receipt')) {
          self.triggerTransactionWatch = true;
        } else {
          Sentry.captureException(err);
          self.transferError = err.message;
        }
      }
    }),

    /**
     * Action to continue watching any pending transaction. Usually triggered by the
     * SendNgntPage after a page refresh.
     *
     */
    watchPendingTransaction: flow(function*() {
      Sentry.configureScope(scope => {
        scope.setUser({ id: self.sendersAddress.toLowerCase() });
        scope.setExtra('txHash', self.transactionHash);
      });

      self.triggerTransactionWatch = false;
      if (!self.transactionHash) {
        throw new Error('No transaction hash to watch');
      }

      const defaultWeb3 = getDefaultWeb3();
      const waitTimeMs = 2_000;
      const maxIterations = 150; // <- 2s * 150 == 5mins
      let currentIteration = 0;
      while (true) {
        currentIteration += 1;
        if (currentIteration > maxIterations) {
          self.transferError =
            'Transaction is taking too long to confirm. Note the transaction hash to track its state eventually.';
          break;
        }

        if (!self.transactionHash) {
          break;
        }

        const receipt: TransactionReceipt = yield defaultWeb3.eth.getTransactionReceipt(
          self.transactionHash
        );
        if (receipt) {
          if (!receipt.status) {
            self.transferError = 'Transaction failed';
          } else {
            ReactGA.event({
              category: 'general',
              action: 'successful_transaction_submitted',
            });
            ReactGA.event({
              category: 'general',
              action: 'successful_transaction_amount',
              value: parseInt(self.transferAmount, 10),
            });
            self.transferState = TransferState.COMPLETED;
          }
          break;
        }
        yield wait(waitTimeMs);
      }
    }),
  }));
