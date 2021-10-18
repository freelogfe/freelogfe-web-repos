import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { successMessage } from '@/pages/logged/wallet';
import fMessage from '@/components/fMessage';

export interface WalletPageModelState {
  userID: number;
  userPhone: string;
  userEmail: string;
  accountStatus: -1 | 0 | 1 | 2; // 0:未激活 1:正常 2:冻结
  // accountStatus: 'initial' | 'inactive' | 'active' | 'freeze';
  accountId: string;
  accountBalance: number;
  transactionRecord: {
    serialNo: string;
    date: string;
    time: string;
    digest: string;
    reciprocalAccountId: string;
    reciprocalAccountName: string;
    reciprocalAccountType: string;
    transactionAmount: string;
    afterBalance: string;
    status: 1 | 2 | 3 | 4; // 1:交易确认中 2:交易成功 3:交易取消 4:交易失败
  }[];

  activatingAccount: boolean;
  activatingAccountMobile: string;
  activatingAccountEmail: string;
  activatingAccountType: 'phone' | 'email';
  activatingAccountCaptcha: string;
  activatingAccountCaptchaError: string;
  activatingAccountSentCaptchaWait: number;
  activatingAccountPasswordOne: string;
  activatingAccountPasswordOneError: string;
  activatingAccountPasswordTwo: string;
  activatingAccountPasswordTwoError: string;

  changingPassword_CaptchaModal_Visible: boolean;
  changingPassword_CaptchaModal_Phone: string;
  changingPassword_CaptchaModal_Email: string;
  changingPassword_CaptchaModal_TypeCheckbox: 'phone' | 'email';
  changingPassword_CaptchaModal_CaptchaInput: string;
  changingPassword_CaptchaModal_SentCaptchaWait: number;
  changingPassword_CaptchaModal_CaptchaError: string;

  changingPassword_OldPasswordModal_Visible: boolean;
  changingPassword_OldPasswordModal_PasswordInput: string;
  // changingPassword_OldPasswordModal_PasswordInputError: string;

  changingPassword_NewPasswordModal_Visible: boolean;
  changingPassword_NewPasswordModal_Password1: string;
  changingPassword_NewPasswordModal_Password1Error: string;
  changingPassword_NewPasswordModal_Password2: string;
  changingPassword_NewPasswordModal_Password2Error: string;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'walletPage/change';
  payload: Partial<WalletPageModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'walletPage/onMountPage';
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'walletPage/onUnmountPage';
}

export interface OnClickActivateAccountBtnAction extends AnyAction {
  type: 'walletPage/onClickActivateAccountBtn';
}

export interface OnCancelActivateAccountModalAction extends AnyAction {
  type: 'walletPage/onCancelActivateAccountModal';
}

export interface OnChangeActivateAccountModeAction extends AnyAction {
  type: 'walletPage/onChangeActivateAccountMode';
  payload: {
    value: 'phone' | 'email';
  };
}

export interface OnChangeActivateAccountCaptchaInputAction extends AnyAction {
  type: 'walletPage/onChangeActivateAccountCaptchaInput';
  payload: {
    value: string;
  };
}

export interface OnClickActivateAccountCaptchaBtnAction extends AnyAction {
  type: 'walletPage/onClickActivateAccountCaptchaBtn';
}

export interface OnChangeActivatingAccountSentCaptchaWaitAction extends AnyAction {
  type: 'walletPage/onChangeActivatingAccountSentCaptchaWait';
  payload: {
    value: number;
  };
}

export interface OnChangeActivateAccountPassword1Action extends AnyAction {
  type: 'walletPage/onChangeActivateAccountPassword1';
  payload: {
    value: string;
  };
}

export interface OnBlurActivateAccountPassword1Action extends AnyAction {
  type: 'walletPage/onBlurActivateAccountPassword1';
}

export interface OnChangeActivateAccountPassword2Action extends AnyAction {
  type: 'walletPage/onChangeActivateAccountPassword2';
  payload: {
    value: string;
  };
}

