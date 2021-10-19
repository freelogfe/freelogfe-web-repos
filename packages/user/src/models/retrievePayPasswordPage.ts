import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';

export interface RetrievePayPasswordPageModelState {
  userID: number;
  userPhone: string;
  userEmail: string;
  showView: 'userPassword' | 'captcha' | 'paymentPassword' | 'success';

  userPassword_PasswordInput: string;

  captcha_VerifyMode: 'phone' | 'email';
  captcha_CaptchaInput: string;
  captcha_CaptchaInputError: string;
  captcha_SentCaptchaWait: number;

  paymentPassword_Password1Input: string;
  paymentPassword_Password1InputError: string;
  paymentPassword_Password2Input: string;
  paymentPassword_Password2InputError: string;
}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<RetrievePayPasswordPageModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'retrievePayPasswordPage/onMountPage';
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'retrievePayPasswordPage/onUnmountPage';
}

export interface OnChange_UserPassword_PasswordInput_Action extends AnyAction {
  type: 'retrievePayPasswordPage/onChange_UserPassword_PasswordInput';
  payload: {
    value: string;
  };
}

export interface OnChange_Captcha_VerifyMode_Action extends AnyAction {
  type: 'retrievePayPasswordPage/onChange_Captcha_VerifyMode';
  payload: {
    value: 'phone' | 'email';
  };
}

export interface OnChange_Captcha_CaptchaInput_Action extends AnyAction {
  type: 'retrievePayPasswordPage/onChange_Captcha_CaptchaInput';
  payload: {
    value: string;
  };
}

// export interface OnBlur_Captcha_CaptchaInput_Action extends AnyAction {
//   type: 'retrievePayPasswordPage/onBlur_Captcha_CaptchaInput';
// }

export interface OnClick_Captcha_SentBtn_Action extends AnyAction {
  type: 'retrievePayPasswordPage/onClick_Captcha_SentBtn';
}

export interface OnChange_Captcha_SentCaptchaWait_Action extends AnyAction {
  type: 'retrievePayPasswordPage/onChange_Captcha_SentCaptchaWait';
  payload: {
    value: number;
  };
}

export interface OnChange_PaymentPassword_Password1Input_Action extends AnyAction {
  type: 'retrievePayPasswordPage/onChange_PaymentPassword_Password1Input';
  payload: {
    value: string;
  };
}

export interface OnBlur_PaymentPassword_Password1Input_Action extends AnyAction {
  type: 'retrievePayPasswordPage/onBlur_PaymentPassword_Password1Input';
}

export interface OnChange_PaymentPassword_Password2Input_Action extends AnyAction {
  type: 'retrievePayPasswordPage/onChange_PaymentPassword_Password2Input';
  payload: {
    value: string;
  };
}

export interface OnBlur_PaymentPassword_Password2Input_Action extends AnyAction {
  type: 'retrievePayPasswordPage/onBlur_PaymentPassword_Password2Input';
}

export interface OnClick_PaymentPassword_ConfirmBtn_Action extends AnyAction {
  type: 'retrievePayPasswordPage/onClick_PaymentPassword_ConfirmBtn';
}

