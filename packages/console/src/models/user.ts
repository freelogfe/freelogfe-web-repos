import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {FServiceAPI} from "@freelog/tools-lib";

export interface UserModelState {
  info: null | {
    userId: number;
    username: string;
    nickname: string;
    email: string;
    tokenSn: string;
    mobile: string;
    userRole: number;
    createDate: string;
    updateDate: string;
    headImage: string;
  };
  // cookiesUserID: number;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'user/change';
  payload: Partial<UserModelState>;
}

export interface FetchUserInfoAction extends AnyAction {
  type: 'user/fetchUserInfo' | 'fetchUserInfo';
}

export interface MarketModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchUserInfo: (action: FetchUserInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<UserModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: MarketModelType = {
  namespace: 'user',
  state: {
    info: null,
    // cookiesUserID: -1,
  },
  effects: {
    * fetchUserInfo({}: FetchUserInfoAction, {call, put}: EffectsCommandMap) {
      // console.log('!!!!!#423423423423');
      const {data} = yield call(FServiceAPI.User.currentUserInfo);
      // console.log(data, 'data2q3e@@!!@@#!@#!@#@');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          info: data,
        }
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
    setup({dispatch}) {
      dispatch<FetchUserInfoAction>({
        type: 'fetchUserInfo',
      });
      // console.log('!@#$!@#$!@#$@#$');
    },
  }
};

export default Model;
