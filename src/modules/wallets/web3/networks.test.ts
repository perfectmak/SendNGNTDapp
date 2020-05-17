import { Web3Network } from './types';
import { isNetworkMainnet, isNetworkTestnet } from './networks';

describe('networks module', () => {
  describe('isNetworkMainnet', () => {
    it.each([
      [Web3Network.Mainnet, true],
      [Web3Network.Kovan, false],
      [Web3Network.Rinkeby, false],
      [Web3Network.Ropsten, false],
      [Web3Network.Truffle, false],
    ])('should return %s for %s', (network, expected) => {
      expect(isNetworkMainnet(network)).toEqual(expected);
    });
  });

  describe('isNetworkTestnet', () => {
    it.each([
      [Web3Network.Mainnet, false],
      [Web3Network.Kovan, true],
      [Web3Network.Rinkeby, true],
      [Web3Network.Ropsten, true],
      [Web3Network.Truffle, false],
    ])('should return %s for %s', (network, expected) => {
      expect(isNetworkTestnet(network)).toEqual(expected);
    });
  });
});
