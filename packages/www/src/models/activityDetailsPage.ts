import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { FServiceAPI } from '@freelog/tools-lib';

export interface ActivityDetailsPageModelState {
  pageState: 'loading' | 'loaded' | 'noDate';
  activityID: string;
  showActivity: '' | 'ResourceCompetition';
}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<ActivityDetailsPageModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'activityDetailsPage/onMountPage';
  payload: {
    activityID: string;
  };
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'activityDetailsPage/onUnmountPage';
}

interface ActivityDetailsPageModelType {
  namespace: 'activityDetailsPage';
  state: ActivityDetailsPageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ActivityDetailsPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: ActivityDetailsPageModelState = {
  pageState: 'loading',
  activityID: '',
  showActivity: '',
};

const Model: ActivityDetailsPageModelType = {
  namespace: 'activityDetailsPage',
  state: initStates,
  effects: {
    * onMountPage({ payload }: OnMountPageAction, { call, put }: EffectsCommandMap) {
      if (!payload.activityID) {
        return;
      }
      const params: Parameters<typeof FServiceAPI.Activity.find4Client>[0] = {
        _id: payload.activityID,
      };
      const { ret, errCode, data } = yield call(FServiceAPI.Activity.find4Client, params);
      if (ret !== 0 || errCode !== 0 || !data) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            pageState: 'noDate',
          },
        });
        return;
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          pageState: 'loaded',
          activityID: payload.activityID,
          showActivity: data.link,
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
