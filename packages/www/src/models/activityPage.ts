import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { FServiceAPI } from '@freelog/tools-lib';

export interface ActivityPageModelState {
  // info: null | {};
  list: {
    activityID: string;
    activityTitle: string;
    activityCover: string;
    persis: boolean;
    link: string;
    startTime: string | null;
    limitTime: string | null;
  }[] | null;
}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<ActivityPageModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'activityPage/onMountPage';
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'activityPage/onUnmountPage';
}

interface ActivityPageModelType {
  namespace: 'activityPage';
  state: ActivityPageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ActivityPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: ActivityPageModelState = {
  list: null,
};

const Model: ActivityPageModelType = {
  namespace: 'activityPage',
  state: initStates,
  effects: {
    * onMountPage({}: OnMountPageAction, { call, put }: EffectsCommandMap) {
      const params: Parameters<typeof FServiceAPI.Activity.list4Client>[0] = {};
      const { data } = yield call(FServiceAPI.Activity.list4Client, params);
      console.log(data, 'data9023ulk');
    },
    * onUnmountPage({}: OnUnmountPageAction, { put }: EffectsCommandMap) {
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
