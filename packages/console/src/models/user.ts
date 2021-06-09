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
  cookiesUserID: number;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'user/change';
  payload: Partial<UserModelState>;
}

interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

export interface MarketModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
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
    cookiesUserID: -1,
  },
  effects: {
    * fetchInfo({}, {call, put}) {
      const {data} = yield call(FServiceAPI.User.currentUserInfo);
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
      dispatch<FetchInfoAction>({
        type: 'fetchInfo',
      });
    },
  }
};

export default Model;
