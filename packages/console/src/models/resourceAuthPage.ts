import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {FAuthPanelProps} from "@/pages/resource/components/FAuthPanel";

export interface ResourceAuthPageModelState {
  policies: {
    id: string | number;
    title: string;
    status: 'executing' | 'stopped';
    code: string;
  }[] | null;
  contractsAuthorize: any[] | null;
  contractsAuthorized: FAuthPanelProps['dataSource'];
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

const policies: ResourceAuthPageModelState['policies'] = [{
  id: '12',
  title: '免费策略1',
  status: 'executing',
  code: 'for public:\n' +
    '  initial:\n' +
    '    active\n' +
    '    recontractable\n' +
    '    presentable\n' +
    '    terminate',
}, {
  id: '13',
  title: '免费策略2',
  status: 'executing',
  code: 'for public:\n' +
    '  initial:\n' +
    '    active\n' +
    '    recontractable\n' +
    '    presentable\n' +
    '    terminate',
}];

const contractsAuthorized: FAuthPanelProps['dataSource'] = [{
  id: 123,
  activated: true,
  title: 'ww-zh/PB-markdown',
  resourceType: 'markdown',
  version: '1.2.3',
  contracts: [{
    checked: true,
    title: '策略1',
    status: 'executing',
    code: 'initial:\n' +
      '  active\n' +
      '  recontractable\n' +
      '  presentable\n' +
      '  terminate',
    id: 'adhjtyrghgjhxdfthgasdhdflgkftr',
    date: '2019-10-10',
    versions: [{version: '10.5.2', checked: true}, {version: '10.5.3', checked: false}],
  }, {
    checked: true,
    title: '策略2',
    status: 'executing',
    code: 'initial:\n' +
      '  active\n' +
      '  recontractable\n' +
      '  presentable\n' +
      '  terminate',
    id: 'adhjtyrghgjhxdfthgasdhdfl2324gkftr',
    date: '2019-10-10',
    versions: [{version: '10.5.2', checked: true}, {version: '10.5.3', checked: false}],
  }],
  policies: [{
    id: '123423',
    title: '策略2',
    code: 'init:\n' +
      '  proceed to state_1 on action_1\n' +
      'state_1:\n' +
      '  active\n' +
      '  proceed to state_2 on action_2\n' +
      'state_2:\n' +
      '  active\n' +
      '  proceed to state_3 on action_3',
  }, {
    id: '12342323',
    title: '策略2',
    code: 'init:\n' +
      '  proceed to state_1 on action_1\n' +
      'state_1:\n' +
      '  active\n' +
      '  proceed to state_2 on action_2\n' +
      'state_2:\n' +
      '  active\n' +
      '  proceed to state_3 on action_3',
  }],
}];

const contractsAuthorize = [
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
];

const Model: ResourceAuthPageModelType = {

  namespace: 'resourceAuthPage',

  state: {
    policies: policies,
    contractsAuthorized: contractsAuthorized,
    contractsAuthorize: contractsAuthorize,
  },
  effects: {
    * fetchDataSource(_: AnyAction, {call, put}: EffectsCommandMap) {
      yield put({type: 'save'});
    }
  },
  reducers: {
    changeDataSource(state: ResourceAuthPageModelState, action: AnyAction):
      ResourceAuthPageModelState {
      return {...state, ...action.payload};
    },
  },
  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },
};

export default Model;
