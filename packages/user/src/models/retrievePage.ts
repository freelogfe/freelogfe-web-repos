import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';

export type RetrievePageModelState = WholeReadonly<{
  showView: 'reset' | 'success';

  verifyMode: 'phone' | 'email';
  phoneInput: string;
  phoneInputError: string;
  emailInput: string;
  emailInputError: string;
  phone_verifyCode: string;
  phone_verifyCodeError: string;
  phone_verifyCodeReSendWait: number;
  email_verifyCode: string;
  email_verifyCodeError: string;
  email_verifyCodeReSendWait: number;

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

export interface OnChange_Phone_VerifyCodeInput_Action extends AnyAction {
  type: 'retrievePage/onChange_Phone_VerifyCodeInput';
  payload: {
    value: string;
  };
}

export interface OnBlur_Phone_VerifyCodeInput_Action extends AnyAction {
  type: 'retrievePage/onBlur_Phone_VerifyCodeInput';
}

export interface OnClick_Phone_SendVerifyCodeBtn_Action extends AnyAction {
  type: 'retrievePage/onClick_Phone_SendVerifyCodeBtn';
}

export interface OnChange_Phone_VerifyCodeReSendWait_Action extends AnyAction {
  type: 'retrievePage/onChange_Phone_VerifyCodeReSendWait';
  payload: {
    value: number;
  };
}

export interface OnChange_Email_VerifyCodeInput_Action extends AnyAction {
  type: 'retrievePage/onChange_Email_VerifyCodeInput';
  payload: {
    value: string;
  };
}

export interface OnBlur_Email_VerifyCodeInput_Action extends AnyAction {
  type: 'retrievePage/onBlur_Email_VerifyCodeInput';
}

export interface OnClick_Email_SendVerifyCodeBtn_Action extends AnyAction {
  type: 'retrievePage/onClick_Email_SendVerifyCodeBtn';
}

export interface OnChange_Email_VerifyCodeReSendWait_Action extends AnyAction {
  type: 'retrievePage/onChange_Email_VerifyCodeReSendWait';
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
    onChange_Phone_VerifyCodeInput: (action: OnChange_Phone_VerifyCodeInput_Action, effects: EffectsCommandMap) => void;
    onBlur_Phone_VerifyCodeInput: (action: OnBlur_Phone_VerifyCodeInput_Action, effects: EffectsCommandMap) => void;
    onClick_Phone_SendVerifyCodeBtn: (action: OnClick_Phone_SendVerifyCodeBtn_Action, effects: EffectsCommandMap) => void;
    onChange_Phone_VerifyCodeReSendWait: (action: OnChange_Phone_VerifyCodeReSendWait_Action, effects: EffectsCommandMap) => void;
    onChange_Email_VerifyCodeInput: (action: OnChange_Email_VerifyCodeInput_Action, effects: EffectsCommandMap) => void;
    onBlur_Email_VerifyCodeInput: (action: OnBlur_Email_VerifyCodeInput_Action, effects: EffectsCommandMap) => void;
    onClick_Email_SendVerifyCodeBtn: (action: OnClick_Email_SendVerifyCodeBtn_Action, effects: EffectsCommandMap) => void;
    onChange_Email_VerifyCodeReSendWait: (action: OnChange_Email_VerifyCodeReSendWait_Action, effects: EffectsCommandMap) => void;
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
  phone_verifyCode: '',
  phone_verifyCodeError: '',
  phone_verifyCodeReSendWait: 0,
  email_verifyCode: '',
  email_verifyCodeError: '',
  email_verifyCodeReSendWait: 0,

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
    * onChange_Phone_VerifyCodeInput({ payload }: OnChange_Phone_VerifyCodeInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          phone_verifyCode: payload.value,
          phone_verifyCodeError: '',
        },
      });
    },
    * onBlur_Phone_VerifyCodeInput({}: OnBlur_Phone_VerifyCodeInput_Action, { select, put }: EffectsCommandMap) {
      const { retrievePage }: ConnectState = yield select(({ retrievePage }: ConnectState) => ({
        retrievePage,
      }));

      let verifyCodeError: string = '';

      if (retrievePage.phone_verifyCode === '') {
        verifyCodeError = '验证码不能为空';
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          phone_verifyCodeError: verifyCodeError,
        },
      });
    },
    * onClick_Phone_SendVerifyCodeBtn({}: OnClick_Phone_SendVerifyCodeBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { retrievePage }: ConnectState = yield select(({ retrievePage }: ConnectState) => ({
        retrievePage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          phone_verifyCodeReSendWait: 60,
        },
      });

      const params: Parameters<typeof FServiceAPI.Captcha.sendVerificationCode>[0] = {
        loginName: retrievePage.phoneInput,
        authCodeType: 'resetPassword',
      };

      const { data, msg } = yield call(FServiceAPI.Captcha.sendVerificationCode, params);

      if (!data) {
        fMessage(msg, 'error');
      }
    },
    * onChange_Phone_VerifyCodeReSendWait({ payload }: OnChange_Phone_VerifyCodeReSendWait_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          phone_verifyCodeReSendWait: payload.value,
        },
      });
    },

    * onChange_Email_VerifyCodeInput({ payload }: OnChange_Email_VerifyCodeInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          email_verifyCode: payload.value,
          email_verifyCodeError: '',
        },
      });
    },
    * onBlur_Email_VerifyCodeInput({}: OnBlur_Email_VerifyCodeInput_Action, { select, put }: EffectsCommandMap) {
      const { retrievePage }: ConnectState = yield select(({ retrievePage }: ConnectState) => ({
        retrievePage,
      }));

      let verifyCodeError: string = '';

      if (retrievePage.email_verifyCode === '') {
        verifyCodeError = '验证码不能为空';
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          email_verifyCodeError: verifyCodeError,
        },
      });
    },
    * onClick_Email_SendVerifyCodeBtn({}: OnClick_Email_SendVerifyCodeBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { retrievePage }: ConnectState = yield select(({ retrievePage }: ConnectState) => ({
        retrievePage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          email_verifyCodeReSendWait: 60,
        },
      });

      const params: Parameters<typeof FServiceAPI.Captcha.sendVerificationCode>[0] = {
        loginName: retrievePage.emailInput,
        authCodeType: 'resetPassword',
      };

      const { data, msg } = yield call(FServiceAPI.Captcha.sendVerificationCode, params);

      if (!data) {
        fMessage(msg, 'error');
      }
    },
    * onChange_Email_VerifyCodeReSendWait({ payload }: OnChange_Email_VerifyCodeReSendWait_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          email_verifyCodeReSendWait: payload.value,
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
        // confirmPasswordInputError = '两次输入不一致';
        confirmPasswordInputError = FI18n.i18nNext.t('changepassword_alarm_notmatch ');
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
        // confirmPasswordInputError = '两次输入不一致';
        confirmPasswordInputError = FI18n.i18nNext.t('changepassword_alarm_notmatch ');
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

      const authCode: string = retrievePage.verifyMode === 'phone'
        ? retrievePage.phone_verifyCode
        : retrievePage.email_verifyCode;

      if (!new RegExp(/^[0-9]*$/).test(authCode)) {
        fMessage('验证码必须全部为数字', 'error');
        return;
      }

      const params: Parameters<typeof FServiceAPI.User.resetPassword>[0] = {
        loginName: retrievePage.verifyMode === 'phone' ? retrievePage.phoneInput : retrievePage.emailInput,
        password: retrievePage.newPasswordInput,
        authCode: authCode,
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
