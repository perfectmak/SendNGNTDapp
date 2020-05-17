import { Web3Network, Web3NetworkCode } from './types';

export const isNetworkMainnet = (network: Web3Network): boolean =>
  network === Web3Network.Mainnet;

export const isNetworkTestnet = (network: Web3Network): boolean =>
  network !== Web3Network.Mainnet && network !== Web3Network.Truffle;

export const networkToCode = (network: Web3Network): Web3NetworkCode => {
  const map = {
    [Web3Network.Kovan]: Web3NetworkCode.Kovan,
    [Web3Network.Mainnet]: Web3NetworkCode.Mainnet,
    [Web3Network.Rinkeby]: Web3NetworkCode.Rinkeby,
    [Web3Network.Ropsten]: Web3NetworkCode.Ropsten,
    [Web3Network.Truffle]: Web3NetworkCode.Truffle,
    [Web3Network.Unknown]: Web3NetworkCode.Unknown,
  };

  if (!map[network]) {
    return Web3NetworkCode.Unknown;
  }

  return map[network];
};

export const codeToNetwork = (code: Web3NetworkCode): Web3Network => {
  const map = {
    [Web3NetworkCode.Kovan]: Web3Network.Kovan,
    [Web3NetworkCode.Mainnet]: Web3Network.Mainnet,
    [Web3NetworkCode.Rinkeby]: Web3Network.Rinkeby,
    [Web3NetworkCode.Ropsten]: Web3Network.Ropsten,
    [Web3NetworkCode.Truffle]: Web3Network.Truffle,
    [Web3NetworkCode.Unknown]: Web3Network.Unknown,
  };

  if (!map[code]) {
    return Web3Network.Unknown;
  }

  return map[code];
};

/**
 * Returns the network based on the environment
 * the application is running. For now, everything defaults to mainnet
 */
export const getEnvNetwork = (): Web3Network => {
  // TODO: Validate ETH_NETWORK is a valid Web3Network
  return (
    (process.env.REACT_APP_ETH_NETWORK as Web3Network) || Web3Network.Mainnet
  );
};
