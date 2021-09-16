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
  showView: 'reset' | 'success';

  userPasswordInput: string;
  verifyMode: 'phone' | 'email';
  captchaInput: string;
  captchaInputError: string;
  sentCaptchaWait: number;
  passwordOneInput: string;
  passwordOneInputError: string;
  passwordTwoInput: string;
  passwordTwoInputError: string;
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

export interface OnChangeUserPasswordInputAction extends AnyAction {
  type: 'retrievePayPasswordPage/onChangeUserPasswordInput';
  payload: {
    value: string;
  };
}

export interface OnChangeVerifyModeAction extends AnyAction {
  type: 'retrievePayPasswordPage/onChangeVerifyMode';
  payload: {
    value: 'phone' | 'email';
  };
}

export interface OnChangeCaptchaInputAction extends AnyAction {
  type: 'retrievePayPasswordPage/onChangeCaptchaInput';
  payload: {
    value: string;
  };
}

export interface OnBlurCaptchaInputAction extends AnyAction {
  type: 'retrievePayPasswordPage/onBlurCaptchaInput';
}

export interface OnClickSentBtnAction extends AnyAction {
  type: 'retrievePayPasswordPage/onClickSentBtn';
}

export interface OnChangSentWaitAction extends AnyAction {
  type: 'retrievePayPasswordPage/onChangSentWait';
  payload: {
    value: number;
  };
}

export interface OnChangePassword1InputAction extends AnyAction {
  type: 'retrievePayPasswordPage/onChangePassword1Input';
  payload: {
    value: string;
  };
}

export interface OnBlurPassword1InputAction extends AnyAction {
  type: 'retrievePayPasswordPage/onBlurPassword1Input';
}

export interface OnChangePassword2InputAction extends AnyAction {
  type: 'retrievePayPasswordPage/onChangePassword2Input';
  payload: {
    value: string;
  };
}

export interface OnBlurPassword2InputAction extends AnyAction {
  type: 'retrievePayPasswordPage/onBlurPassword2Input';
}

export interface OnClickUpdatePasswordBtnAction extends AnyAction {
  type: 'retrievePayPasswordPage/onClickUpdatePasswordBtn';
}

interface RetrievePayPasswordPageModelType {
  namespace: 'retrievePayPasswordPage';
  state: RetrievePayPasswordPageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
    onChangeUserPasswordInput: (action: OnChangeUserPasswordInputAction, effects: EffectsCommandMap) => void;
    onChangeVerifyMode: (action: OnChangeVerifyModeAction, effects: EffectsCommandMap) => void;
    onChangeCaptchaInput: (action: OnChangeCaptchaInputAction, effects: EffectsCommandMap) => void;
    onBlurCaptchaInput: (action: OnBlurCaptchaInputAction, effects: EffectsCommandMap) => void;
    onClickSentBtn: (action: OnClickSentBtnAction, effects: EffectsCommandMap) => void;
    onChangSentWait: (action: OnChangSentWaitAction, effects: EffectsCommandMap) => void;
    onChangePassword1Input: (action: OnChangePassword1InputAction, effects: EffectsCommandMap) => void;
    onBlurPassword1Input: (action: OnBlurPassword1InputAction, effects: EffectsCommandMap) => void;
    onChangePassword2Input: (action: OnChangePassword2InputAction, effects: EffectsCommandMap) => void;
    onBlurPassword2Input: (action: OnBlurPassword2InputAction, effects: EffectsCommandMap) => void;
    onClickUpdatePasswordBtn: (action: OnClickUpdatePasswordBtnAction, effects: EffectsCommandMap) => void;
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
  showView: 'reset',

  userPasswordInput: '',
  verifyMode: 'phone',
  captchaInput: '',
  captchaInputError: '',
  sentCaptchaWait: 0,
  passwordOneInput: '',
  passwordOneInputError: '',
  passwordTwoInput: '',
  passwordTwoInputError: '',
};

