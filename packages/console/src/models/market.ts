import {Subscription, Reducer, Effect} from 'umi';
import {AnyAction} from 'redux';
import {EffectsCommandMap, SubscriptionAPI} from 'dva';

export interface MarketModelState {
  dataSource: any[];
}

export interface MarketModelType {
  namespace: 'market';
  state: MarketModelState;
  effects: {
    fetchDataSource: Effect;
  };
  reducers: {
    changeDataSource: Reducer<MarketModelState>;
  };
  subscriptions: { setup: Subscription };
}

const MarketModel: MarketModelType = {

  namespace: 'market',

  state: {
    dataSource: [],
  },

  effects: {
    * fetchDataSource(_: AnyAction, {call, put}: EffectsCommandMap) {
      yield put({type: 'save'});
    },
  },

  reducers: {
    changeDataSource(state: MarketModelState, action: AnyAction) {
      return {...state, ...action.payload};
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },

};

export default MarketModel;
