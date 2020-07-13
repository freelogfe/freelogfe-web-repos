import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';

export interface ResourceAuthPageModelState {
  policies: any[] | null;
  contractsAuthorize: any[] | null;
  contractsAuthorized: any[] | null;
}

export interface ResourceAuthPageModelType {
  namespace: 'resourceAuthPage';
  state: ResourceAuthPageModelState;
  effects: {
    fetchDataSource: Effect;
  };
  reducers: {
    changeDataSource: DvaReducer<ResourceAuthPageModelState, AnyAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceAuthPageModelType = {

  namespace: 'resourceAuthPage',

  state: {
    policies: null,
    contractsAuthorized: [],
    contractsAuthorize: [
      {
        key: '1',
        contractName: '免费策略1',
        contractID: 'asjfgjiergingnsdfshskh',
        authorizedParty: '资源xxx',
        createDate: '2020-05-19',
        status: 'executing'
      },
      {
        key: '2',
        contractName: '免费',
        contractID: 'injgshudfgnsgkzsityre',
        authorizedParty: '节点xxx',
        createDate: '2020-05-19',
        status: 'executing'
      },
    ],
  },

  effects: {
    * fetchDataSource(_: AnyAction, {call, put}: EffectsCommandMap) {
      yield put({type: 'save'});
    },
  },

  reducers: {
    changeDataSource(state: ResourceAuthPageModelState, action: AnyAction): ResourceAuthPageModelState {
      return {...state, ...action.payload};
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },

};

export default Model;