const Model: RetrievePayPasswordPageModelType = {
  namespace: 'retrievePayPasswordPage',
  state: initStates,
  effects: {
    * onMountPage({}: OnMountPageAction, { call, put }: EffectsCommandMap) {
      const { data } = yield call(FServiceAPI.User.currentUserInfo);
      console.log(data, 'DDDDDDD222222');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          userID: data.userId,
          userEmail: data.email,
          userPhone: data.mobile,
          verifyMode: data.mobile ? 'phone' : 'email',
        },
      });
    },
    * onUnmountPage({}: OnUnmountPageAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * onChangeUserPasswordInput({ payload }: OnChangeUserPasswordInputAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          userPasswordInput: payload.value,
        },
      });
    },
    * onChangeVerifyMode({ payload }: OnChangeVerifyModeAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          verifyMode: payload.value,
        },
      });
    },
    * onChangeCaptchaInput({ payload }: OnChangeCaptchaInputAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          captchaInput: payload.value,
        },
      });
    },
    * onBlurCaptchaInput(action: OnBlurCaptchaInputAction, effects: EffectsCommandMap) {
    },
    * onClickSentBtn({}: OnClickSentBtnAction, { select, put, call }: EffectsCommandMap) {
      const { retrievePayPasswordPage }: ConnectState = yield select(({ retrievePayPasswordPage }: ConnectState) => ({
        retrievePayPasswordPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          sentCaptchaWait: 60,
        },
      });

      const params: Parameters<typeof FServiceAPI.Captcha.sendVerificationCode>[0] = {
        loginName: retrievePayPasswordPage.verifyMode === 'email' ? retrievePayPasswordPage.userEmail : retrievePayPasswordPage.userPhone,
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
          sentCaptchaWait: 0,
        },
      });
    },
    * onChangSentWait({ payload }: OnChangSentWaitAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          sentCaptchaWait: payload.value,
        },
      });
    },
    * onChangePassword1Input({ payload }: OnChangePassword1InputAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          passwordOneInput: payload.value,
        },
      });
    },
    * onBlurPassword1Input(action: OnBlurPassword1InputAction, { select, put }: EffectsCommandMap) {
      const { retrievePayPasswordPage }: ConnectState = yield select(({ retrievePayPasswordPage }: ConnectState) => ({
        retrievePayPasswordPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          passwordOneInputError: FUtil.Regexp.PAY_PASSWORD.test(retrievePayPasswordPage.passwordOneInput) ? '' : '必须为6为数字',
          passwordTwoInputError: (retrievePayPasswordPage.passwordTwoInput && retrievePayPasswordPage.passwordOneInput !== retrievePayPasswordPage.passwordTwoInput) ? '两次密码必须一致' : '',
        },
      });
    },
    * onChangePassword2Input({ payload }: OnChangePassword2InputAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          passwordTwoInput: payload.value,
        },
      });
    },
    * onBlurPassword2Input({}: OnBlurPassword2InputAction, { select, put }: EffectsCommandMap) {
      const { retrievePayPasswordPage }: ConnectState = yield select(({ retrievePayPasswordPage }: ConnectState) => ({
        retrievePayPasswordPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          passwordTwoInputError: retrievePayPasswordPage.passwordTwoInput === retrievePayPasswordPage.passwordOneInput ? '' : '两次密码必须一致',
        },
      });
    },
    * onClickUpdatePasswordBtn({}: OnClickUpdatePasswordBtnAction, { select, call, put }: EffectsCommandMap) {
      const { retrievePayPasswordPage }: ConnectState = yield select(({ retrievePayPasswordPage }: ConnectState) => ({
        retrievePayPasswordPage,
      }));

      const params: Parameters<typeof FServiceAPI.Transaction.resetPassword>[0] = {
        loginPassword: retrievePayPasswordPage.userPasswordInput,
        password: retrievePayPasswordPage.passwordOneInput,
        authCode: retrievePayPasswordPage.captchaInput,
        messageAddress: retrievePayPasswordPage.verifyMode === 'email' ? retrievePayPasswordPage.userEmail : retrievePayPasswordPage.userPhone,
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
