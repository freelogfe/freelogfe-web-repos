import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';

export interface ResourceVersionCreatorPageModelState {
  version: string;
  resourceObject: any;
  upthrow: string[];
  dependencies: any[];
  properties: any[];
  description: string;
}

export interface ResourceVersionCreatorModelType {
  namespace: 'resourceVersionCreatorPage';
  state: ResourceVersionCreatorPageModelState;
  effects: {
    fetchDataSource: Effect;
  };
  reducers: {
    changeDataSource: DvaReducer<ResourceVersionCreatorPageModelState, AnyAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceVersionCreatorModelType = {

  namespace: 'resourceVersionCreatorPage',

  state: {
    version: '1.2.3',
    resourceObject: '1241',
    upthrow: ['1234', '34234'],
    dependencies: [1243],
    properties: [234],
    description: '12423',
  },

  effects: {
    * fetchDataSource(_: AnyAction, {call, put}: EffectsCommandMap) {
      yield put({type: 'save'});
    },
  },

  reducers: {
    changeDataSource(state: ResourceVersionCreatorPageModelState, action: AnyAction):
      ResourceVersionCreatorPageModelState {
      return {...state, ...action.payload};
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },

};

export default Model;
