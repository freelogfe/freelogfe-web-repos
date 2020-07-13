import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';

export interface ResourceInfoPageModelState {
  name: string;
}

export interface ResourceInfoPageModelType {
  namespace: 'resourceInfoPage';
  state: ResourceInfoPageModelState;
  effects: {
    fetchDataSource: Effect;
  };
  reducers: {
    changeDataSource: DvaReducer<ResourceInfoPageModelState, AnyAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceInfoPageModelType = {

  namespace: 'resourceInfoPage',

  state: {
    name: 'ww-zh/freelog-waterfall-picture1'
  },

  effects: {
    * fetchDataSource(_: AnyAction, {call, put}: EffectsCommandMap) {
      yield put({type: 'save'});
    },
  },

  reducers: {
    changeDataSource(state: ResourceInfoPageModelState, action: AnyAction): ResourceInfoPageModelState {
      return {...state, ...action.payload};
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },

};

export default Model;