export interface OnBlurActivateAccountPassword2Action extends AnyAction {
  type: 'walletPage/onBlurActivateAccountPassword2';
}

export interface OnClickActivateAccountConfirmBtnAction extends AnyAction {
  type: 'walletPage/onClickActivateAccountConfirmBtn';
}

export interface OnClick_ChangingPasswordBtn_Action extends AnyAction {
  type: 'walletPage/onClick_ChangingPasswordBtn';
}

export interface OnCancel_ChangingPassword_CaptchaModal_Action extends AnyAction {
  type: 'walletPage/onCancel_ChangingPassword_CaptchaModal';
}

export interface OnChange_ChangingPassword_CaptchaModal_TypeCheckbox_Action extends AnyAction {
  type: 'walletPage/onChange_ChangingPassword_CaptchaModal_TypeCheckbox';
  payload: {
    value: 'phone' | 'email';
  };
}

export interface OnChange_ChangingPassword_CaptchaModal_CaptchaInput_Action extends AnyAction {
  type: 'walletPage/onChange_ChangingPassword_CaptchaModal_CaptchaInput';
  payload: {
    value: string;
  };
}

export interface OnClick_ChangingPassword_CaptchaModal_SendBtn_Action extends AnyAction {
  type: 'walletPage/onClick_ChangingPassword_CaptchaModal_SendBtn';
}

export interface OnChange_ChangingPassword_CaptchaModal_SentCaptchaWait_Action extends AnyAction {
  type: 'walletPage/onChange_ChangingPassword_CaptchaModal_SentCaptchaWait';
  payload: {
    value: number;
  };
}

export interface OnClick_ChangingPassword_CaptchaModal_NextBtn_Action extends AnyAction {
  type: 'walletPage/onClick_ChangingPassword_CaptchaModal_NextBtn';
}

export interface OnCancel_ChangingPassword_OldPasswordModal_Action extends AnyAction {
  type: 'walletPage/onCancel_ChangingPassword_OldPasswordModal';
}

export interface OnChange_ChangingPassword_OldPasswordModal_PasswordInput_Action extends AnyAction {
  type: 'walletPage/onChange_ChangingPassword_OldPasswordModal_PasswordInput';
  payload: {
    value: string;
  };
}

export interface OnClick_ChangingPassword_OldPasswordModal_NextBtn_Action extends AnyAction {
  type: 'walletPage/onClick_ChangingPassword_OldPasswordModal_NextBtn';
}

export interface OnCancel_ChangingPassword_NewPasswordModal_Action extends AnyAction {
  type: 'walletPage/onCancel_ChangingPassword_NewPasswordModal';
}

export interface OnChange_ChangingPassword_NewPasswordModal_Password1_Action extends AnyAction {
  type: 'walletPage/onChange_ChangingPassword_NewPasswordModal_Password1Input';
  payload: {
    value: string;
  };
}

export interface OnBlur_ChangingPassword_NewPasswordModal_Password1Input_Action extends AnyAction {
  type: 'walletPage/onBlur_ChangingPassword_NewPasswordModal_Password1Input';
}

export interface OnChange_ChangingPassword_NewPasswordModal_Password2Input_Action extends AnyAction {
  type: 'walletPage/onChange_ChangingPassword_NewPasswordModal_Password2Input';
  payload: {
    value: string;
  };
}

export interface OnBlur_ChangingPassword_NewPasswordModal_Password2Input_Action extends AnyAction {
  type: 'walletPage/onBlur_ChangingPassword_NewPasswordModal_Password2Input';
}

export interface OnClick_ChangingPassword_NewPasswordModal_ConfirmBtn_Action extends AnyAction {
  type: 'walletPage/onClick_ChangingPassword_NewPasswordModal_ConfirmBtn';
}

interface WalletPageModelType {
  namespace: 'walletPage';
  state: WalletPageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;

