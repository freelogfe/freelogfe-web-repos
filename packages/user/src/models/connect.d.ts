import {UserModelState} from './user';
import {WalletPageModelState} from './walletPage';
import {LoginPageModelState} from './loginPage';

export {
  UserModelState,
  WalletPageModelState,
  LoginPageModelState,
}

export interface ConnectState {
  user: UserModelState;
  walletPage: WalletPageModelState;
  loginPage: LoginPageModelState;
}
