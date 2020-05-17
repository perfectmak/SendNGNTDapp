import Web3 from 'web3';
import axios from 'axios';
import { Web3Window, EtherchainPriceResponse } from './types';

export const asWeb3Window = (window: Window): Web3Window =>
  (window as unknown) as Web3Window;

export const getDefaultWeb3 = (): Web3 =>
  new Web3('https://mainnet.infura.io/v3/346683994cea49a584a096de6ed48452');

export const isAddress = (address: string): boolean =>
  Web3.utils.isAddress(address);

export const getEnsAddress = async (name: string): Promise<string | null> => {
  try {
    return await getDefaultWeb3().eth.ens.getAddress(name);
  } catch (err) {
    return null;
  }
};

/**
 * Tries to get the fastest current gasPrice on mainnet
 * using etherchain
 *
 */
export const getGasPrice = async (): Promise<string | undefined> => {
  try {
    const priceData = await axios.get<EtherchainPriceResponse>(
      'https://www.etherchain.org/api/gasPriceOracle'
    );
    return Web3.utils.toWei(priceData.data.fast, 'gwei');
  } catch (err) {
    // don't do anything, we revert to default price
    // by returning undefined
  }

  return undefined;
};