    onClickActivateAccountBtn: (action: OnClickActivateAccountBtnAction, effects: EffectsCommandMap) => void;
    onCancelActivateAccountModal: (action: OnCancelActivateAccountModalAction, effects: EffectsCommandMap) => void;
    onChangeActivateAccountMode: (action: OnChangeActivateAccountModeAction, effects: EffectsCommandMap) => void;
    onChangeActivateAccountCaptchaInput: (action: OnChangeActivateAccountCaptchaInputAction, effects: EffectsCommandMap) => void;
    onClickActivateAccountCaptchaBtn: (action: OnClickActivateAccountCaptchaBtnAction, effects: EffectsCommandMap) => void;
    onChangeActivatingAccountSentCaptchaWait: (action: OnChangeActivatingAccountSentCaptchaWaitAction, effects: EffectsCommandMap) => void;
    onChangeActivateAccountPassword1: (action: OnChangeActivateAccountPassword1Action, effects: EffectsCommandMap) => void;
    onBlurActivateAccountPassword1: (action: OnBlurActivateAccountPassword1Action, effects: EffectsCommandMap) => void;
    onChangeActivateAccountPassword2: (action: OnChangeActivateAccountPassword2Action, effects: EffectsCommandMap) => void;
    onBlurActivateAccountPassword2: (action: OnBlurActivateAccountPassword2Action, effects: EffectsCommandMap) => void;
    onClickActivateAccountConfirmBtn: (action: OnClickActivateAccountConfirmBtnAction, effects: EffectsCommandMap) => void;

    onClick_ChangingPasswordBtn: (action: OnClick_ChangingPasswordBtn_Action, effects: EffectsCommandMap) => void;

    onCancel_ChangingPassword_CaptchaModal: (action: OnCancel_ChangingPassword_CaptchaModal_Action, effects: EffectsCommandMap) => void;
    onChange_ChangingPassword_CaptchaModal_TypeCheckbox: (action: OnChange_ChangingPassword_CaptchaModal_TypeCheckbox_Action, effects: EffectsCommandMap) => void;
    onChange_ChangingPassword_CaptchaModal_CaptchaInput: (action: OnChange_ChangingPassword_CaptchaModal_CaptchaInput_Action, effects: EffectsCommandMap) => void;
    onClick_ChangingPassword_CaptchaModal_SendBtn: (action: OnClick_ChangingPassword_CaptchaModal_SendBtn_Action, effects: EffectsCommandMap) => void;
    onChange_ChangingPassword_CaptchaModal_SentCaptchaWait: (action: OnChange_ChangingPassword_CaptchaModal_SentCaptchaWait_Action, effects: EffectsCommandMap) => void;
    onClick_ChangingPassword_CaptchaModal_NextBtn: (action: OnClick_ChangingPassword_CaptchaModal_NextBtn_Action, effects: EffectsCommandMap) => void;

    onCancel_ChangingPassword_OldPasswordModal: (action: OnCancel_ChangingPassword_OldPasswordModal_Action, effects: EffectsCommandMap) => void;
    onChange_ChangingPassword_OldPasswordModal_PasswordInput: (action: OnChange_ChangingPassword_OldPasswordModal_PasswordInput_Action, effects: EffectsCommandMap) => void;
    onClick_ChangingPassword_OldPasswordModal_NextBtn: (action: OnClick_ChangingPassword_OldPasswordModal_NextBtn_Action, effects: EffectsCommandMap) => void;

