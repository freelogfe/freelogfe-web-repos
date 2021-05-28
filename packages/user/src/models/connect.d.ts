import {UserModelState} from './user';
import {WalletPageModelState} from './walletPage';

export {
  UserModelState,
  WalletPageModelState,
}

export interface ConnectState {
  user: UserModelState;
  walletPage: WalletPageModelState;
}
