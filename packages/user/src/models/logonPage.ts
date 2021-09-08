import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';
import { history } from '@@/core/history';

export type LogonPageModelState = WholeReadonly<{

  showView: 'logon' | 'success';

  usernameInput: string;
  usernameInputError: string;
  accountType: 'phone' | 'email';
  phoneInput: string;
  phoneInputError: string;
  emailInput: string;
  emailInputError: string;
  verificationCodeInput: string;
  verificationCodeInputError: string;
  verifyCodeReSendWait: number,
  passwordInput: string;
  passwordInputError: string;

  waitingTimeToLogin: number;
}>;

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<LogonPageModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'logonPage/onMountPage';
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

export interface OnChangeVerifyCodeInputAction extends AnyAction {
  type: 'logonPage/onChangeVerifyCodeInput';
  payload: {
    value: string;
  };
}

export interface OnBlurVerifyCodeInputAction extends AnyAction {
  type: 'logonPage/onBlurVerifyCodeInput';
}

export interface OnClickSendVerifyCodeBtnAction extends AnyAction {
  type: 'logonPage/onClickSendVerifyCodeBtn';
}

export interface OnChangeVerifyCodeReSendWaitAction extends AnyAction {
  type: 'logonPage/onChangeVerifyCodeReSendWait';
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

export interface OnClickLogonBtnAction extends AnyAction {
  type: 'logonPage/onClickLogonBtn';
}

export interface OnChangeWaitingTimeAction extends AnyAction {
  type: 'logonPage/onChangeWaitingTime';
  payload: {
    value: number;
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
    onChangeVerifyCodeInput: (action: OnChangeVerifyCodeInputAction, effects: EffectsCommandMap) => void;
    onBlurVerifyCodeInput: (action: OnBlurVerifyCodeInputAction, effects: EffectsCommandMap) => void;
    onClickSendVerifyCodeBtn: (action: OnClickSendVerifyCodeBtnAction, effects: EffectsCommandMap) => void;
    onChangeVerifyCodeReSendWait: (action: OnChangeVerifyCodeReSendWaitAction, effects: EffectsCommandMap) => void;
    onChangePasswordInput: (action: OnChangePasswordInputAction, effects: EffectsCommandMap) => void;
    onBlurPasswordInput: (action: OnBlurPasswordInputAction, effects: EffectsCommandMap) => void;
    onClickLogonBtn: (action: OnClickLogonBtnAction, effects: EffectsCommandMap) => void;
    onChangeWaitingTime: (action: OnChangeWaitingTimeAction, effects: EffectsCommandMap) => void;
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
  verificationCodeInput: '',
  verificationCodeInputError: '',
  verifyCodeReSendWait: 0,
  passwordInput: '',
  passwordInputError: '',

  waitingTimeToLogin: 0,
};

const Model: LogonPageModelType = {
  namespace: 'logonPage',
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
    * onChangeUsernameInput({ payload }: OnChangeUsernameInputAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          usernameInput: payload.value,
        },
      });
    },
    * onBlurUsernameInput({}: OnBlurUsernameInputAction, { select, put, call }: EffectsCommandMap) {
      // console.log('onBlurUsernameInputonBlurUsernameInputlllll');
      const { logonPage }: ConnectState = yield select(({ logonPage }: ConnectState) => ({
        logonPage,
      }));

      let usernameInputError: string = '';

      if (!logonPage.usernameInput) {
        usernameInputError = '用户名称不能为空';
      } else if (!FUtil.Regexp.USERNAME.test(logonPage.usernameInput)) {
        usernameInputError = '用户名只能使用小写字母、数字或短横线（-）；必须以小写字母或数字开头和结尾';
      }

      if (!usernameInputError) {
        const params: Parameters<typeof FServiceAPI.User.userDetails>[0] = {
          username: logonPage.usernameInput,
        };
        const { data } = yield call(FServiceAPI.User.userDetails, params);
        if (data) {
          usernameInputError = '用户名已被占用';
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
        const { data } = yield call(FServiceAPI.User.userDetails, params);
        if (data) {
          phoneInputError = '手机号已被占用注册';
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
          emailInputError = '邮箱已被占用注册';
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
          verificationCodeInput: payload.value,
        },
      });
    },
    * onBlurVerifyCodeInput(action: OnBlurVerifyCodeInputAction, { select, put }: EffectsCommandMap) {
      const { logonPage }: ConnectState = yield select(({ logonPage }: ConnectState) => ({
        logonPage,
      }));

      let verificationCodeInputError: string = '';

      if (!logonPage.verificationCodeInput) {
        verificationCodeInputError = '验证码不能为空';
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          verificationCodeInputError,
        },
      });
    },
    * onClickSendVerifyCodeBtn(action: OnClickSendVerifyCodeBtnAction, { select, call, put }: EffectsCommandMap) {
      const { logonPage }: ConnectState = yield select(({ logonPage }: ConnectState) => ({
        logonPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          verifyCodeReSendWait: 60,
        },
      });

      const params: Parameters<typeof FServiceAPI.Captcha.sendVerificationCode>[0] = {
        loginName: logonPage.accountType === 'email' ? logonPage.emailInput : logonPage.phoneInput,
        authCodeType: 'register',
      };
      const { data } = yield call(FServiceAPI.Captcha.sendVerificationCode, params);
      if (data) {
        return;
      }
      fMessage('验证码发送失败', 'error');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          verifyCodeReSendWait: 0,
        },
      });
    },
    * onChangeVerifyCodeReSendWait({ payload }: OnChangeVerifyCodeReSendWaitAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          verifyCodeReSendWait: payload.value,
        },
      });
    },
    * onChangePasswordInput({ payload }: OnChangePasswordInputAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          passwordInput: payload.value,
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
      } else if (!FUtil.Regexp.PASSWORD.test(logonPage.passwordInput)) {
        passwordInputError = '密码必须包含数字和字母；且由6-24个字符组成';
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          passwordInputError,
        },
      });

    },
    * onClickLogonBtn(action: OnClickLogonBtnAction, { select, call, put }: EffectsCommandMap) {
      const { logonPage }: ConnectState = yield select(({ logonPage }: ConnectState) => ({
        logonPage,
      }));

      const params: Parameters<typeof FServiceAPI.User.logon>[0] = {
        loginName: logonPage.accountType === 'email' ? logonPage.emailInput : logonPage.phoneInput,
        password: logonPage.passwordInput,
        username: logonPage.usernameInput,
        authCode: logonPage.verificationCodeInput,
      };

      const { data, msg } = yield call(FServiceAPI.User.logon, params);
      if (!data) {
        fMessage(msg, 'error');
      } else {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            showView: 'success',
            waitingTimeToLogin: 3,
          },
        });
      }

    },
    * onChangeWaitingTime({ payload }: OnChangeWaitingTimeAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          waitingTimeToLogin: payload.value,
        },
      });
    },
    // * sendVerificationCode({}: SendVerificationCodeAction, { select, call, put }: EffectsCommandMap) {
    //   const { logonPage }: ConnectState = yield select(({ logonPage }: ConnectState) => ({
    //     logonPage,
    //   }));
    //   const params: Parameters<typeof FServiceAPI.Captcha.sendVerificationCode>[0] = {
    //     loginName: logonPage.accountType === 'email' ? logonPage.emailInput : logonPage.mobileInput,
    //     authCodeType: 'register',
    //   };
    //   const { data } = yield call(FServiceAPI.Captcha.sendVerificationCode, params);
    //   // console.log(data, '!@#$!23412342134');
    //   if (data) {
    //     return;
    //   }
    //   fMessage('验证码发送失败', 'error');
    //   yield put<ChangeAction>({
    //     type: 'change',
    //     payload: {
    //       sendVerificationCodeStatus: 0,
    //     },
    //   });
    // },
    // * initModelStates({}: InitModelStatesAction, { put }: EffectsCommandMap) {
    //   yield put<ChangeAction>({
    //     type: 'change',
    //     payload: initStates,
    //   });
    // },
    // * verifyExists({ payload }: VerifyExistsAction, { select, call, put }: EffectsCommandMap) {
    //   const { logonPage }: ConnectState = yield select(({ logonPage }: ConnectState) => ({
    //     logonPage,
    //   }));
    //   // console.log(payload, '!!!!!!!!++++++++');
    //   if (payload === 'username') {
    //     const params: Parameters<typeof FServiceAPI.User.userDetails>[0] = {
    //       username: logonPage.usernameInput,
    //     };
    //     const { data } = yield call(FServiceAPI.User.userDetails, params);
    //     if (data) {
    //       yield put<ChangeAction>({
    //         type: 'change',
    //         payload: {
    //           usernameInputError: '用户名已被占用',
    //         },
    //       });
    //     } else {
    //       yield put<ChangeAction>({
    //         type: 'change',
    //         payload: {
    //           usernameInputError: '',
    //         },
    //       });
    //     }
    //   } else if (payload === 'email') {
    //     const params: Parameters<typeof FServiceAPI.User.userDetails>[0] = {
    //       email: logonPage.emailInput,
    //     };
    //     const { data } = yield call(FServiceAPI.User.userDetails, params);
    //     if (data) {
    //       yield put<ChangeAction>({
    //         type: 'change',
    //         payload: {
    //           emailInputError: '邮箱已被占用注册',
    //         },
    //       });
    //     } else {
    //       yield put<ChangeAction>({
    //         type: 'change',
    //         payload: {
    //           emailInputError: '',
    //         },
    //       });
    //     }
    //   } else if (payload === 'mobile') {
    //     const params: Parameters<typeof FServiceAPI.User.userDetails>[0] = {
    //       mobile: logonPage.mobileInput,
    //     };
    //     const { data } = yield call(FServiceAPI.User.userDetails, params);
    //     if (data) {
    //       yield put<ChangeAction>({
    //         type: 'change',
    //         payload: {
    //           mobileInputError: '手机号已被占用注册',
    //         },
    //       });
    //     } else {
    //       yield put<ChangeAction>({
    //         type: 'change',
    //         payload: {
    //           mobileInputError: '',
    //         },
    //       });
    //     }
    //   }
    // },
    // * logon({ payload }: LogonAction, { select, call, put }: EffectsCommandMap) {
    //   const { logonPage }: ConnectState = yield select(({ logonPage }: ConnectState) => ({
    //     logonPage,
    //   }));
    //
    //   const params: Parameters<typeof FServiceAPI.User.logon>[0] = {
    //     loginName: logonPage.accountType === 'email' ? logonPage.emailInput : logonPage.mobileInput,
    //     password: logonPage.passwordInput,
    //     username: logonPage.usernameInput,
    //     authCode: logonPage.verificationCodeInput,
    //   };
    //
    //   const { data } = yield call(FServiceAPI.User.logon, params);
    //   if (!data) {
    //     yield put<ChangeAction>({
    //       type: 'change',
    //       payload: {
    //         verificationCodeInputError: '验证码输入错误',
    //       },
    //     });
    //   } else {
    //     fMessage('注册成功，请登录', 'success');
    //     history.replace(FUtil.LinkTo.login(payload || {}));
    //   }
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
