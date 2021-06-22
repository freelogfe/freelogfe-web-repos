import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from "@/models/connect";
import {FServiceAPI, FUtil} from "@freelog/tools-lib";
import fMessage from "@/components/fMessage";
import {history} from "@@/core/history";

export type LogonPageModelState = WholeReadonly<{
  usernameInput: string;
  usernameInputError: string;
  accountType: 'email' | 'mobile';
  emailInput: string;
  emailInputError: string;
  mobileInput: string;
  mobileInputError: string;
  verificationCodeInput: string;
  verificationCodeInputError: string;
  sendVerificationCodeStatus: number;
  passwordInput: string;
  passwordInputError: string;
}>;

export interface ChangeAction extends AnyAction {
  type: 'change' | 'logonPage/change';
  payload: Partial<LogonPageModelState>;
}

export interface InitModelStatesAction extends AnyAction {
  type: 'initModelStates';
}

export interface SendVerificationCodeAction extends AnyAction {
  type: 'logonPage/sendVerificationCode';
}

export interface VerifyExistsAction extends AnyAction {
  type: 'logonPage/verifyExists';
  payload: 'username' | 'email' | 'mobile';
}

export interface LogonAction extends AnyAction {
  type: 'logonPage/logon';
  payload?: {
    goTo: string;
  };
}

interface LogonPageModelType {
  namespace: 'logonPage';
  state: LogonPageModelState;
  effects: {
    sendVerificationCode: (action: SendVerificationCodeAction, effects: EffectsCommandMap) => void;
    initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
    verifyExists: (action: VerifyExistsAction, effects: EffectsCommandMap) => void;
    logon: (action: LogonAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<LogonPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: LogonPageModelState = {
  usernameInput: '',
  usernameInputError: '',
  accountType: 'mobile',
  emailInput: '',
  emailInputError: '',
  mobileInput: '',
  mobileInputError: '',
  verificationCodeInput: '',
  verificationCodeInputError: '',
  sendVerificationCodeStatus: 0,
  passwordInput: '',
  passwordInputError: '',
};

const Model: LogonPageModelType = {
  namespace: 'logonPage',
  state: initStates,
  effects: {
    * sendVerificationCode({}: SendVerificationCodeAction, {select, call, put}: EffectsCommandMap) {
      const {logonPage}: ConnectState = yield select(({logonPage}: ConnectState) => ({
        logonPage,
      }));
      const params: Parameters<typeof FServiceAPI.Captcha.sendVerificationCode>[0] = {
        loginName: logonPage.accountType === 'email' ? logonPage.emailInput : logonPage.mobileInput,
        authCodeType: 'register',
      };
      const {data} = yield call(FServiceAPI.Captcha.sendVerificationCode, params);
      // console.log(data, '!@#$!23412342134');
      if (data) {
        return;
      }
      fMessage('验证码发送失败', 'error');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          sendVerificationCodeStatus: 0,
        },
      });
    },
    * initModelStates({}: InitModelStatesAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * verifyExists({payload}: VerifyExistsAction, {select, call, put}: EffectsCommandMap) {
      const {logonPage}: ConnectState = yield select(({logonPage}: ConnectState) => ({
        logonPage,
      }));
      // console.log(payload, '!!!!!!!!++++++++');
      if (payload === 'username') {
        const params: Parameters<typeof FServiceAPI.User.userDetails>[0] = {
          username: logonPage.usernameInput,
        };
        const {data} = yield call(FServiceAPI.User.userDetails, params);
        if (data) {
          yield put<ChangeAction>({
            type: 'change',
            payload: {
              usernameInputError: '用户名已被占用',
            },
          });
        } else {
          yield put<ChangeAction>({
            type: 'change',
            payload: {
              usernameInputError: '',
            },
          });
        }
      } else if (payload === 'email') {
        const params: Parameters<typeof FServiceAPI.User.userDetails>[0] = {
          email: logonPage.emailInput,
        };
        const {data} = yield call(FServiceAPI.User.userDetails, params);
        if (data) {
          yield put<ChangeAction>({
            type: 'change',
            payload: {
              emailInputError: '邮箱已被占用注册',
            },
          });
        } else {
          yield put<ChangeAction>({
            type: 'change',
            payload: {
              emailInputError: '',
            },
          });
        }
      } else if (payload === 'mobile') {
        const params: Parameters<typeof FServiceAPI.User.userDetails>[0] = {
          mobile: logonPage.mobileInput,
        };
        const {data} = yield call(FServiceAPI.User.userDetails, params);
        if (data) {
          yield put<ChangeAction>({
            type: 'change',
            payload: {
              mobileInputError: '手机号已被占用注册',
            },
          });
        } else {
          yield put<ChangeAction>({
            type: 'change',
            payload: {
              mobileInputError: '',
            },
          });
        }
      }
    },
    * logon({payload }: LogonAction, {select, call, put}: EffectsCommandMap) {
      const {logonPage}: ConnectState = yield select(({logonPage}: ConnectState) => ({
        logonPage,
      }));

      const params: Parameters<typeof FServiceAPI.User.logon>[0] = {
        loginName: logonPage.accountType === 'email' ? logonPage.emailInput : logonPage.mobileInput,
        password: logonPage.passwordInput,
        username: logonPage.usernameInput,
        authCode: logonPage.verificationCodeInput,
      };

      const {data} = yield call(FServiceAPI.User.logon, params);
      if (!data) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            verificationCodeInputError: '验证码输入错误'
          },
        });
      } else {
        fMessage('注册成功，请登录', 'success');
        history.replace(FUtil.LinkTo.login(payload || {}))
      }
    },
  },
  reducers: {
    change(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  subscriptions: {
    setup({}) {

    }
  }
};

export default Model;
