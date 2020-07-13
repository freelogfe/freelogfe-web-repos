import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';

export interface ResourceVersionPageModelState {
  version: string;
}

export interface ResourceVersionModelType {
  namespace: 'resourceVersionPage';
  state: ResourceVersionPageModelState;
  effects: {
    fetchDataSource: Effect;
  };
  reducers: {
    changeDataSource: DvaReducer<ResourceVersionPageModelState, AnyAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceVersionModelType = {

  namespace: 'resourceVersionPage',

  state: {
    version: '1.2.3',
  },

  effects: {
    * fetchDataSource(_: AnyAction, {call, put}: EffectsCommandMap) {
      yield put({type: 'save'});
    },
  },

  reducers: {
    changeDataSource(state: ResourceVersionPageModelState, action: AnyAction): ResourceVersionPageModelState {
      return {...state, ...action.payload};
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },

};

export default Model;
