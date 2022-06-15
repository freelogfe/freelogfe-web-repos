import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';

export type RetrievePageModelState = WholeReadonly<{
  showView: 'reset' | 'success';

  verifyMode: 'phone' | 'email';
  phoneInput: string;
  phoneInputError: string;
  emailInput: string;
  emailInputError: string;
  verifyCode: string;
  verifyCodeError: string;
  verifyCodeReSendWait: number;

  newPasswordInput: string;
  newPasswordInputError: string;
  confirmPasswordInput: string;
  confirmPasswordInputError: string;

  waitingTimeToLogin: number;
}>;

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<RetrievePageModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'retrievePage/onMountPage';
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'retrievePage/onUnmountPage';
}

export interface OnChangeVerifyModeAction extends AnyAction {
  type: 'retrievePage/onChangeVerifyMode';
  payload: {
    value: 'phone' | 'email';
  };
}

export interface OnChangePhoneInputAction extends AnyAction {
  type: 'retrievePage/onChangePhoneInput';
  payload: {
    value: string;
  };
}

export interface OnBlurPhoneInputAction extends AnyAction {
  type: 'retrievePage/onBlurPhoneInput';
}

export interface OnChangeEmailInputAction extends AnyAction {
  type: 'retrievePage/onChangeEmailInput';
  payload: {
    value: string;
  };
}

export interface OnBlurEmailInputAction extends AnyAction {
  type: 'retrievePage/onBlurEmailInput';
}

export interface OnChangeVerifyCodeInputAction extends AnyAction {
  type: 'retrievePage/onChangeVerifyCodeInput';
  payload: {
    value: string;
  };
}

export interface OnBlurVerifyCodeInputAction extends AnyAction {
  type: 'retrievePage/onBlurVerifyCodeInput';
}

export interface OnClickSendVerifyCodeBtnAction extends AnyAction {
  type: 'retrievePage/onClickSendVerifyCodeBtn';
}

export interface OnChangeVerifyCodeReSendWaitAction extends AnyAction {
  type: 'retrievePage/onChangeVerifyCodeReSendWait';
  payload: {
    value: number;
  };
}

export interface OnChangeNewPasswordInputAction extends AnyAction {
  type: 'retrievePage/onChangeNewPasswordInput';
  payload: {
    value: string;
  };
}

export interface OnBlurNewPasswordInputAction extends AnyAction {
  type: 'retrievePage/onBlurNewPasswordInput';
}

export interface OnChangeConfirmPasswordInputAction extends AnyAction {
  type: 'retrievePage/onChangeConfirmPasswordInput';
  payload: {
    value: string;
  };
}

export interface OnBlurConfirmPasswordInputAction extends AnyAction {
  type: 'retrievePage/onBlurConfirmPasswordInput';
}

export interface OnClickResetBtnAction extends AnyAction {
  type: 'retrievePage/onClickResetBtn';
}

export interface OnChangeWaitingTimeAction extends AnyAction {
  type: 'retrievePage/onChangeWaitingTime';
  payload: {
    value: number;
  };
}

