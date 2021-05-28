import {LoggedSiderModelState} from './loggedSider';
import {WalletPageModelState} from './walletPage';

export {
  LoggedSiderModelState,
  WalletPageModelState,
}

export interface ConnectState {
  loggedSider: LoggedSiderModelState;
  walletPage: WalletPageModelState;
}
