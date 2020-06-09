import BigNumber from 'bignumber.js';
import { NGNT_DECIMALS, NGNT_ADDRESS } from '../contracts/constants';

const baseFactor = (baseUnit: number): BigNumber =>
  new BigNumber(10).pow(baseUnit);

export const toBaseUnit = (
  value: BigNumber.Value,
  baseUnit = NGNT_DECIMALS
): BigNumber => new BigNumber(value).times(baseFactor(baseUnit));

export const fromBaseUnit = (
  baseValue: BigNumber.Value,
  baseUnit = NGNT_DECIMALS
): BigNumber => new BigNumber(baseValue).div(baseFactor(baseUnit));

export const wait = (ms = 1000): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

const explorerUrl = (network: string): string =>
  network === 'mainnet'
    ? 'https://etherscan.io'
    : `https://${network}.etherscan.io`;

export const getTxUrl = (txHash: string, network: string): string =>
  `${explorerUrl(network)}/tx/${txHash}`;

export const getAccountUrl = (address: string, network: string): string =>
  `${explorerUrl(network)}/token/${NGNT_ADDRESS}?a=${address}`;
