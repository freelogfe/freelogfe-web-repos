import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import { successMessage } from '@/pages/logged/wallet';
import fMessage from '@/components/fMessage';
import moment, { Moment } from 'moment';
import { listStateAndListMore } from '@/components/FListFooter';
import userPermission from '@/permissions/UserPermission';
import fConfirmModal from '@/components/fConfirmModal';
import { history } from 'umi';

// import FUtil1 from '@/utils';

export interface WalletPageModelState {
  userID: number;
  userPhone: string;
  userEmail: string;
  accountStatus: 'uninitialized' | 'inactive' | 'normal' | 'frozen'; // 0:未激活 1:正常 2:冻结
  // accountStatus: 'initial' | 'inactive' | 'active' | 'freeze';
  accountID: string;
  accountBalance: number;

  activating_VisibleModal: '' | 'captcha' | 'password';
  // activatingAccount: boolean;
  activating_AccountMobile: string;
  activating_AccountEmail: string;
  activating_AccountType: 'phone' | 'email';
  activating_Captcha: string;
  activating_CaptchaError: string;
  activating_SentCaptchaWait: number;
  activating_PasswordOne: string;
  activating_PasswordOneError: string;
  activating_PasswordTwo: string;
  activating_PasswordTwoError: string;

  changingPassword_CaptchaModal_Visible: boolean;
  changingPassword_CaptchaModal_Phone: string;
  changingPassword_CaptchaModal_Email: string;
  changingPassword_CaptchaModal_TypeCheckbox: 'phone' | 'email';
  changingPassword_CaptchaModal_CaptchaInput: string;
  changingPassword_CaptchaModal_SentCaptchaWait: number;
  changingPassword_CaptchaModal_CaptchaError: string;

  changingPassword_OldPasswordModal_Visible: boolean;
  changingPassword_OldPasswordModal_PasswordInput: string;

  changingPassword_NewPasswordModal_Visible: boolean;
  changingPassword_NewPasswordModal_Password1: string;
  changingPassword_NewPasswordModal_Password1Error: string;
  changingPassword_NewPasswordModal_Password2: string;
  changingPassword_NewPasswordModal_Password2Error: string;