    onCancel_ChangingPassword_NewPasswordModal: (action: OnCancel_ChangingPassword_NewPasswordModal_Action, effects: EffectsCommandMap) => void;
    onChange_ChangingPassword_NewPasswordModal_Password1Input: (action: OnChange_ChangingPassword_NewPasswordModal_Password1_Action, effects: EffectsCommandMap) => void;
    onBlur_ChangingPassword_NewPasswordModal_Password1Input: (action: OnBlur_ChangingPassword_NewPasswordModal_Password1Input_Action, effects: EffectsCommandMap) => void;
    onChange_ChangingPassword_NewPasswordModal_Password2Input: (action: OnChange_ChangingPassword_NewPasswordModal_Password2Input_Action, effects: EffectsCommandMap) => void;
    onBlur_ChangingPassword_NewPasswordModal_Password2Input: (action: OnBlur_ChangingPassword_NewPasswordModal_Password2Input_Action, effects: EffectsCommandMap) => void;
    onClick_ChangingPassword_NewPasswordModal_ConfirmBtn: (action: OnClick_ChangingPassword_NewPasswordModal_ConfirmBtn_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<WalletPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const activatingAccountInitStates: Pick<WalletPageModelState,
  'activatingAccount'
  | 'activatingAccountMobile'
  | 'activatingAccountEmail'
  | 'activatingAccountType'
  | 'activatingAccountCaptcha'
  | 'activatingAccountCaptchaError'
  | 'activatingAccountSentCaptchaWait'
  | 'activatingAccountPasswordOne'
  | 'activatingAccountPasswordOneError'
  | 'activatingAccountPasswordTwo'
  | 'activatingAccountPasswordTwoError'> = {
  activatingAccount: false,
  activatingAccountMobile: '',
  activatingAccountEmail: '',
  activatingAccountType: 'phone',
  activatingAccountCaptcha: '',
  activatingAccountCaptchaError: '',
  activatingAccountSentCaptchaWait: 0,
  activatingAccountPasswordOne: '',
  activatingAccountPasswordOneError: '',
  activatingAccountPasswordTwo: '',
  activatingAccountPasswordTwoError: '',
};

const changingPasswordInitStates: Pick<WalletPageModelState,
  'changingPassword_CaptchaModal_Visible' |
  'changingPassword_CaptchaModal_Phone' |
  'changingPassword_CaptchaModal_Email' |
  'changingPassword_CaptchaModal_TypeCheckbox' |
  'changingPassword_CaptchaModal_CaptchaInput' |
  'changingPassword_CaptchaModal_SentCaptchaWait' |
  'changingPassword_CaptchaModal_CaptchaError' |

  'changingPassword_OldPasswordModal_Visible' |
  'changingPassword_OldPasswordModal_PasswordInput' |
  // 'changingPassword_OldPasswordModal_PasswordInputError' |

  'changingPassword_NewPasswordModal_Visible' |
  'changingPassword_NewPasswordModal_Password1' |
  'changingPassword_NewPasswordModal_Password1Error' |
  'changingPassword_NewPasswordModal_Password2' |
  'changingPassword_NewPasswordModal_Password2Error'> = {
  changingPassword_CaptchaModal_Visible: false,
  changingPassword_CaptchaModal_Phone: '',
  changingPassword_CaptchaModal_Email: '',
  changingPassword_CaptchaModal_TypeCheckbox: 'phone',
  changingPassword_CaptchaModal_CaptchaInput: '',
  changingPassword_CaptchaModal_SentCaptchaWait: 0,
  changingPassword_CaptchaModal_CaptchaError: '',

  changingPassword_OldPasswordModal_Visible: false,
  changingPassword_OldPasswordModal_PasswordInput: '',
  // changingPassword_OldPasswordModal_PasswordInputError: '',

  changingPassword_NewPasswordModal_Visible: false,
  changingPassword_NewPasswordModal_Password1: '',
  changingPassword_NewPasswordModal_Password1Error: '',
  changingPassword_NewPasswordModal_Password2: '',
  changingPassword_NewPasswordModal_Password2Error: '',
};

const initStates: WalletPageModelState = {
  userID: -1,
  userPhone: '',
  userEmail: '',
  accountStatus: -1,
  accountId: '',
  accountBalance: -1,
  transactionRecord: [],

  ...activatingAccountInitStates,

  ...changingPasswordInitStates,
};

const Model: WalletPageModelType = {
  namespace: 'walletPage',
  state: initStates,
  effects: {
    * onMountPage({}: OnMountPageAction, { call, put }: EffectsCommandMap) {
      const { data: data1 } = yield call(FServiceAPI.User.currentUserInfo);
      const params: Parameters<typeof FServiceAPI.Transaction.individualAccounts>[0] = {
        userId: data1.userId,
      };
      const { data } = yield call(FServiceAPI.Transaction.individualAccounts, params);

      let transactionRecord = [];
      if (data.status !== 0) {
        const params2: Parameters<typeof FServiceAPI.Transaction.details>[0] = {
          accountId: data.accountId,
          skip: 0,
          limit: 100,
        };

        const { data: data2 } = yield call(FServiceAPI.Transaction.details, params2);
        transactionRecord = data2.dataList;
      }

      // console.log(data1.email, 'data1.emaildata1.email111');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          userID: data1.userId,
          userEmail: data1.email,
          userPhone: data1.mobile,
          accountStatus: data.status,
          accountBalance: data.balance,
          transactionRecord: transactionRecord.map((dl: any) => {
            const [date, time] = FUtil.Format.formatDateTime(dl.updateDate, true).split(' ');
            return {
              serialNo: dl.serialNo,
              date: date,
              time: time,
              digest: dl.digest,
              reciprocalAccountId: dl.reciprocalAccountId,
              reciprocalAccountName: dl.reciprocalAccountName,
              reciprocalAccountType: dl.reciprocalAccountType,
              transactionAmount: dl.transactionAmount,
              afterBalance: dl.afterBalance,
              status: dl.status,
            };
          }),
        },
      });
    },
    * onUnmountPage({}: OnUnmountPageAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * onClickActivateAccountBtn(action: OnClickActivateAccountBtnAction, { select, put }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          activatingAccount: true,
          activatingAccountMobile: walletPage.userPhone,
          activatingAccountEmail: walletPage.userEmail,
          activatingAccountType: walletPage.userEmail ? 'email' : 'phone',
        },
      });
    },
    * onCancelActivateAccountModal(action: OnCancelActivateAccountModalAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...activatingAccountInitStates,
        },
      });
    },
    * onChangeActivateAccountMode({ payload }: OnChangeActivateAccountModeAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          activatingAccountType: payload.value,
        },
      });
    },
    * onChangeActivateAccountCaptchaInput({ payload }: OnChangeActivateAccountCaptchaInputAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          activatingAccountCaptcha: payload.value,
        },
      });
    },
    * onClickActivateAccountCaptchaBtn(action: OnClickActivateAccountCaptchaBtnAction, {
      select,
      put,
      call,
    }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          activatingAccountSentCaptchaWait: 60,
        },
      });

      const params: Parameters<typeof FServiceAPI.Captcha.sendVerificationCode>[0] = {
        loginName: walletPage.activatingAccountType === 'email' ? walletPage.activatingAccountEmail : walletPage.activatingAccountMobile,
        authCodeType: 'activateTransactionAccount',
      };
      const { data, msg } = yield call(FServiceAPI.Captcha.sendVerificationCode, params);
      if (data) {
        return;
      }
      fMessage(msg, 'error');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          activatingAccountSentCaptchaWait: 0,
        },
      });
    },
    * onChangeActivatingAccountSentCaptchaWait({ payload }: OnChangeActivatingAccountSentCaptchaWaitAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          activatingAccountSentCaptchaWait: payload.value,
        },
      });
    },
    * onChangeActivateAccountPassword1({ payload }: OnChangeActivateAccountPassword1Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          activatingAccountPasswordOne: payload.value,
        },
      });
    },
    * onBlurActivateAccountPassword1(action: OnBlurActivateAccountPassword1Action, { select, put }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));

      yield put({
        type: 'change',
        payload: {
          activatingAccountPasswordOneError: FUtil.Regexp.PAY_PASSWORD.test(walletPage.activatingAccountPasswordOne) ? '' : '必须为6为数字',
          activatingAccountPasswordTwoError: (walletPage.activatingAccountPasswordTwo && walletPage.activatingAccountPasswordOne !== walletPage.activatingAccountPasswordTwo) ? '两次密码必须一致' : '',
        },
      });
    },
    * onChangeActivateAccountPassword2({ payload }: OnChangeActivateAccountPassword2Action, { put }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          activatingAccountPasswordTwo: payload.value,
        },
      });
    },
    * onBlurActivateAccountPassword2({}: OnBlurActivateAccountPassword2Action, { select, put }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          activatingAccountPasswordTwoError: walletPage.activatingAccountPasswordTwo === walletPage.activatingAccountPasswordOne ? '' : '两次密码必须一致',
        },
      });
    },
    * onClickActivateAccountConfirmBtn(action: OnClickActivateAccountConfirmBtnAction, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));

      const params: Parameters<typeof FServiceAPI.Transaction.activateIndividualAccounts>[0] = {
        password: walletPage.activatingAccountPasswordOne,
        authCode: walletPage.activatingAccountCaptcha,
        messageAddress: walletPage.activatingAccountType === 'phone' ? walletPage.activatingAccountMobile : walletPage.activatingAccountEmail,
      };

      const { data, msg, errCode, errcode } = yield call(FServiceAPI.Transaction.activateIndividualAccounts, params);

      if (errCode !== 0 || errcode !== 0) {
        return fMessage(msg, 'error');
      }

      const params1: Parameters<typeof FServiceAPI.Transaction.individualAccounts>[0] = {
        userId: walletPage.userID,
      };
      const { data: data1 } = yield call(FServiceAPI.Transaction.individualAccounts, params1);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...activatingAccountInitStates,
          accountStatus: data1.status,
          accountBalance: data1.balance,
        },
      });
    },
    * onClick_ChangingPasswordBtn({}: OnClick_ChangingPasswordBtn_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPassword_CaptchaModal_Visible: true,
          changingPassword_CaptchaModal_Phone: walletPage.userPhone,
          changingPassword_CaptchaModal_Email: walletPage.userEmail,
          changingPassword_CaptchaModal_TypeCheckbox: walletPage.userPhone ? 'phone' : 'email',
        },
      });
    },
    * onCancel_ChangingPassword_CaptchaModal(action: OnCancel_ChangingPassword_CaptchaModal_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...changingPasswordInitStates,
        },
      });
    },
    * onChange_ChangingPassword_CaptchaModal_TypeCheckbox({ payload }: OnChange_ChangingPassword_CaptchaModal_TypeCheckbox_Action, { put }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPassword_CaptchaModal_TypeCheckbox: payload.value,
        },
      });
    },
    * onChange_ChangingPassword_CaptchaModal_CaptchaInput({ payload }: OnChange_ChangingPassword_CaptchaModal_CaptchaInput_Action, { put }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPassword_CaptchaModal_CaptchaInput: payload.value,
        },
      });
    },
    * onClick_ChangingPassword_CaptchaModal_SendBtn(action: OnClick_ChangingPassword_CaptchaModal_SendBtn_Action, {
      select,
      put,
      call,
    }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPassword_CaptchaModal_SentCaptchaWait: 60,
        },
      });

      const params: Parameters<typeof FServiceAPI.Captcha.sendVerificationCode>[0] = {
        loginName: walletPage.changingPassword_CaptchaModal_TypeCheckbox === 'email' ? walletPage.changingPassword_CaptchaModal_Email : walletPage.changingPassword_CaptchaModal_Phone,
        authCodeType: 'updateTransactionAccountPwd',
      };
      const { data, msg } = yield call(FServiceAPI.Captcha.sendVerificationCode, params);
      if (data) {
        return;
      }
      fMessage(msg, 'error');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPassword_CaptchaModal_SentCaptchaWait: 0,
        },
      });
    },
    * onChange_ChangingPassword_CaptchaModal_SentCaptchaWait({ payload }: OnChange_ChangingPassword_CaptchaModal_SentCaptchaWait_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPassword_CaptchaModal_SentCaptchaWait: payload.value,
        },
      });
    },
    * onClick_ChangingPassword_CaptchaModal_NextBtn({}: OnClick_ChangingPassword_CaptchaModal_NextBtn_Action, {}: EffectsCommandMap) {

    },
    * onCancel_ChangingPassword_OldPasswordModal({}: OnCancel_ChangingPassword_OldPasswordModal_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPassword_OldPasswordModal_Visible: false,
        },
      });
    },
    * onChange_ChangingPassword_OldPasswordModal_PasswordInput({ payload }: OnChange_ChangingPassword_OldPasswordModal_PasswordInput_Action, { put }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPassword_OldPasswordModal_PasswordInput: payload.value,
        },
      });
    },
    * onClick_ChangingPassword_OldPasswordModal_NextBtn({}: OnClick_ChangingPassword_OldPasswordModal_NextBtn_Action, {}: EffectsCommandMap) {

    },
    * onCancel_ChangingPassword_NewPasswordModal(action: OnCancel_ChangingPassword_NewPasswordModal_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: { changingPassword_NewPasswordModal_Visible: false },
      });
    },
    * onChange_ChangingPassword_NewPasswordModal_Password1Input({ payload }: OnChange_ChangingPassword_NewPasswordModal_Password1_Action, { put }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: { changingPassword_NewPasswordModal_Password1: payload.value },
      });
    },
    * onBlur_ChangingPassword_NewPasswordModal_Password1Input({ payload }: OnBlur_ChangingPassword_NewPasswordModal_Password1Input_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPassword_NewPasswordModal_Password1Error: FUtil.Regexp.PAY_PASSWORD.test(walletPage.changingPassword_NewPasswordModal_Password1) ? '' : '必须为6为数字',
          changingPassword_NewPasswordModal_Password2Error: (walletPage.changingPassword_NewPasswordModal_Password2 && walletPage.changingPassword_NewPasswordModal_Password1 !== walletPage.changingPassword_NewPasswordModal_Password2) ? '两次密码必须一致' : '',
        },
      });
    },
    * onChange_ChangingPassword_NewPasswordModal_Password2Input({ payload }: OnChange_ChangingPassword_NewPasswordModal_Password2Input_Action, { put }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPassword_NewPasswordModal_Password2: payload.value,
        },
      });
    },
    * onBlur_ChangingPassword_NewPasswordModal_Password2Input({}: OnBlur_ChangingPassword_NewPasswordModal_Password2Input_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPassword_NewPasswordModal_Password2Error: walletPage.changingPassword_NewPasswordModal_Password2 === walletPage.changingPassword_NewPasswordModal_Password1 ? '' : '两次密码必须一致',
        },
      });
    },
    * onClick_ChangingPassword_NewPasswordModal_ConfirmBtn(action: OnClick_ChangingPassword_NewPasswordModal_ConfirmBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));

      const params: Parameters<typeof FServiceAPI.Transaction.changePassword>[0] = {
        password: walletPage.changingPassword_NewPasswordModal_Password1,
        oldPassword: walletPage.changingPassword_OldPasswordModal_PasswordInput,
        authCode: walletPage.changingPassword_CaptchaModal_CaptchaInput,
        messageAddress: walletPage.changingPassword_CaptchaModal_TypeCheckbox === 'phone' ? walletPage.changingPassword_CaptchaModal_Phone : walletPage.changingPassword_CaptchaModal_Email,
      };

      const { errCode, data, msg } = yield call(FServiceAPI.Transaction.changePassword, params);

      if (errCode !== 0 || !data) {
        return fMessage(msg, 'error');
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...changingPasswordInitStates,
        },
      });

      successMessage();
    },
  },
  reducers: {
    change(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({}) {

    },
  },
};

export default Model;
