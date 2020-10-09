import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';

export interface MarketResourcePageState {
  info: null | {};
}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<MarketResourcePageState>;
}

interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

export interface MarketResourcePageModelType {
  namespace: 'marketResourcePage';
  state: MarketResourcePageState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<MarketResourcePageState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: MarketResourcePageModelType = {
  namespace: 'marketResourcePage',
  state: {
    info: null,
  },
  effects: {
    * fetchInfo({}, {}) {

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