  table_Filter_Date_Type: 'week' | 'month' | 'year' | 'custom';
  table_Filter_Date_Custom: [Moment, Moment] | null;
  table_Filter_Keywords: string;
  table_Filter_MinAmount: string;
  table_Filter_MaxAmount: string;
  table_Filter_StateOptions: { value: WalletPageModelState['table_Filter_StateSelected'], text: string }[];
  table_Filter_StateSelected: '0' | '1' | '2' | '3';
  table_TotalAmountExpenditure: number;
  table_TotalAmountIncome: number;
  table_DateSource: {
    serialNo: string;
    transactionRecordId: string;
    date: string;
    time: string;
    digest: string;
    contractID: string;
    reciprocalAccountId: string;
    reciprocalAccountName: string;
    reciprocalAccountType: string;
    transactionAmount: string;
    afterBalance: string;
    status: 1 | 2 | 3 | 4; // 1:交易确认中 2:交易成功 3:交易取消 4:交易失败
  }[];
  table_State: 'loading' | 'noData' | 'noSearchResult' | 'loaded';
  table_More: 'loading' | 'andMore' | 'noMore';
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

export interface OnClick_Activate_AccountBtn_Action extends AnyAction {
  type: 'walletPage/onClick_Activate_AccountBtn';
}

export interface OnCancel_Activate_CaptchaModal_Action extends AnyAction {
  type: 'walletPage/onCancel_Activate_CaptchaModal';
}

export interface OnChange_Activate_AccountMode_Action extends AnyAction {
  type: 'walletPage/onChange_Activate_AccountMode';
  payload: {
    value: 'phone' | 'email';
  };
}

export interface OnChange_Activate_CaptchaInput_Action extends AnyAction {
  type: 'walletPage/onChange_Activate_CaptchaInput';
  payload: {
    value: string;
  };
}

export interface OnClick_Activate_SentCaptchaBtn_Action extends AnyAction {
  type: 'walletPage/onClick_Activate_SentCaptchaBtn';
}

export interface OnChange_Activate_SentCaptchaWait_Action extends AnyAction {
  type: 'walletPage/onChange_Activate_SentCaptchaWait';
  payload: {
    value: number;
  };
}

export interface OnClick_Activate_NextBtn_Action extends AnyAction {
  type: 'walletPage/onClick_Activate_NextBtn';
}

export interface OnChange_Activate_Password1_Action extends AnyAction {
  type: 'walletPage/onChange_Activate_Password1';
  payload: {
    value: string;
  };
}

export interface OnBlur_Activate_Password1_Action extends AnyAction {
  type: 'walletPage/onBlur_Activate_Password1';
}

export interface OnChange_Activate_Password2_Action extends AnyAction {
  type: 'walletPage/onChange_Activate_Password2';
  payload: {
    value: string;
  };
}

export interface OnBlur_Activate_Password2_Action extends AnyAction {
  type: 'walletPage/onBlur_Activate_Password2';
}

export interface OnClick_Activate_ConfirmBtn_Action extends AnyAction {
  type: 'walletPage/onClick_Activate_ConfirmBtn';
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

export interface OnChange_Table_Filter_Date_Type_Action extends AnyAction {
  type: 'walletPage/onChange_Table_Filter_Date_Type';
  payload: {
    value: 'week' | 'month' | 'year';
  };
}

export interface OnChange_Table_Filter_Date_Custom_Action extends AnyAction {
  type: 'walletPage/onChange_Table_Filter_Date_Custom';
  payload: {
    value: WalletPageModelState['table_Filter_Date_Custom'];
  };
}

export interface OnChange_Table_Filter_Keywords_Action extends AnyAction {
  type: 'walletPage/onChange_Table_Filter_Keywords';
  payload: {
    value: WalletPageModelState['table_Filter_Keywords'];
  };
}

export interface OnChange_Table_Filter_MinAmount_Action extends AnyAction {
  type: 'walletPage/onChange_Table_Filter_MinAmount';
  payload: {
    value: WalletPageModelState['table_Filter_MinAmount'];
  };
}

export interface OnBlur_Table_Filter_MinAmount_Action extends AnyAction {
  type: 'walletPage/onBlur_Table_Filter_MinAmount';
}

export interface OnChange_Table_Filter_MaxAmount_Action extends AnyAction {
  type: 'walletPage/onChange_Table_Filter_MaxAmount';
  payload: {
    value: WalletPageModelState['table_Filter_MaxAmount'];
  };
}

export interface OnBlur_Table_Filter_MaxAmount_Action extends AnyAction {
  type: 'walletPage/onBlur_Table_Filter_MaxAmount';
}

export interface OnChange_Table_Filter_StateSelected_Action extends AnyAction {
  type: 'walletPage/onChange_Table_Filter_StateSelected';
  payload: {
    value: WalletPageModelState['table_Filter_StateSelected'];
  };
}

export interface OnClick_Table_Filter_ResetBtn_Action extends AnyAction {
  type: 'walletPage/onClick_Table_Filter_ResetBtn';
}

export interface OnClick_Table_Filter_SearchBtn_Action extends AnyAction {
  type: 'walletPage/onClick_Table_Filter_SearchBtn';
}

export interface OnClick_Table_LoadMoreBtn_Action extends AnyAction {
  type: 'walletPage/onClick_Table_LoadMoreBtn';
}

export interface Fetch_TableData_Action extends AnyAction {
  type: 'fetch_TableData';
  payload: {
    andMore: boolean;
  };
}

interface WalletPageModelType {
  namespace: 'walletPage';
  state: WalletPageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;

