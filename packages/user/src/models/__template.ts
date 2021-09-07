import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';

export type TempModelState = WholeReadonly<{
  info: null | {};
}>;

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<TempModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'temp/onMountPage';
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'temp/onUnmountPage';
}

interface TempModelType {
  namespace: 'temp';
  state: TempModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<TempModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: TempModelState = {
  info: null,
};

const Model: TempModelType = {
  namespace: 'temp',
  state: initStates,
  effects: {
    * onMountPage({}: OnMountPageAction, {}: EffectsCommandMap) {

    },
    * onUnmountPage({}: OnUnmountPageAction, {put}: EffectsCommandMap) {
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
