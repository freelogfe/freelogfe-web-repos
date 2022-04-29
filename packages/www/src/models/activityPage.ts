import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';

export interface ActivityPageModelState {
  listState: 'loading' | 'noData' | 'noSearchResult' | 'loaded';
  // listMore: 'loading' | 'andMore' | 'noMore';
  list: {
    activityID: string;
    activityTitle: string;
    activityCover: string;
    status: 'starting' | 'ongoing' | 'end';
    persis: boolean;
    link: string;
    startTime: string;
    limitTime: string;
  }[];
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
  listState: 'loading',
  // listMore: 'loading' | 'andMore' | 'noMore';
  list: [],
};

const Model: ActivityPageModelType = {
  namespace: 'activityPage',
  state: initStates,
  effects: {
    * onMountPage({}: OnMountPageAction, { call, put }: EffectsCommandMap) {
      const params: Parameters<typeof FServiceAPI.Activity.list4Client>[0] = {};
      const { data } = yield call(FServiceAPI.Activity.list4Client, params);
      // console.log(data, 'data9023ulk');
      const list: ActivityPageModelState['list'] = (data as any[]).map<ActivityPageModelState['list'][0]>((d) => {
        return {
          activityID: d._id,
          activityTitle: d.title,
          activityCover: d.cover,
          status: 'starting',
          persis: d.persist,
          link: d.link,
          startTime: d.startTime ? FUtil.Format.formatDateTime(d.startTime) : '',
          limitTime: d.limitTime ? FUtil.Format.formatDateTime(d.limitTime) : '',
        };
      });
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          list: list,
          listState: list.length === 0 ? 'noData' : 'loaded',
        },
      });
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
