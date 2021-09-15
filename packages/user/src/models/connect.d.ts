import { UserModelState } from './user';
import { WalletPageModelState } from './walletPage';
import { LoginPageModelState } from './loginPage';
import { LogonPageModelState } from './logonPage';
import { RetrievePageModelState } from './retrievePage';
import { RetrievePayPasswordPageModelState } from './retrievePayPasswordPage';
import { SettingPageModelState } from './settingPage';

export {
  UserModelState,
  WalletPageModelState,
  LoginPageModelState,
  LogonPageModelState,
  RetrievePageModelState,
  RetrievePayPasswordPageModelState,
  SettingPageModelState,
};

export interface ConnectState {
  user: UserModelState;
  walletPage: WalletPageModelState;
  loginPage: LoginPageModelState;
  logonPage: LogonPageModelState;
  retrievePage: RetrievePageModelState;
  retrievePayPasswordPage: RetrievePayPasswordPageModelState;
  settingPage: SettingPageModelState;
}
