import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {FApiServer} from "@/services";

export type UserModelState = WholeReadonly<{
  userInfo: null | {
    userId: number;
    headImage: string;
    username: string;
    mobile: string;
    email: string;
  };
}>;

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<UserModelState>;
}

export interface InitModelStatesAction extends AnyAction {
  type: 'initModelStates';
}

export interface FetchInfoAction extends AnyAction {
  type: 'user/fetchInfo';
}

interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<UserModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: UserModelState = {
  userInfo: null,
};

const Model: UserModelType = {
  namespace: 'user',
  state: initStates,
  effects: {
    * fetchInfo({}: FetchInfoAction, {call, put}: EffectsCommandMap) {
      const {data} = yield call(FApiServer.User.currentUserInfo);
      // console.log(data, '!@#$!@#$@#$@#$');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          userInfo: {
            userId: data.userId,
            headImage: data.headImage,
            username: data.username,
            mobile: data.mobile,
            email: data.email,
          },
        },
      });
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
