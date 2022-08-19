import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';

export interface RewardPageModelState {
  info: null | {};
}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<RewardPageModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'rewardPage/onMountPage';
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'rewardPage/onUnmountPage';
}

interface RewardPageModelType {
  namespace: 'rewardPage';
  state: RewardPageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<RewardPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: RewardPageModelState = {
  info: null,
};

const Model: RewardPageModelType = {
  namespace: 'rewardPage',
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
