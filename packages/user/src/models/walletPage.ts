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
  // accountStatus: 'initial' | 'inactive' | 'active' | 'freeze'; // 0:未激活 1:正常 2:冻结
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

  changingPassword: boolean;
  changingPasswordMobile: string;
  changingPasswordEmail: string;
  changingPasswordType: 'phone' | 'email';
  changingPasswordCaptcha: string;
  changingPasswordSentCaptchaWait: number;
  changingPasswordCaptchaError: string;
  changingPasswordPasswordOld: string;
  changingPasswordPasswordOldError: string;
  changingPasswordPasswordOne: string;
  changingPasswordPasswordOneError: string;
  changingPasswordPasswordTwo: string;
  changingPasswordPasswordTwoError: string;
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

export interface OnClickUpdatePaymentPasswordBtnAction extends AnyAction {
  type: 'walletPage/onClickUpdatePaymentPasswordBtn';
}

export interface OnCancelUpdatePaymentPasswordModalAction extends AnyAction {
  type: 'walletPage/onCancelUpdatePaymentPasswordModal';
}

export interface OnChangeUpdatePaymentPasswordModeAction extends AnyAction {
  type: 'walletPage/onChangeUpdatePaymentPasswordMode';
  payload: {
    value: 'phone' | 'email';
  };
}

export interface OnChangeUpdatePaymentPasswordCaptchaInputAction extends AnyAction {
  type: 'walletPage/onChangeUpdatePaymentPasswordCaptchaInput';
  payload: {
    value: string;
  };
}

export interface OnClickUpdatePaymentPasswordCaptchaBtnAction extends AnyAction {
  type: 'walletPage/onClickUpdatePaymentPasswordCaptchaBtn';
}

export interface OnChangeUpdatePaymentPasswordSentCaptchaWaitBtnAction extends AnyAction {
  type: 'walletPage/onChangeUpdatePaymentPasswordSentCaptchaWaitBtn';
  payload: {
    value: number;
  };
}

export interface OnChangeUpdatePaymentPasswordOldAction extends AnyAction {
  type: 'walletPage/onChangeUpdatePaymentPasswordOld';
  payload: {
    value: string;
  };
}

export interface OnChangeUpdatePaymentPasswordNew1Action extends AnyAction {
  type: 'walletPage/onChangeUpdatePaymentPasswordNew1';
  payload: {
    value: string;
  };
}

export interface OnBlurUpdatePaymentPasswordNew1Action extends AnyAction {
  type: 'walletPage/onBlurUpdatePaymentPasswordNew1';
}

export interface OnChangeUpdatePaymentPasswordNew2Action extends AnyAction {
  type: 'walletPage/onChangeUpdatePaymentPasswordNew2';
  payload: {
    value: string;
  };
}

export interface OnBlurUpdatePaymentPasswordNew2Action extends AnyAction {
  type: 'walletPage/onBlurUpdatePaymentPasswordNew2';
}

export interface OnClickUpdatePaymentPasswordConfirmBtnAction extends AnyAction {
  type: 'walletPage/onClickUpdatePaymentPasswordConfirmBtn';
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

