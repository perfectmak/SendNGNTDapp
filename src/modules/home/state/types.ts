import { Instance } from 'mobx-state-tree';
// eslint-disable-next-line import/no-cycle
import { SendNgntModel } from './SendNgntModel';

export type SendNgntModelType = Instance<typeof SendNgntModel>;

export enum TransferState {
  SIGN_TX = 'SIGN_TX',
  SUBMITTING_TX = 'SUBMITTING_TX',
  AWAITING_CONFIRMATION = 'AWAITING_CONFIRMATION',
  COMPLETED = 'COMPLETED',
}