    onClick_Activate_AccountBtn: (action: OnClick_Activate_AccountBtn_Action, effects: EffectsCommandMap) => void;
    onCancel_Activate_CaptchaModal: (action: OnCancel_Activate_CaptchaModal_Action, effects: EffectsCommandMap) => void;
    onChange_Activate_AccountMode: (action: OnChange_Activate_AccountMode_Action, effects: EffectsCommandMap) => void;
    onChange_Activate_CaptchaInput: (action: OnChange_Activate_CaptchaInput_Action, effects: EffectsCommandMap) => void;
    onClick_Activate_SentCaptchaBtn: (action: OnClick_Activate_SentCaptchaBtn_Action, effects: EffectsCommandMap) => void;
    onChange_Activate_SentCaptchaWait: (action: OnChange_Activate_SentCaptchaWait_Action, effects: EffectsCommandMap) => void;
    onClick_Activate_NextBtn: (action: OnClick_Activate_NextBtn_Action, effects: EffectsCommandMap) => void;
    onChange_Activate_Password1: (action: OnChange_Activate_Password1_Action, effects: EffectsCommandMap) => void;
    onBlur_Activate_Password1: (action: OnBlur_Activate_Password1_Action, effects: EffectsCommandMap) => void;
    onChange_Activate_Password2: (action: OnChange_Activate_Password2_Action, effects: EffectsCommandMap) => void;
    onBlur_Activate_Password2: (action: OnBlur_Activate_Password2_Action, effects: EffectsCommandMap) => void;
    onClick_Activate_ConfirmBtn: (action: OnClick_Activate_ConfirmBtn_Action, effects: EffectsCommandMap) => void;

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

    onChange_Table_Filter_Date_Type: (action: OnChange_Table_Filter_Date_Type_Action, effects: EffectsCommandMap) => void;
    onChange_Table_Filter_Date_Custom: (action: OnChange_Table_Filter_Date_Custom_Action, effects: EffectsCommandMap) => void;
    onChange_Table_Filter_Keywords: (action: OnChange_Table_Filter_Keywords_Action, effects: EffectsCommandMap) => void;
    onChange_Table_Filter_MinAmount: (action: OnChange_Table_Filter_MinAmount_Action, effects: EffectsCommandMap) => void;
    onBlur_Table_Filter_MinAmount: (action: OnBlur_Table_Filter_MinAmount_Action, effects: EffectsCommandMap) => void;
    onChange_Table_Filter_MaxAmount: (action: OnChange_Table_Filter_MaxAmount_Action, effects: EffectsCommandMap) => void;
    onBlur_Table_Filter_MaxAmount: (action: OnBlur_Table_Filter_MaxAmount_Action, effects: EffectsCommandMap) => void;
    onChange_Table_Filter_StateSelected: (action: OnChange_Table_Filter_StateSelected_Action, effects: EffectsCommandMap) => void;
    onClick_Table_Filter_ResetBtn: (action: OnClick_Table_Filter_ResetBtn_Action, effects: EffectsCommandMap) => void;
    onClick_Table_Filter_SearchBtn: (action: OnClick_Table_Filter_SearchBtn_Action, effects: EffectsCommandMap) => void;
    onClick_Table_LoadMoreBtn: (action: OnClick_Table_LoadMoreBtn_Action, effects: EffectsCommandMap) => void;
    fetch_TableData: (action: Fetch_TableData_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<WalletPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const accountStatus: { [k: string]: WalletPageModelState['accountStatus'] } = {
  '0': 'inactive',
  '1': 'normal',
  '2': 'frozen',
};

const activatingAccountInitStates: Pick<WalletPageModelState,
  'activating_VisibleModal'
  | 'activating_AccountMobile'
  | 'activating_AccountEmail'
  | 'activating_AccountType'
  | 'activating_Captcha'
  | 'activating_CaptchaError'
  | 'activating_SentCaptchaWait'
  | 'activating_PasswordOne'
  | 'activating_PasswordOneError'
  | 'activating_PasswordTwo'
  | 'activating_PasswordTwoError'> = {
  activating_VisibleModal: '',
  activating_AccountMobile: '',
  activating_AccountEmail: '',
  activating_AccountType: 'phone',
  activating_Captcha: '',
  activating_CaptchaError: '',
  activating_SentCaptchaWait: 0,
  activating_PasswordOne: '',
  activating_PasswordOneError: '',
  activating_PasswordTwo: '',
  activating_PasswordTwoError: '',
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
  accountStatus: 'uninitialized',
  accountID: '',
  accountBalance: -1,
  // transactionRecord: [],

  ...activatingAccountInitStates,

  ...changingPasswordInitStates,

  table_Filter_Date_Type: 'month',
  table_Filter_Date_Custom: getStartAndEndDate('month'),
  table_Filter_Keywords: '',
  table_Filter_MinAmount: '',
  table_Filter_MaxAmount: '',
  table_Filter_StateOptions: [
    { value: '0', text: '全部' },
    { value: '1', text: '交易确认中' },
    { value: '2', text: '交易成功' },
    { value: '3', text: '交易关闭' },
  ],
  table_Filter_StateSelected: '0',
  table_TotalAmountExpenditure: 0,
  table_TotalAmountIncome: 0,
  table_DateSource: [],
  table_State: 'loading',
  table_More: 'loading',
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
      // console.log(data, 'data@#$@#$');
      // console.log(data1.email, 'data1.emaildata1.email111');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          userID: data1.userId,
          userEmail: data1.email,
          userPhone: data1.mobile,
          accountID: data.accountId,
          accountStatus: accountStatus[data.status],
          accountBalance: data.balance,
        },
      });