    onClickUpdatePaymentPasswordBtn: (action: OnClickUpdatePaymentPasswordBtnAction, effects: EffectsCommandMap) => void;
    onCancelUpdatePaymentPasswordModal: (action: OnCancelUpdatePaymentPasswordModalAction, effects: EffectsCommandMap) => void;
    onChangeUpdatePaymentPasswordMode: (action: OnChangeUpdatePaymentPasswordModeAction, effects: EffectsCommandMap) => void;
    onChangeUpdatePaymentPasswordCaptchaInput: (action: OnChangeUpdatePaymentPasswordCaptchaInputAction, effects: EffectsCommandMap) => void;
    onClickUpdatePaymentPasswordCaptchaBtn: (action: OnClickUpdatePaymentPasswordCaptchaBtnAction, effects: EffectsCommandMap) => void;
    onChangeUpdatePaymentPasswordSentCaptchaWaitBtn: (action: OnChangeUpdatePaymentPasswordSentCaptchaWaitBtnAction, effects: EffectsCommandMap) => void;
    onChangeUpdatePaymentPasswordOld: (action: OnChangeUpdatePaymentPasswordOldAction, effects: EffectsCommandMap) => void;
    onChangeUpdatePaymentPasswordNew1: (action: OnChangeUpdatePaymentPasswordNew1Action, effects: EffectsCommandMap) => void;
    onBlurUpdatePaymentPasswordNew1: (action: OnBlurUpdatePaymentPasswordNew1Action, effects: EffectsCommandMap) => void;
    onChangeUpdatePaymentPasswordNew2: (action: OnChangeUpdatePaymentPasswordNew2Action, effects: EffectsCommandMap) => void;
    onBlurUpdatePaymentPasswordNew2: (action: OnBlurUpdatePaymentPasswordNew2Action, effects: EffectsCommandMap) => void;
    onClickUpdatePaymentPasswordConfirmBtn: (action: OnClickUpdatePaymentPasswordConfirmBtnAction, effects: EffectsCommandMap) => void;
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
  'changingPassword'
  | 'changingPasswordMobile'
  | 'changingPasswordEmail'
  | 'changingPasswordType'
  | 'changingPasswordCaptcha'
  | 'changingPasswordCaptchaError'
  | 'changingPasswordSentCaptchaWait'
  | 'changingPasswordPasswordOld'
  | 'changingPasswordPasswordOldError'
  | 'changingPasswordPasswordOne'
  | 'changingPasswordPasswordOneError'
  | 'changingPasswordPasswordTwo'
  | 'changingPasswordPasswordTwoError'> = {
  changingPassword: false,
  changingPasswordMobile: '',
  changingPasswordEmail: '',
  changingPasswordType: 'phone',
  changingPasswordCaptcha: '',
  changingPasswordCaptchaError: '',
  changingPasswordSentCaptchaWait: 0,
  changingPasswordPasswordOld: '',
  changingPasswordPasswordOldError: '',
  changingPasswordPasswordOne: '',
  changingPasswordPasswordOneError: '',
  changingPasswordPasswordTwo: '',
  changingPasswordPasswordTwoError: '',
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
    * onClickUpdatePaymentPasswordBtn({}: OnClickUpdatePaymentPasswordBtnAction, {
      select,
      put,
    }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPassword: true,
          changingPasswordMobile: walletPage.userPhone,
          changingPasswordEmail: walletPage.userEmail,
          changingPasswordType: walletPage.userPhone ? 'phone' : 'email',
        },
      });
    },
    * onCancelUpdatePaymentPasswordModal(action: OnCancelUpdatePaymentPasswordModalAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...changingPasswordInitStates,
        },
      });
    },
    * onChangeUpdatePaymentPasswordMode({ payload }: OnChangeUpdatePaymentPasswordModeAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPasswordType: payload.value,
        },
      });
    },
    * onChangeUpdatePaymentPasswordCaptchaInput({ payload }: OnChangeUpdatePaymentPasswordCaptchaInputAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPasswordCaptcha: payload.value,
        },
      });
    },
    * onClickUpdatePaymentPasswordCaptchaBtn(action: OnClickUpdatePaymentPasswordCaptchaBtnAction, {
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
          changingPasswordSentCaptchaWait: 60,
        },
      });

      const params: Parameters<typeof FServiceAPI.Captcha.sendVerificationCode>[0] = {
        loginName: walletPage.changingPasswordType === 'email' ? walletPage.changingPasswordEmail : walletPage.changingPasswordMobile,
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
          changingPasswordSentCaptchaWait: 0,
        },
      });
    },
    * onChangeUpdatePaymentPasswordSentCaptchaWaitBtn({ payload }: OnChangeUpdatePaymentPasswordSentCaptchaWaitBtnAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPasswordSentCaptchaWait: payload.value,
        },
      });
    },
    * onChangeUpdatePaymentPasswordOld({ payload }: OnChangeUpdatePaymentPasswordOldAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPasswordPasswordOld: payload.value,
        },
      });
    },
    * onChangeUpdatePaymentPasswordNew1({ payload }: OnChangeUpdatePaymentPasswordNew1Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPasswordPasswordOne: payload.value,
        },
      });
    },
    * onBlurUpdatePaymentPasswordNew1({ payload }: OnBlurUpdatePaymentPasswordNew1Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPasswordPasswordOneError: FUtil.Regexp.PAY_PASSWORD.test(walletPage.changingPasswordPasswordOne) ? '' : '必须为6为数字',
          changingPasswordPasswordTwoError: (walletPage.changingPasswordPasswordTwo && walletPage.changingPasswordPasswordOne !== walletPage.changingPasswordPasswordTwo) ? '两次密码必须一致' : '',
        },
      });
    },
    * onChangeUpdatePaymentPasswordNew2({ payload }: OnChangeUpdatePaymentPasswordNew2Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPasswordPasswordTwo: payload.value,
        },
      });
    },
    * onBlurUpdatePaymentPasswordNew2({}: OnBlurUpdatePaymentPasswordNew2Action, { select, put }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          changingPasswordPasswordTwoError: walletPage.changingPasswordPasswordTwo === walletPage.changingPasswordPasswordOne ? '' : '两次密码必须一致',
        },
      });
    },
    * onClickUpdatePaymentPasswordConfirmBtn(action: OnClickUpdatePaymentPasswordConfirmBtnAction, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { walletPage }: ConnectState = yield select(({ walletPage }: ConnectState) => ({
        walletPage,
      }));

      const params: Parameters<typeof FServiceAPI.Transaction.changePassword>[0] = {
        password: walletPage.changingPasswordPasswordOne,
        oldPassword: walletPage.changingPasswordPasswordOld,
        authCode: walletPage.changingPasswordCaptcha,
        messageAddress: walletPage.changingPasswordType === 'phone' ? walletPage.changingPasswordMobile : walletPage.changingPasswordEmail,
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


    // * fetchAccountInfo({}: FetchAccountInfoAction, { call, select, put }: EffectsCommandMap) {

    // const { data: data1 } = yield call(FServiceAPI.User.currentUserInfo);
    // // console.log(user, 'user!@#$!@#$@#!$');
    // const params: Parameters<typeof FServiceAPI.Transaction.individualAccounts>[0] = {
    //   userId: data1.userId,
    // };
    // const { data } = yield call(FServiceAPI.Transaction.individualAccounts, params);
    //
    // if (data.status === 0) {
    //   return yield put<ChangeAction>({
    //     type: 'change',
    //     payload: {
    //       accountStatus: data.status,
    //     },
    //   });
    // }
    //
    // const params2: Parameters<typeof FServiceAPI.Transaction.details>[0] = {
    //   accountId: data.accountId,
    //   skip: 0,
    //   limit: 100,
    // };
    //
    // const { data: data2 } = yield call(FServiceAPI.Transaction.details, params2);
    //
    // yield put<ChangeAction>({
    //   type: 'change',
    //   payload: {
    //     accountStatus: data.status,
    //     accountBalance: data.balance,
    //     transactionRecord: (data2.dataList as any[]).map((dl) => {
    //       const [date, time] = FUtil.Format.formatDateTime(dl.updateDate, true).split(' ');
    //       return {
    //         serialNo: dl.serialNo,
    //         date: date,
    //         time: time,
    //         digest: dl.digest,
    //         reciprocalAccountId: dl.reciprocalAccountId,
    //         reciprocalAccountName: dl.reciprocalAccountName,
    //         reciprocalAccountType: dl.reciprocalAccountType,
    //         transactionAmount: dl.transactionAmount,
    //         afterBalance: dl.afterBalance,
    //         status: dl.status,
    //       };
    //     }),
    //   },
    // });
    // },
    // * initModelStates({}: InitModelStatesAction, { put }: EffectsCommandMap) {
    //   yield put<ChangeAction>({
    //     type: 'change',
    //     payload: initStates,
    //   });
    // },
    // * activeAccount({}: ActiveAccountAction, { put, call, select }: EffectsCommandMap) {

    // },
    // * changePassword({}: ChangePasswordAction, { put, call, select }: EffectsCommandMap) {

    // },
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
