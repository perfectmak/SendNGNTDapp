import React, { useState, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useSnackbar } from 'notistack';
import { asWeb3Window } from '../web3/util';
import { LoginModal, ProviderDisplayInfo } from '../components/LoginModal';
import { SupportedProvider } from '../web3/types';
import { useAppStore } from '../../../store';
import { detectBrowserWallet, resolveWalletProvider } from '../utils';
import { ProviderConfigMap } from '../web3/providers';
import { DetectedWallet } from '../types';
import FortmaticIcon from '../assets/fortmatic-icon.svg';
import MetaMaskIcon from '../assets/metamask-icon.svg';
import CoinbaseIcon from '../assets/coinbase-icon.svg';
import WalletConnectIcon from '../assets/walletconnect-icon.svg';
import TrustWalletIcon from '../assets/trustwallet-icon.svg';
import WalletIcon from '../assets/wallet-icon.svg';
import PortisIcon from '../assets/portis-icon.svg';
import TorusIcon from '../assets/torus-icon.png';

/**
 * Array of Wallet Providers to display in LoginModal.
 *
 */
const SupportedProvidersDisplayInfo: ProviderDisplayInfo[] = [
  {
    provider: SupportedProvider.WalletLink,
    icon: CoinbaseIcon,
    name: 'Coinbase Wallet',
  },
  {
    provider: SupportedProvider.WalletConnect,
    icon: WalletConnectIcon,
    name: 'Scan QR Code',
  },
  {
    provider: SupportedProvider.Fortmatic,
    icon: FortmaticIcon,
  },
  {
    provider: SupportedProvider.Portis,
    icon: PortisIcon,
  },
  {
    provider: SupportedProvider.Torus,
    icon: TorusIcon,
  },
];

const DetectedWalletIcons = {
  [DetectedWallet.Metamask]: MetaMaskIcon,
  [DetectedWallet.Trust]: TrustWalletIcon,
  [DetectedWallet.Unknown]: WalletIcon,
  [DetectedWallet.None]: MetaMaskIcon,
};

/**
 * Handles connecting to the user selected provider.
 * Note really and actual page, because it pops open a dialog
 * with options to select a wallet provider
 *
 */
export const LoginPage: React.FC = observer(() => {
  const { walletStore } = useAppStore();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [providersInfo, setProvidersInfo] = useState(
    SupportedProvidersDisplayInfo
  );

  useEffect(() => {
    const detectedWallet = detectBrowserWallet();
    if (detectedWallet === DetectedWallet.None) {
      return;
    }

    const isUnknown = detectedWallet === DetectedWallet.Unknown;
    setProvidersInfo([
      {
        provider: SupportedProvider.Injected,
        icon: DetectedWalletIcons[detectedWallet],
        name: isUnknown ? 'Browsers Wallet' : detectedWallet,
      },
      ...SupportedProvidersDisplayInfo,
    ]);
  }, []);

  const onProviderClicked = useCallback(
    async (supportedProvider: SupportedProvider) => {
      setLoading(true);
      try {
        const wallet = await resolveWalletProvider(
          asWeb3Window(window),
          ProviderConfigMap[supportedProvider]
        );
        walletStore.setWallet(wallet);
      } catch (err) {
        enqueueSnackbar(err.message);
        setLoading(false);
      }
    },
    [walletStore, enqueueSnackbar]
  );

  const onModalClosed = useCallback(() => {
    walletStore.stopLogin();
  }, [walletStore]);

  const Modal = (
    <LoginModal
      loading={loading}
      open={walletStore.showLogin}
      onClose={onModalClosed}
      onProviderClicked={onProviderClicked}
      providers={providersInfo}
    />
  );

  return Modal;
});

export default LoginPage;
