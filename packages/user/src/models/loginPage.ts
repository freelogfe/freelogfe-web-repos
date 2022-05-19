import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { history } from 'umi';
import fMessage from '@/components/fMessage';

export interface LoginPageModelState {
  username: string;
  usernameError: string;
  password: string;
  passwordError: string;
  btnState: 'normal' | 'verify' | 'jumping';
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'loginPage/change';
  payload: Partial<LoginPageModelState>;
}

export interface InitModelStatesAction extends AnyAction {
  type: 'initModelStates';
}

export interface LoginAction extends AnyAction {
  type: 'loginPage/login';
  payload: string; // 重定向链接
}

interface LoginPageModelType {
  namespace: 'loginPage';
  state: LoginPageModelState;
  effects: {
    login: (action: LoginAction, effects: EffectsCommandMap) => void;
    initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<LoginPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: LoginPageModelState = {
  username: '',
  usernameError: '',
  password: '',
  passwordError: '',
  btnState: 'normal',
};

const Model: LoginPageModelType = {
  namespace: 'loginPage',
  state: initStates,
  effects: {
    * login({ payload }: LoginAction, { call, put, select }: EffectsCommandMap) {
      const { loginPage }: ConnectState = yield select(({ loginPage }: ConnectState) => ({
        loginPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          btnState: 'verify',
        },
      });

      const cookiesUserID: number = FUtil.Tool.getUserIDByCookies();

      const params: Parameters<typeof FServiceAPI.User.login>[0] = {
        loginName: loginPage.username,
        password: loginPage.password,
        isRemember: 1,
      };

      const { data } = yield call(FServiceAPI.User.login, params);
      // console.log(JSON.stringify(data), 'data!!!!!!!11111111');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          btnState: 'normal',
        },
      });

      if (data?.userId) {
        if (payload) {
          if (cookiesUserID === -1 || data?.userId === cookiesUserID) {
            window.location.replace(decodeURIComponent(payload));
          } else {
            window.location.replace(new URL(decodeURIComponent(payload)).origin);
          }
        } else {
          // history.replace(FUtil.LinkTo.wallet());
          window.location.replace(FUtil.Format.completeUrlByDomain('www'));
        }
      } else {
        fMessage('账户或密码错误', 'error');
      }
    },
    * initModelStates({}: InitModelStatesAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
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
