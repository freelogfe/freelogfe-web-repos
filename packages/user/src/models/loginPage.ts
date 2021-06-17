import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from "@/models/connect";
import {FServiceAPI} from "@freelog/tools-lib";

export interface LoginPageModelState {
  username: string;
  usernameError: string;
  password: string;
  passwordError: string;
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
};

const Model: LoginPageModelType = {
  namespace: 'loginPage',
  state: initStates,
  effects: {
    * login({payload}: LoginAction, {call, put, select}: EffectsCommandMap) {
      const {loginPage}: ConnectState = yield select(({loginPage}: ConnectState) => ({
        loginPage,
      }));

      const params: Parameters<typeof FServiceAPI.User.login>[0] = {
        loginName: loginPage.username,
        password: loginPage.password,
      };

      const {data} = yield call(FServiceAPI.User.login, params);
      console.log(data, 'data!!!!!!!11111111');
    },
    * initModelStates({}: InitModelStatesAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
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