interface RetrievePayPasswordPageModelType {
  namespace: 'retrievePayPasswordPage';
  state: RetrievePayPasswordPageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
    onChange_UserPassword_PasswordInput: (action: OnChange_UserPassword_PasswordInput_Action, effects: EffectsCommandMap) => void;
    onChange_Captcha_VerifyMode: (action: OnChange_Captcha_VerifyMode_Action, effects: EffectsCommandMap) => void;
    onChange_Captcha_CaptchaInput: (action: OnChange_Captcha_CaptchaInput_Action, effects: EffectsCommandMap) => void;
    // onBlur_Captcha_CaptchaInput: (action: OnBlur_Captcha_CaptchaInput_Action, effects: EffectsCommandMap) => void;
    onClick_Captcha_SentBtn: (action: OnClick_Captcha_SentBtn_Action, effects: EffectsCommandMap) => void;
    onChange_Captcha_SentCaptchaWait: (action: OnChange_Captcha_SentCaptchaWait_Action, effects: EffectsCommandMap) => void;
    onChange_PaymentPassword_Password1Input: (action: OnChange_PaymentPassword_Password1Input_Action, effects: EffectsCommandMap) => void;
    onBlur_PaymentPassword_Password1Input: (action: OnBlur_PaymentPassword_Password1Input_Action, effects: EffectsCommandMap) => void;
    onChange_PaymentPassword_Password2Input: (action: OnChange_PaymentPassword_Password2Input_Action, effects: EffectsCommandMap) => void;
    onBlur_PaymentPassword_Password2Input: (action: OnBlur_PaymentPassword_Password2Input_Action, effects: EffectsCommandMap) => void;
    onClick_PaymentPassword_ConfirmBtn: (action: OnClick_PaymentPassword_ConfirmBtn_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<RetrievePayPasswordPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: RetrievePayPasswordPageModelState = {
  userID: -1,
  userPhone: '',
  userEmail: '',
  showView: 'userPassword',

  userPassword_PasswordInput: '',

  captcha_VerifyMode: 'phone',
  captcha_CaptchaInput: '',
  captcha_CaptchaInputError: '',
  captcha_SentCaptchaWait: 0,

  paymentPassword_Password1Input: '',
  paymentPassword_Password1InputError: '',
  paymentPassword_Password2Input: '',
  paymentPassword_Password2InputError: '',
};

const Model: RetrievePayPasswordPageModelType = {
  namespace: 'retrievePayPasswordPage',
  state: initStates,
  effects: {
    * onMountPage({}: OnMountPageAction, { call, put }: EffectsCommandMap) {
      const { data } = yield call(FServiceAPI.User.currentUserInfo);
      // console.log(data, 'DDDDDDD222222');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          userID: data.userId,
          userEmail: data.email,
          userPhone: data.mobile,
          captcha_VerifyMode: data.mobile ? 'phone' : 'email',
        },
      });
    },
    * onUnmountPage({}: OnUnmountPageAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * onChange_UserPassword_PasswordInput({ payload }: OnChange_UserPassword_PasswordInput_Action, { put }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          userPassword_PasswordInput: payload.value,
        },
      });
    },
    * onChange_Captcha_VerifyMode({ payload }: OnChange_Captcha_VerifyMode_Action, { put }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          captcha_VerifyMode: payload.value,
        },
      });
    },
    * onChange_Captcha_CaptchaInput({ payload }: OnChange_Captcha_CaptchaInput_Action, { put }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          captcha_CaptchaInput: payload.value,
        },
      });
    },
    // * onBlur_Captcha_CaptchaInput(action: OnBlur_Captcha_CaptchaInput_Action, effects: EffectsCommandMap) {
    // },
    * onClick_Captcha_SentBtn({}: OnClick_Captcha_SentBtn_Action, { select, put, call }: EffectsCommandMap) {
      const { retrievePayPasswordPage }: ConnectState = yield select(({ retrievePayPasswordPage }: ConnectState) => ({
        retrievePayPasswordPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          captcha_SentCaptchaWait: 60,
        },
      });

      const params: Parameters<typeof FServiceAPI.Captcha.sendVerificationCode>[0] = {
        loginName: retrievePayPasswordPage.captcha_VerifyMode === 'email' ? retrievePayPasswordPage.userEmail : retrievePayPasswordPage.userPhone,
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
          captcha_SentCaptchaWait: 0,
        },
      });
    },
    * onChange_Captcha_SentCaptchaWait({ payload }: OnChange_Captcha_SentCaptchaWait_Action, { put }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          captcha_SentCaptchaWait: payload.value,
        },
      });
    },
    * onChange_PaymentPassword_Password1Input({ payload }: OnChange_PaymentPassword_Password1Input_Action, { put }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          paymentPassword_Password1Input: payload.value,
        },
      });
    },

    * onBlur_PaymentPassword_Password1Input(action: OnBlur_PaymentPassword_Password1Input_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { retrievePayPasswordPage }: ConnectState = yield select(({ retrievePayPasswordPage }: ConnectState) => ({
        retrievePayPasswordPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          paymentPassword_Password1InputError: FUtil.Regexp.PAY_PASSWORD.test(retrievePayPasswordPage.paymentPassword_Password1Input) ? '' : '必须为6为数字',
          paymentPassword_Password2InputError: (retrievePayPasswordPage.paymentPassword_Password2Input && retrievePayPasswordPage.paymentPassword_Password1Input !== retrievePayPasswordPage.paymentPassword_Password2Input) ? '两次密码必须一致' : '',
        },
      });
    },
    * onChange_PaymentPassword_Password2Input({ payload }: OnChange_PaymentPassword_Password2Input_Action, { put }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          paymentPassword_Password2Input: payload.value,
        },
      });
    },
    * onBlur_PaymentPassword_Password2Input({}: OnBlur_PaymentPassword_Password2Input_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { retrievePayPasswordPage }: ConnectState = yield select(({ retrievePayPasswordPage }: ConnectState) => ({
        retrievePayPasswordPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          paymentPassword_Password2InputError: retrievePayPasswordPage.paymentPassword_Password2Input === retrievePayPasswordPage.paymentPassword_Password1Input ? '' : '两次密码必须一致',
        },
      });
    },
    * onClick_PaymentPassword_ConfirmBtn({}: OnClick_PaymentPassword_ConfirmBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { retrievePayPasswordPage }: ConnectState = yield select(({ retrievePayPasswordPage }: ConnectState) => ({
        retrievePayPasswordPage,
      }));

      const params: Parameters<typeof FServiceAPI.Transaction.resetPassword>[0] = {
        loginPassword: retrievePayPasswordPage.userPassword_PasswordInput,
        password: retrievePayPasswordPage.paymentPassword_Password1Input,
        authCode: retrievePayPasswordPage.captcha_CaptchaInput,
        messageAddress: retrievePayPasswordPage.captcha_VerifyMode === 'email' ? retrievePayPasswordPage.userEmail : retrievePayPasswordPage.userPhone,
      };

      const { errCode, msg } = yield call(FServiceAPI.Transaction.resetPassword, params);

      if (errCode !== 0) {
        return fMessage(msg, 'error');
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showView: 'success',
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