      if (data.status !== 0) {
        yield put<Fetch_TableData_Action>({
          type: 'fetch_TableData',
          payload: {
            andMore: false,
          },
        });
      }
    },
    * onUnmountPage({}: OnUnmountPageAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },

    * onClick_Activate_AccountBtn(action: OnClick_Activate_AccountBtn_Action, {
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
          activating_VisibleModal: 'captcha',
          activating_AccountMobile: walletPage.userPhone,
          activating_AccountEmail: walletPage.userEmail,
          activating_AccountType: walletPage.userEmail ? 'email' : 'phone',
        },
      });
    },
    * onCancel_Activate_CaptchaModal(action: OnCancel_Activate_CaptchaModal_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...activatingAccountInitStates,
        },
      });
    },
    * onChange_Activate_AccountMode({ payload }: OnChange_Activate_AccountMode_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          activating_AccountType: payload.value,
        },
      });
    },
    * onChange_Activate_CaptchaInput({ payload }: OnChange_Activate_CaptchaInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          activating_Captcha: payload.value,
        },
      });
    },
    * onClick_Activate_SentCaptchaBtn(action: OnClick_Activate_SentCaptchaBtn_Action, {
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
          activating_SentCaptchaWait: 60,
        },
      });

      const params: Parameters<typeof FServiceAPI.Captcha.sendVerificationCode>[0] = {
        loginName: walletPage.activating_AccountType === 'email' ? walletPage.activating_AccountEmail : walletPage.activating_AccountMobile,
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
          activating_SentCaptchaWait: 0,
        },
      });
    },
    * onChange_Activate_SentCaptchaWait({ payload }: OnChange_Activate_SentCaptchaWait_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          activating_SentCaptchaWait: payload.value,
        },
      });
    },
    * onClick_Activate_NextBtn({}: OnClick_Activate_NextBtn_Action, { select, call, put }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));

      if (!new RegExp(/^[0-9]*$/).test(walletPage.activating_Captcha)) {
        fMessage('验证码必须全部为数字', 'error');
        return;
      }

      const params: Parameters<typeof FServiceAPI.Captcha.verifyVerificationCode>[0] = {
        authCode: walletPage.activating_Captcha,
        address: walletPage.activating_AccountType === 'email' ? walletPage.activating_AccountEmail : walletPage.activating_AccountMobile,
        authCodeType: 'activateTransactionAccount',
      };

      const { data, errCode } = yield call(FServiceAPI.Captcha.verifyVerificationCode, params);

      if (errCode !== 0 || !data) {
        // return fMessage('验证码错误', 'error');
        return fMessage(FI18n.i18nNext.t('wrong_verified_code'), 'error');
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          activating_VisibleModal: 'password',
        },
      });
    },
    * onChange_Activate_Password1({ payload }: OnChange_Activate_Password1_Action, { put }: EffectsCommandMap) {
      // console.log(payload, 'payloadpayload234234234');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          activating_PasswordOne: payload.value,
        },
      });
    },
    * onBlur_Activate_Password1(action: OnBlur_Activate_Password1_Action, { select, put }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          activating_PasswordOneError: FUtil.Regexp.PAY_PASSWORD.test(walletPage.activating_PasswordOne) ? '' : '必须为6为数字',
          activating_PasswordTwoError: (walletPage.activating_PasswordTwo && walletPage.activating_PasswordOne !== walletPage.activating_PasswordTwo) ? '两次密码必须一致' : '',
        },
      });
    },
    * onChange_Activate_Password2({ payload }: OnChange_Activate_Password2_Action, { put }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          activating_PasswordTwo: payload.value,
        },
      });
    },
    * onBlur_Activate_Password2({}: OnBlur_Activate_Password2_Action, { select, put }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          activating_PasswordTwoError: walletPage.activating_PasswordTwo === walletPage.activating_PasswordOne ? '' : '两次密码必须一致',
        },
      });
    },
    * onClick_Activate_ConfirmBtn(action: OnClick_Activate_ConfirmBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));

      if (!new RegExp(/^[0-9]*$/).test(walletPage.activating_Captcha)) {
        fMessage('验证码必须全部为数字', 'error');
        return;
      }

      const params: Parameters<typeof FServiceAPI.Transaction.activateIndividualAccounts>[0] = {
        password: walletPage.activating_PasswordOne,
        authCode: walletPage.activating_Captcha,
        messageAddress: walletPage.activating_AccountType === 'phone' ? walletPage.activating_AccountMobile : walletPage.activating_AccountEmail,
      };

      const { data, msg, errCode } = yield call(FServiceAPI.Transaction.activateIndividualAccounts, params);

      if (errCode !== 0 || !data) {
        self._czc?.push(['_trackEvent', '个人中心页', '激活羽币账户', '', 0]);
        return fMessage(msg, 'error');
      }

      self._czc?.push(['_trackEvent', '个人中心页', '激活羽币账户', '', 1]);
      fMessage(FI18n.i18nNext.t('msg_feather_account_successfully_actived'));

      const params1: Parameters<typeof FServiceAPI.Transaction.individualAccounts>[0] = {
        userId: walletPage.userID,
      };
      const { data: data1 } = yield call(FServiceAPI.Transaction.individualAccounts, params1);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...activatingAccountInitStates,
          accountStatus: accountStatus[data1.status],
          accountBalance: data1.balance,
        },
      });

      yield put<Fetch_TableData_Action>({
        type: 'fetch_TableData',
        payload: {
          andMore: false,
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
    * onClick_ChangingPassword_CaptchaModal_NextBtn({}: OnClick_ChangingPassword_CaptchaModal_NextBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));

      if (!new RegExp(/^[0-9]*$/).test(walletPage.changingPassword_CaptchaModal_CaptchaInput)) {
        fMessage('验证码必须全部为数字', 'error');
        return;
      }

      const params: Parameters<typeof FServiceAPI.Captcha.verifyVerificationCode>[0] = {
        authCode: walletPage.changingPassword_CaptchaModal_CaptchaInput,
        address: walletPage.changingPassword_CaptchaModal_TypeCheckbox === 'email' ? walletPage.changingPassword_CaptchaModal_Email : walletPage.changingPassword_CaptchaModal_Phone,
        authCodeType: 'updateTransactionAccountPwd',
      };

      const { data, errCode } = yield call(FServiceAPI.Captcha.verifyVerificationCode, params);

      if (errCode !== 0 || !data) {
        // return fMessage('验证码错误', 'error');
        return fMessage(FI18n.i18nNext.t('wrong_verified_code'), 'error');
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPassword_CaptchaModal_Visible: false,
          changingPassword_OldPasswordModal_Visible: true,
        },
      });
    },
    * onCancel_ChangingPassword_OldPasswordModal({}: OnCancel_ChangingPassword_OldPasswordModal_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...changingPasswordInitStates,
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
    * onClick_ChangingPassword_OldPasswordModal_NextBtn({}: OnClick_ChangingPassword_OldPasswordModal_NextBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));

      const params: Parameters<typeof FServiceAPI.Transaction.verifyTransactionPassword>[0] = {
        password: walletPage.changingPassword_OldPasswordModal_PasswordInput,
      };

      const { data } = yield call(FServiceAPI.Transaction.verifyTransactionPassword, params);

      if (!data) {
        return fMessage(FI18n.i18nNext.t('alert_paymentpasswordincorrect'), 'error');
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPassword_OldPasswordModal_Visible: false,
          changingPassword_NewPasswordModal_Visible: true,
        },
      });
    },
    * onCancel_ChangingPassword_NewPasswordModal(action: OnCancel_ChangingPassword_NewPasswordModal_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...changingPasswordInitStates,
        },
      });
    },
    * onChange_ChangingPassword_NewPasswordModal_Password1Input({ payload }: OnChange_ChangingPassword_NewPasswordModal_Password1_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPassword_NewPasswordModal_Password1: payload.value,
        },
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
          changingPassword_NewPasswordModal_Password2Error: '',
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

      if (!new RegExp(/^[0-9]*$/).test(walletPage.changingPassword_CaptchaModal_CaptchaInput)) {
        fMessage('验证码必须全部为数字', 'error');
        return;
      }

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

    * onChange_Table_Filter_Date_Type({ payload }: OnChange_Table_Filter_Date_Type_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          table_Filter_Date_Type: payload.value,
          table_Filter_Date_Custom: getStartAndEndDate(payload.value),
        },
      });

    },
    * onChange_Table_Filter_Date_Custom({ payload }: OnChange_Table_Filter_Date_Custom_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          table_Filter_Date_Type: 'custom',
          table_Filter_Date_Custom: payload.value,
        },
      });
    },
    * onChange_Table_Filter_Keywords({ payload }: OnChange_Table_Filter_Keywords_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          table_Filter_Keywords: payload.value,
        },
      });
    },
    * onChange_Table_Filter_MinAmount({ payload }: OnChange_Table_Filter_MinAmount_Action, { put }: EffectsCommandMap) {
      // if (!FUtil.Regexp.NATURAL_NUMBER.test(payload.value)) {
      if (Number.isNaN(Number(payload.value))) {
        return;
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          table_Filter_MinAmount: payload.value,
        },
      });
    },
    * onBlur_Table_Filter_MinAmount({}: OnBlur_Table_Filter_MinAmount_Action, { select, put }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          table_Filter_MinAmount: walletPage.table_Filter_MinAmount === ''
            ? ''
            : String(Math.min(Math.max(0, Number(walletPage.table_Filter_MinAmount)), walletPage.table_Filter_MaxAmount !== '' ? Number(walletPage.table_Filter_MaxAmount) : Number.POSITIVE_INFINITY)),
        },
      });
    },
    * onChange_Table_Filter_MaxAmount({ payload }: OnChange_Table_Filter_MaxAmount_Action, { put }: EffectsCommandMap) {
      // if (!FUtil.Regexp.NATURAL_NUMBER.test(payload.value)) {
      if (Number.isNaN(Number(payload.value))) {
        return;
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          table_Filter_MaxAmount: payload.value,
        },
      });
    },
    * onBlur_Table_Filter_MaxAmount({}: OnBlur_Table_Filter_MaxAmount_Action, { select, put }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          table_Filter_MaxAmount: walletPage.table_Filter_MaxAmount === ''
            ? ''
            : String(Math.max(Number(walletPage.table_Filter_MaxAmount), walletPage.table_Filter_MinAmount !== '' ? Number(walletPage.table_Filter_MinAmount) : 0)),
        },
      });

    },
    * onChange_Table_Filter_StateSelected({ payload }: OnChange_Table_Filter_StateSelected_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          table_Filter_StateSelected: payload.value,
        },
      });
    },
    * onClick_Table_Filter_ResetBtn({}: OnClick_Table_Filter_ResetBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          table_Filter_Date_Type: 'month',
          table_Filter_Date_Custom: getStartAndEndDate('month'),
          table_Filter_Keywords: '',
          table_Filter_MinAmount: '',
          table_Filter_MaxAmount: '',
          table_Filter_StateSelected: '0',
        },
      });
    },
    * onClick_Table_Filter_SearchBtn({}: OnClick_Table_Filter_SearchBtn_Action, { put }: EffectsCommandMap) {
      yield put<Fetch_TableData_Action>({
        type: 'fetch_TableData',
        payload: {
          andMore: false,
        },
      });
    },
    * onClick_Table_LoadMoreBtn({}: OnClick_Table_LoadMoreBtn_Action, { put }: EffectsCommandMap) {
      yield put<Fetch_TableData_Action>({
        type: 'fetch_TableData',
        payload: {
          andMore: true,
        },
      });
    },
    * fetch_TableData({ payload }: Fetch_TableData_Action, { select, call, put }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));
      let table_DateSource: WalletPageModelState['table_DateSource'] = [];
      if (payload.andMore) {
        table_DateSource = [
          ...walletPage.table_DateSource,
        ];
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            table_More: 'loading',
          },
        });
      } else {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            table_State: 'loading',
          },
        });
      }

      const params2: Parameters<typeof FServiceAPI.Transaction.details>[0] = {
        accountId: walletPage.accountID,
        skip: table_DateSource.length,
        limit: FUtil.Predefined.pageSize,
        // limit: 5,
        startCreatedDate: walletPage.table_Filter_Date_Custom ? walletPage.table_Filter_Date_Custom[0].format(FUtil.Predefined.momentDateFormat) : undefined,
        endCreatedDate: walletPage.table_Filter_Date_Custom ? walletPage.table_Filter_Date_Custom[1].format(FUtil.Predefined.momentDateFormat) + ' 23:59:59' : undefined,
        amountStartPoint: walletPage.table_Filter_MinAmount === '' ? undefined : Number(walletPage.table_Filter_MinAmount),
        amountEndPoint: walletPage.table_Filter_MaxAmount === '' ? undefined : Number(walletPage.table_Filter_MaxAmount),
        status: walletPage.table_Filter_StateSelected === '0' ? undefined : Number(walletPage.table_Filter_StateSelected) as 1,
        keywords: walletPage.table_Filter_Keywords || undefined,
      };

      const { data: data2 } = yield call(FServiceAPI.Transaction.details, params2);

      table_DateSource = [
        ...table_DateSource,
        ...(data2?.dataList || []).map((dl: any) => {
          const [date, time] = FUtil.Format.formatDateTime(dl.updateDate, true).split(' ');
          return {
            serialNo: dl.serialNo,
            transactionRecordId: dl.transactionRecordId,
            date: date,
            time: time,
            digest: dl.digest,
            contractID: dl.attachInfo.contractId,
            reciprocalAccountId: dl.reciprocalAccountId,
            reciprocalAccountName: dl.reciprocalAccountName,
            reciprocalAccountType: dl.reciprocalAccountType,
            transactionAmount: dl.transactionAmount,
            afterBalance: dl.afterBalance,
            status: dl.status,
          };
        }),
      ];
      // console.log(data2, 'data2@$!@#$@3909uoiuoi');
      const { more, state } = listStateAndListMore({
        list_Length: table_DateSource.length,
        total_Length: data2?.totalItem || 0,
        has_FilterCriteria: true,
      });
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          table_TotalAmountExpenditure: Math.abs(Number(data2?.totalExpenditure || 0)),
          table_TotalAmountIncome: Math.abs(Number(data2?.totalIncome || 0)),
          table_State: state,
          table_More: more,
          table_DateSource: table_DateSource,
        },
      });
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

function getStartAndEndDate(type: 'week' | 'month' | 'year'): [moment.Moment, moment.Moment] {
  switch (type) {
    case 'week':
      return [moment().subtract(1, 'weeks'), moment()];
    case 'month':
      return [moment().subtract(1, 'months'), moment()];
    default:
      return [moment().subtract(1, 'years'), moment()];
  }
}
