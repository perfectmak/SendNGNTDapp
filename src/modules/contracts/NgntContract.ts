/* eslint-disable import/no-unresolved */
/* tslint:disable */
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { web3 as gsnWeb3 } from '@openzeppelin/gsn-provider';
import { Ngnt } from './generated/Ngnt.d';
import { NGNT_ADDRESS } from './constants';
import ngntAbi from './abi/Ngnt.json';

/**
 * Get an Ngnt Contract instance from the Web3 object.
 *
 * Also the Web3 provider is swapped for the gsn provider.
 */
export const getNgntContract = (web3: Web3): Ngnt => {
  gsnWeb3.setGSN(web3);

  const abi = ngntAbi as AbiItem[];
  const contract = new web3.eth.Contract(abi, NGNT_ADDRESS);
  return contract;
};