interface RetrievePageModelType {
  namespace: 'retrievePage';
  state: RetrievePageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
    onChangeVerifyMode: (action: OnChangeVerifyModeAction, effects: EffectsCommandMap) => void;
    onChangePhoneInput: (action: OnChangePhoneInputAction, effects: EffectsCommandMap) => void;
    onBlurPhoneInput: (action: OnBlurPhoneInputAction, effects: EffectsCommandMap) => void;
    onChangeEmailInput: (action: OnChangeEmailInputAction, effects: EffectsCommandMap) => void;
    onBlurEmailInput: (action: OnBlurEmailInputAction, effects: EffectsCommandMap) => void;
    onChangeVerifyCodeInput: (action: OnChangeVerifyCodeInputAction, effects: EffectsCommandMap) => void;
    onBlurVerifyCodeInput: (action: OnBlurVerifyCodeInputAction, effects: EffectsCommandMap) => void;
    onClickSendVerifyCodeBtn: (action: OnClickSendVerifyCodeBtnAction, effects: EffectsCommandMap) => void;
    onChangeVerifyCodeReSendWait: (action: OnChangeVerifyCodeReSendWaitAction, effects: EffectsCommandMap) => void;
    onChangeNewPasswordInput: (action: OnChangeNewPasswordInputAction, effects: EffectsCommandMap) => void;
    onBlurNewPasswordInput: (action: OnBlurNewPasswordInputAction, effects: EffectsCommandMap) => void;
    onChangeConfirmPasswordInput: (action: OnChangeConfirmPasswordInputAction, effects: EffectsCommandMap) => void;
    onBlurConfirmPasswordInput: (action: OnBlurConfirmPasswordInputAction, effects: EffectsCommandMap) => void;
    onClickResetBtn: (action: OnClickResetBtnAction, effects: EffectsCommandMap) => void;
    onChangeWaitingTime: (action: OnChangeWaitingTimeAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<RetrievePageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: RetrievePageModelState = {
  showView: 'reset',

  verifyMode: 'phone',
  phoneInput: '',
  phoneInputError: '',
  emailInput: '',
  emailInputError: '',
  verifyCode: '',
  verifyCodeError: '',
  verifyCodeReSendWait: 0,

  newPasswordInput: '',
  newPasswordInputError: '',
  confirmPasswordInput: '',
  confirmPasswordInputError: '',

  waitingTimeToLogin: 0,
};

const Model: RetrievePageModelType = {
  namespace: 'retrievePage',
  state: initStates,
  effects: {
    * onMountPage({}: OnMountPageAction, {}: EffectsCommandMap) {

    },
    * onUnmountPage({}: OnUnmountPageAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
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
    * onChangePhoneInput({ payload }: OnChangePhoneInputAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          phoneInput: payload.value,
          phoneInputError: '',
        },
      });
    },
    * onBlurPhoneInput({}: OnBlurPhoneInputAction, { select, call, put }: EffectsCommandMap) {
      const { retrievePage }: ConnectState = yield select(({ retrievePage }: ConnectState) => ({
        retrievePage,
      }));

      let phoneInputError: string = '';

      if (!retrievePage.phoneInput) {
        phoneInputError = '手机号不能为空';
      } else if (!FUtil.Regexp.MOBILE_PHONE_NUMBER.test(retrievePage.phoneInput)) {
        phoneInputError = '输入格式有误，请输入正确的手机号';
      }

      if (!phoneInputError) {
        const params: Parameters<typeof FServiceAPI.User.userDetails>[0] = {
          mobile: retrievePage.phoneInput,
        };
        const { data } = yield call(FServiceAPI.User.userDetails, params);
        if (!data) {
          phoneInputError = '手机未注册';
        }
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          phoneInputError,
        },
      });
    },
    * onChangeEmailInput({ payload }: OnChangeEmailInputAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          emailInput: payload.value,
          emailInputError: '',
        },
      });
    },
    * onBlurEmailInput({}: OnBlurEmailInputAction, { select, call, put }: EffectsCommandMap) {
      const { retrievePage }: ConnectState = yield select(({ retrievePage }: ConnectState) => ({
        retrievePage,
      }));

      let emailInputError: string = '';

      if (!retrievePage.emailInput) {
        emailInputError = '邮箱不能为空';
      } else if (!FUtil.Regexp.EMAIL_ADDRESS.test(retrievePage.emailInput)) {
        emailInputError = '输入格式有误，请输入正确的邮箱';
      }

      if (!emailInputError) {
        const params: Parameters<typeof FServiceAPI.User.userDetails>[0] = {
          email: retrievePage.emailInput,
        };
        const { data } = yield call(FServiceAPI.User.userDetails, params);
        if (!data) {
          emailInputError = '邮箱未注册';
        }
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          emailInputError,
        },
      });
    },
    * onChangeVerifyCodeInput({ payload }: OnChangeVerifyCodeInputAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          verifyCode: payload.value,
          verifyCodeError: '',
        },
      });
    },
    * onBlurVerifyCodeInput({}: OnBlurVerifyCodeInputAction, { select, put }: EffectsCommandMap) {
      const { retrievePage }: ConnectState = yield select(({ retrievePage }: ConnectState) => ({
        retrievePage,
      }));

      let verifyCodeError: string = '';

      if (retrievePage.verifyCode === '') {
        verifyCodeError = '验证码不能为空';
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          verifyCodeError,
        },
      });
    },
    * onClickSendVerifyCodeBtn({}: OnClickSendVerifyCodeBtnAction, { select, call, put }: EffectsCommandMap) {
      const { retrievePage }: ConnectState = yield select(({ retrievePage }: ConnectState) => ({
        retrievePage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          verifyCodeReSendWait: 60,
        },
      });

      const params: Parameters<typeof FServiceAPI.Captcha.sendVerificationCode>[0] = {
        loginName: retrievePage.verifyMode === 'phone' ? retrievePage.phoneInput : retrievePage.emailInput,
        authCodeType: 'resetPassword',
      };

      const { data, msg } = yield call(FServiceAPI.Captcha.sendVerificationCode, params);

      if (!data) {
        fMessage(msg, 'error');
      }
    },
    * onChangeVerifyCodeReSendWait({ payload }: OnChangeVerifyCodeReSendWaitAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          verifyCodeReSendWait: payload.value,
        },
      });
    },
    * onChangeNewPasswordInput({ payload }: OnChangeNewPasswordInputAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          newPasswordInput: payload.value,
          newPasswordInputError: '',
        },
      });
    },
    * onBlurNewPasswordInput({}: OnBlurNewPasswordInputAction, { select, put }: EffectsCommandMap) {
      const { retrievePage }: ConnectState = yield select(({ retrievePage }: ConnectState) => ({
        retrievePage,
      }));

      let newPasswordInputError: string = '';
      let confirmPasswordInputError: string = '';

      if (!retrievePage.newPasswordInput) {
        newPasswordInputError = '请输入密码';
      } else if (!FUtil.Regexp.PASSWORD.test(retrievePage.newPasswordInput)) {
        newPasswordInputError = '密码必须包含数字和字母；且由6-24个字符组成';
      }

      if (retrievePage.confirmPasswordInput !== '' && (retrievePage.confirmPasswordInput !== retrievePage.newPasswordInput)) {
        confirmPasswordInputError = '两次输入不一致';
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          newPasswordInputError,
          confirmPasswordInputError,
        },
      });
    },
    * onChangeConfirmPasswordInput({ payload }: OnChangeConfirmPasswordInputAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          confirmPasswordInput: payload.value,
          confirmPasswordInputError: '',
        },
      });
    },
    * onBlurConfirmPasswordInput({}: OnBlurConfirmPasswordInputAction, { select, put }: EffectsCommandMap) {
      const { retrievePage }: ConnectState = yield select(({ retrievePage }: ConnectState) => ({
        retrievePage,
      }));

      let confirmPasswordInputError: string = '';
      // console.log(retrievePage.confirmPasswordInput, '######3@@@@@@@@@');
      if (!retrievePage.confirmPasswordInput) {
        confirmPasswordInputError = '请输入密码';
      } else if (retrievePage.newPasswordInput !== retrievePage.confirmPasswordInput) {
        confirmPasswordInputError = '两次输入不一致';
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          confirmPasswordInputError,
        },
      });
    },
    * onClickResetBtn({}: OnClickResetBtnAction, { select, call, put }: EffectsCommandMap) {
      const { retrievePage }: ConnectState = yield select(({ retrievePage }: ConnectState) => ({
        retrievePage,
      }));

      const params: Parameters<typeof FServiceAPI.User.resetPassword>[0] = {
        loginName: retrievePage.verifyMode === 'phone' ? retrievePage.phoneInput : retrievePage.emailInput,
        password: retrievePage.newPasswordInput,
        authCode: retrievePage.verifyCode,
      };

      const { errCode, data, msg } = yield call(FServiceAPI.User.resetPassword, params);
      // console.log(data, 'DDDDDDDdd123423');
      if (errCode !== 0 || !data) {
        // return fMessage(msg, 'error');
        return fMessage('验证码错误', 'error');
      }
      // history.replace(FUtil.LinkTo.resetPasswordSuccessResult());
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          showView: 'success',
          waitingTimeToLogin: 3,
        },
      });
    },
    * onChangeWaitingTime({ payload }: OnChangeWaitingTimeAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          waitingTimeToLogin: payload.value,
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
