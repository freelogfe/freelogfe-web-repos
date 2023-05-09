import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import { FServiceAPI, FUtil, FI18n } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';

export interface LogonPageModelState {
  showView: 'logon' | 'success';

  usernameInput: string;
  usernameInputError: string;
  accountType: 'phone' | 'email';
  phoneInput: string;
  phoneInputError: string;
  emailInput: string;
  emailInputError: string;
  phone_verificationCodeInput: string;
  email_verificationCodeInput: string;
  phone_verificationCodeInputError: string;
  email_verificationCodeInputError: string;
  phone_verifyCodeReSendWait: number,
  email_verifyCodeReSendWait: number,
  passwordInput: string;
  passwordInputError: string;
  invitationCodeInput: string;

  waitingTimeToLogin: number;
}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<LogonPageModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'logonPage/onMountPage';
  payload: {
    url: string;
    invitationCode: string;
  };
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'logonPage/onUnmountPage';
}

export interface OnChangeUsernameInputAction extends AnyAction {
  type: 'logonPage/onChangeUsernameInput';
  payload: {
    value: string;
  };
}

export interface OnBlurUsernameInputAction extends AnyAction {
  type: 'logonPage/onBlurUsernameInput';
}

export interface OnChangeAccountTypeAction extends AnyAction {
  type: 'logonPage/onChangeAccountType';
  payload: {
    value: 'phone' | 'email';
  };
}

export interface OnChangePhoneInputAction extends AnyAction {
  type: 'logonPage/onChangePhoneInput';
  payload: {
    value: string;
  };
}

export interface OnBlurPhoneInputAction extends AnyAction {
  type: 'logonPage/onBlurPhoneInput';
}

export interface OnChangeEmailInputAction extends AnyAction {
  type: 'logonPage/onChangeEmailInput';
  payload: {
    value: string;
  };
}

export interface OnBlurEmailInputAction extends AnyAction {
  type: 'logonPage/onBlurEmailInput';
}

export interface OnChange_Phone_VerifyCodeInput_Action extends AnyAction {
  type: 'logonPage/onChange_Phone_VerifyCodeInput';
  payload: {
    value: string;
  };
}

export interface OnChange_Email_VerifyCodeInput_Action extends AnyAction {
  type: 'logonPage/onChange_Email_VerifyCodeInput';
  payload: {
    value: string;
  };
}

export interface OnBlur_Phone_VerifyCodeInput_Action extends AnyAction {
  type: 'logonPage/onBlur_Phone_VerifyCodeInput';
}

export interface OnBlur_Email_VerifyCodeInput_Action extends AnyAction {
  type: 'logonPage/onBlur_Email_VerifyCodeInput';
}

export interface OnClick_Phone_SendVerifyCodeBtn_Action extends AnyAction {
  type: 'logonPage/onClick_Phone_SendVerifyCodeBtn';
}

export interface OnClick_Email_SendVerifyCodeBtn_Action extends AnyAction {
  type: 'logonPage/onClick_Email_SendVerifyCodeBtn';
}

export interface OnChange_Phone_VerifyCodeReSendWait_Action extends AnyAction {
  type: 'logonPage/onChange_Phone_VerifyCodeReSendWait';
  payload: {
    value: number;
  };
}

export interface OnChange_Email_VerifyCodeReSendWait_Action extends AnyAction {
  type: 'logonPage/onChange_Email_VerifyCodeReSendWait';
  payload: {
    value: number;
  };
}

export interface OnChangePasswordInputAction extends AnyAction {
  type: 'logonPage/onChangePasswordInput';
  payload: {
    value: string;
  };
}

export interface OnBlurPasswordInputAction extends AnyAction {
  type: 'logonPage/onBlurPasswordInput';
}

export interface OnChange_InvitationCodeInput_Action extends AnyAction {
  type: 'logonPage/onChange_InvitationCodeInput';
  payload: {
    value: string;
  };
}

export interface OnClickLogonBtnAction extends AnyAction {
  type: 'logonPage/onClickLogonBtn';
}

export interface OnChangeWaitingTimeAction extends AnyAction {
  type: 'logonPage/onChangeWaitingTime';
  payload: {
    value: number;
  };
}

export interface OnTrigger_Login_Action extends AnyAction {
  type: 'logonPage/onTrigger_Login';
  payload: {
    goToUrl: string;
  };
}

