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

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

export interface TempModelType {
  namespace: 'temp';
  state: TempModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<TempModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: TempModelType = {
  namespace: 'temp',
  state: {
    info: null,
  },
  effects: {
    * fetchInfo({}: FetchInfoAction, {}: EffectsCommandMap) {

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
