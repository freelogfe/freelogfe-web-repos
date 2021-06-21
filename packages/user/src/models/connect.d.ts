import {UserModelState} from './user';
import {WalletPageModelState} from './walletPage';
import {LoginPageModelState} from './loginPage';
import {LogonPageModelState} from './logonPage';

export {
  UserModelState,
  WalletPageModelState,
  LoginPageModelState,
  LogonPageModelState,
}

export interface ConnectState {
  user: UserModelState;
  walletPage: WalletPageModelState;
  loginPage: LoginPageModelState;
  logonPage: LogonPageModelState;
}