interface LogonPageModelType {
  namespace: 'logonPage';
  state: LogonPageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
    onChangeUsernameInput: (action: OnChangeUsernameInputAction, effects: EffectsCommandMap) => void;
    onBlurUsernameInput: (action: OnBlurUsernameInputAction, effects: EffectsCommandMap) => void;
    onChangeAccountType: (action: OnChangeAccountTypeAction, effects: EffectsCommandMap) => void;
    onChangePhoneInput: (action: OnChangePhoneInputAction, effects: EffectsCommandMap) => void;
    onBlurPhoneInput: (action: OnBlurPhoneInputAction, effects: EffectsCommandMap) => void;
    onChangeEmailInput: (action: OnChangeEmailInputAction, effects: EffectsCommandMap) => void;
    onBlurEmailInput: (action: OnBlurEmailInputAction, effects: EffectsCommandMap) => void;
    onChange_Phone_VerifyCodeInput: (action: OnChange_Phone_VerifyCodeInput_Action, effects: EffectsCommandMap) => void;
    onChange_Email_VerifyCodeInput: (action: OnChange_Email_VerifyCodeInput_Action, effects: EffectsCommandMap) => void;
    onBlur_Phone_VerifyCodeInput: (action: OnBlur_Phone_VerifyCodeInput_Action, effects: EffectsCommandMap) => void;
    onBlur_Email_VerifyCodeInput: (action: OnBlur_Email_VerifyCodeInput_Action, effects: EffectsCommandMap) => void;
    onClick_Phone_SendVerifyCodeBtn: (action: OnClick_Phone_SendVerifyCodeBtn_Action, effects: EffectsCommandMap) => void;
    onClick_Email_SendVerifyCodeBtn: (action: OnClick_Email_SendVerifyCodeBtn_Action, effects: EffectsCommandMap) => void;
    onChange_Phone_VerifyCodeReSendWait: (action: OnChange_Phone_VerifyCodeReSendWait_Action, effects: EffectsCommandMap) => void;
    onChange_Email_VerifyCodeReSendWait: (action: OnChange_Email_VerifyCodeReSendWait_Action, effects: EffectsCommandMap) => void;
    onChangePasswordInput: (action: OnChangePasswordInputAction, effects: EffectsCommandMap) => void;
    onBlurPasswordInput: (action: OnBlurPasswordInputAction, effects: EffectsCommandMap) => void;
    onChange_InvitationCodeInput: (action: OnChange_InvitationCodeInput_Action, effects: EffectsCommandMap) => void;
    onClickLogonBtn: (action: OnClickLogonBtnAction, effects: EffectsCommandMap) => void;
    onChangeWaitingTime: (action: OnChangeWaitingTimeAction, effects: EffectsCommandMap) => void;
    onTrigger_Login: (action: OnTrigger_Login_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<LogonPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: LogonPageModelState = {
  showView: 'logon',

  usernameInput: '',
  usernameInputError: '',
  accountType: 'phone',
  emailInput: '',
  emailInputError: '',
  phoneInput: '',
  phoneInputError: '',
  phone_verificationCodeInput: '',
  email_verificationCodeInput: '',
  phone_verificationCodeInputError: '',
  email_verificationCodeInputError: '',
  phone_verifyCodeReSendWait: 0,
  email_verifyCodeReSendWait: 0,
  passwordInput: '',
  passwordInputError: '',
  invitationCodeInput: '',

  waitingTimeToLogin: 0,
};

const Model: LogonPageModelType = {
  namespace: 'logonPage',
  state: initStates,
  effects: {
    * onMountPage({ payload }: OnMountPageAction, { put }: EffectsCommandMap) {
      if (FUtil.Tool.getUserIDByCookies() === -1) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            invitationCodeInput: payload.invitationCode,
          },
        });
        return;
      }
      window.location.replace(payload.url || FUtil.Format.completeUrlByDomain('www'));
    },
    * onUnmountPage({}: OnUnmountPageAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * onChangeUsernameInput({ payload }: OnChangeUsernameInputAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          usernameInput: payload.value,
          usernameInputError: '',
        },
      });
    },
    * onBlurUsernameInput({}: OnBlurUsernameInputAction, { select, put, call }: EffectsCommandMap) {
      // console.log('onBlurUsernameInputonBlurUsernameInputlllll');
      const { logonPage }: ConnectState = yield select(({ logonPage }: ConnectState) => ({
        logonPage,
      }));

      let usernameInputError: string = '';

      if (logonPage.usernameInput === '') {
        usernameInputError = '用户名称不能为空';
      } else if (logonPage.usernameInput.length > 30) {
        usernameInputError = FI18n.i18nNext.t('signup_alarm_username_length');
      } else if (!FUtil.Regexp.USERNAME.test(logonPage.usernameInput)) {
        // usernameInputError = '用户名只能使用小写字母、数字或短横线（-）；必须以小写字母或数字开头和结尾';
        usernameInputError = FI18n.i18nNext.t('naming_convention_user_name');
      } else if (FUtil.Regexp.MOBILE_PHONE_NUMBER.test(logonPage.usernameInput)) {
        usernameInputError = '用户名不能是手机号';
      }

      if (!usernameInputError) {
        const params: Parameters<typeof FServiceAPI.User.userDetails>[0] = {
          username: logonPage.usernameInput,
        };
        const { data } = yield call(FServiceAPI.User.userDetails, params);
        if (data) {
          // usernameInputError = '用户名已被占用';
          usernameInputError = FI18n.i18nNext.t('signup_alarm_username_in_use');
        }
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          usernameInputError,
        },
      });

    },
    * onChangeAccountType({ payload }: OnChangeAccountTypeAction, { put }: EffectsCommandMap) {
      // console.log(payload, 'payloadpayloadpayload#########');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          accountType: payload.value,
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
    * onBlurPhoneInput(action: OnBlurPhoneInputAction, { select, put, call }: EffectsCommandMap) {
      const { logonPage }: ConnectState = yield select(({ logonPage }: ConnectState) => ({
        logonPage,
      }));

      let phoneInputError: string = '';

      if (!logonPage.phoneInput) {
        phoneInputError = '手机号不能为空';
      } else if (!FUtil.Regexp.MOBILE_PHONE_NUMBER.test(logonPage.phoneInput)) {
        phoneInputError = '输入格式有误，请输入正确的手机号';
      }

      if (!phoneInputError) {
        const params: Parameters<typeof FServiceAPI.User.userDetails>[0] = {
          mobile: logonPage.phoneInput,
        };
        const { data, errCode, msg } = yield call(FServiceAPI.User.userDetails, params);
        if (errCode !== 0) {
          phoneInputError = msg;
        } else if (data) {
          // phoneInputError = '手机号已被占用注册';
          phoneInputError = FI18n.i18nNext.t('signup_alarm_mobilephonenumber_in_use');
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
    * onBlurEmailInput({}: OnBlurEmailInputAction, { select, put, call }: EffectsCommandMap) {
      const { logonPage }: ConnectState = yield select(({ logonPage }: ConnectState) => ({
        logonPage,
      }));

      let emailInputError: string = '';

      if (!logonPage.emailInput) {
        emailInputError = '邮箱不能为空';
      } else if (!FUtil.Regexp.EMAIL_ADDRESS.test(logonPage.emailInput)) {
        emailInputError = '输入格式有误，请输入正确的邮箱';
      }

      if (!emailInputError) {
        const params: Parameters<typeof FServiceAPI.User.userDetails>[0] = {
          email: logonPage.emailInput,
        };
        const { data } = yield call(FServiceAPI.User.userDetails, params);
        if (data) {
          // emailInputError = '邮箱已被占用注册';
          emailInputError = FI18n.i18nNext.t('signup_alarm_email_in_use');
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
          phone_verificationCodeInput: payload.value,
          phone_verificationCodeInputError: '',
        },
      });
    },
    * onChange_Email_VerifyCodeInput({ payload }: OnChange_Email_VerifyCodeInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          email_verificationCodeInput: payload.value,
          email_verificationCodeInputError: '',
        },
      });
    },
    * onBlur_Phone_VerifyCodeInput({}: OnBlur_Phone_VerifyCodeInput_Action, { select, put }: EffectsCommandMap) {
      const { logonPage }: ConnectState = yield select(({ logonPage }: ConnectState) => ({
        logonPage,
      }));

      let verificationCodeInputError: string = '';

      if (!logonPage.phone_verificationCodeInput) {
        verificationCodeInputError = '验证码不能为空';
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          phone_verificationCodeInputError: verificationCodeInputError,
        },
      });
    },
    * onBlur_Email_VerifyCodeInput({}: OnBlur_Email_VerifyCodeInput_Action, { select, put }: EffectsCommandMap) {
      const { logonPage }: ConnectState = yield select(({ logonPage }: ConnectState) => ({
        logonPage,
      }));

      let verificationCodeInputError: string = '';

      if (!logonPage.email_verificationCodeInput) {
        verificationCodeInputError = '验证码不能为空';
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          email_verificationCodeInputError: verificationCodeInputError,
        },
      });
    },
    * onClick_Phone_SendVerifyCodeBtn({}: OnClick_Phone_SendVerifyCodeBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      // console.log('AAAAAAAAA3234234234');
      const { logonPage }: ConnectState = yield select(({ logonPage }: ConnectState) => ({
        logonPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          phone_verifyCodeReSendWait: 60,
        },
      });

      const params: Parameters<typeof FServiceAPI.Captcha.sendVerificationCode>[0] = {
        loginName: logonPage.phoneInput,
        authCodeType: 'register',
      };
      const { errCode, msg } = yield call(FServiceAPI.Captcha.sendVerificationCode, params);
      // console.log(errCode, msg, 'errCode, msg!!!!');
      if (errCode !== 0) {
        fMessage(msg, 'error');
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            phone_verifyCodeReSendWait: 0,
          },
        });
        return;
      }
    },
    * onClick_Email_SendVerifyCodeBtn({}: OnClick_Email_SendVerifyCodeBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      // console.log('AAAAAAAAA3234234234');
      const { logonPage }: ConnectState = yield select(({ logonPage }: ConnectState) => ({
        logonPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          email_verifyCodeReSendWait: 60,
        },
      });

      const params: Parameters<typeof FServiceAPI.Captcha.sendVerificationCode>[0] = {
        loginName: logonPage.emailInput,
        authCodeType: 'register',
      };
      const { errCode, msg } = yield call(FServiceAPI.Captcha.sendVerificationCode, params);
      // console.log(errCode, msg, 'errCode, msg!!!!');
      if (errCode !== 0) {
        fMessage(msg, 'error');
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            email_verifyCodeReSendWait: 0,
          },
        });
        return;
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
    * onChange_Email_VerifyCodeReSendWait({ payload }: OnChange_Email_VerifyCodeReSendWait_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          email_verifyCodeReSendWait: payload.value,
        },
      });
    },
    * onChangePasswordInput({ payload }: OnChangePasswordInputAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          passwordInput: payload.value,
          passwordInputError: '',
        },
      });
    },
    * onBlurPasswordInput(action: OnBlurPasswordInputAction, { select, put }: EffectsCommandMap) {
      const { logonPage }: ConnectState = yield select(({ logonPage }: ConnectState) => ({
        logonPage,
      }));

      let passwordInputError: string = '';

      if (!logonPage.passwordInput) {
        passwordInputError = '密码不能为空';
      } else if (logonPage.passwordInput.length < 6 || logonPage.passwordInput.length > 24) {
        passwordInputError = FI18n.i18nNext.t('password_length');
      } else if (!FUtil.Regexp.PASSWORD.test(logonPage.passwordInput)) {
        passwordInputError = FI18n.i18nNext.t('password_include');
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          passwordInputError,
        },
      });

    },
    * onChange_InvitationCodeInput({ payload }: OnChange_InvitationCodeInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          invitationCodeInput: payload.value,
        },
      });
    },
    * onClickLogonBtn(action: OnClickLogonBtnAction, { select, call, put }: EffectsCommandMap) {
      const { logonPage }: ConnectState = yield select(({ logonPage }: ConnectState) => ({
        logonPage,
      }));

      if (!new RegExp(/^[0-9]*$/).test(logonPage.accountType === 'email'
        ? logonPage.email_verificationCodeInput
        : logonPage.phone_verificationCodeInput)) {
        fMessage('验证码必须全部为数字', 'error');
        return;
      }

      const params: Parameters<typeof FServiceAPI.User.logon>[0] = {
        loginName: logonPage.accountType === 'email' ? logonPage.emailInput : logonPage.phoneInput,
        password: logonPage.passwordInput,
        username: logonPage.usernameInput,
        authCode: logonPage.accountType === 'email'
          ? logonPage.email_verificationCodeInput
          : logonPage.phone_verificationCodeInput,
      };

      const { data, msg, errCode, ret } = yield call(FServiceAPI.User.logon, params);

      if (ret !== 0 || errCode !== 0 || !data) {
        self._czc?.push(['_trackEvent', '注册页面', '注册', '', 0]);
        fMessage(msg, 'error');
        return;
      }
      self._czc?.push(['_trackEvent', '注册页面', '注册', '', 1]);
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

    * onTrigger_Login({ payload }: OnTrigger_Login_Action, { call, put, select }: EffectsCommandMap) {
      const { logonPage }: ConnectState = yield select(({ logonPage }: ConnectState) => ({
        logonPage,
      }));

      const params: Parameters<typeof FServiceAPI.User.login>[0] = {
        loginName: logonPage.usernameInput,
        password: logonPage.passwordInput,
        isRemember: 1,
      };

      const { data } = yield call(FServiceAPI.User.login, params);

      if (data?.userId) {
        if (logonPage.invitationCodeInput !== '') {
          window.location.replace(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.invitation({
            invitationCode: logonPage.invitationCodeInput,
          }));
        } else if (payload.goToUrl !== '') {
          window.location.replace(decodeURIComponent(payload.goToUrl));
        } else {
          // history.replace(FUtil.LinkTo.wallet());
          self.location.replace(FUtil.Format.completeUrlByDomain('www'));
        }
      } else {
        fMessage('账户或密码错误', 'error');
      }
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
