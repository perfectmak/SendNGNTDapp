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

export const getTxUrl = (txHash: string): string =>
  `https://etherscan.io/tx/${txHash}`;

export const getAccountUrl = (address: string): string =>
  `https://etherscan.io/token/${NGNT_ADDRESS}?a=${address}`;

export const extractQrCodeAddress = (data: string): string | null => {
  const extractedAddress = data.replace('ethereum:', '').slice(0, 42);
  if (!/^0x[a-fA-F0-9]{40}$/g.test(extractedAddress)) {
    return null;
  }

  return extractedAddress;
};
