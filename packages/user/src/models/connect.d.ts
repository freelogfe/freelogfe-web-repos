import { GlobalModelState } from './global';
import { UserModelState } from './user';
import { WalletPageModelState } from './walletPage';
import { LoginPageModelState } from './loginPage';
import { LogonPageModelState } from './logonPage';
import { RetrievePageModelState } from './retrievePage';
import { RetrievePayPasswordPageModelState } from './retrievePayPasswordPage';
import { SettingPageModelState } from './settingPage';
import { ContractPageModelState } from './contractPage';
import { RewardPageModelState } from './rewardPage';

export {
  GlobalModelState,
  UserModelState,
  WalletPageModelState,
  LoginPageModelState,
  LogonPageModelState,
  RetrievePageModelState,
  RetrievePayPasswordPageModelState,
  SettingPageModelState,
  ContractPageModelState,
  RewardPageModelState,
};

export interface ConnectState {
  global: GlobalModelState;
  user: UserModelState;
  walletPage: WalletPageModelState;
  loginPage: LoginPageModelState;
  logonPage: LogonPageModelState;
  retrievePage: RetrievePageModelState;
  retrievePayPasswordPage: RetrievePayPasswordPageModelState;
  settingPage: SettingPageModelState;
  contractPage: ContractPageModelState;
  rewardPage: GlobalModelState;
}
