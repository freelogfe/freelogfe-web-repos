import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {FAuthPanelProps} from "@/pages/resource/components/FAuthPanel";
import {update, UpdateParamsType} from "@/services/resources";
import {FetchDataSourceAction} from "@/models/resourceInfo";

export interface ResourceAuthPageModelState {
  policies: {
    id: string | number;
    title: string;
    status: 'executing' | 'stopped';
    code: string;
  }[] | null;
  contractsAuthorized: FAuthPanelProps['dataSource'];
  contractsAuthorize: {
    key: string,
    contractName: string,
    contractID: string,
    authorizedParty: string,
    createDate: string,
    status: 'executing' | 'stopped';
  }[] | null;
}

export interface ChangePoliciesAction {
  type: 'resourceAuthPage/changePolicies';
  payload: ResourceAuthPageModelState['policies'];

}

export interface ChangeContractsAuthorizedAction {
  type: 'resourceAuthPage/changeContractsAuthorized';
  payload: ResourceAuthPageModelState['contractsAuthorized'];
}

export interface ChangeContractsAuthorizeAction {
  type: 'resourceAuthPage/changeContractsAuthorize';
  payload: ResourceAuthPageModelState['contractsAuthorize'];
}

export interface UpdatePoliciesAction {
  type: 'resourceAuthPage/updatePolicies';
  payload: Partial<Exclude<ResourceAuthPageModelState['policies'], null>[number]>;
  id: string;
}

export interface ResourceAuthPageModelType {
  namespace: 'resourceAuthPage';
  state: ResourceAuthPageModelState;
  effects: {
    fetchDataSource: Effect;
    updatePolicies: (action: UpdatePoliciesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    changePolicies: DvaReducer<ResourceAuthPageModelState, ChangePoliciesAction>;
    changeContractsAuthorized: DvaReducer<ResourceAuthPageModelState, ChangeContractsAuthorizedAction>;
    changeContractsAuthorize: DvaReducer<ResourceAuthPageModelState, ChangeContractsAuthorizeAction>;
  };
  subscriptions: { setup: Subscription };
}

const policies: ResourceAuthPageModelState['policies'] = [1, 2, 3, 4, 5, 6].map((i) => ({
  id: i,
  title: '免费策略' + i,
  status: 'executing',
  code: 'for public:\n' +
    '  initial:\n' +
    '    active\n' +
    '    recontractable\n' +
    '    presentable\n' +
    '    terminate',
}));

const contractsAuthorized: FAuthPanelProps['dataSource'] = [1, 2, 3, 4, 5, 6].map((i) => ({
  id: i,
  activated: i === 2,
  title: 'ww-zh/PB-markdown' + i,
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
}));

const contractsAuthorize: ResourceAuthPageModelState['contractsAuthorize'] = [
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
    policies: [],
    contractsAuthorized: contractsAuthorized,
    contractsAuthorize: contractsAuthorize,
  },
  effects: {
    * fetchDataSource(_: AnyAction, {call, put}: EffectsCommandMap) {
      yield put({type: 'save'});
    },
    * updatePolicies(action: UpdatePoliciesAction, {call, put}: EffectsCommandMap) {
      const params = {
        resourceId: action.id,
        policyChangeInfo: {
          [action.payload.id ? 'updatePolicies' : 'addPolicies']: [
            {
              policyId: action.payload.id,
              policyName: action.payload.title,
              status: action.payload.status === 'stopped' ? 0 : 1,
              policyText: action.payload.code,
            }
          ],
        },
      };
      yield call(update, params);
      yield put<FetchDataSourceAction>({
        type: 'resourceInfo/fetchDataSource',
        payload: action.id,
      });
    },
  },
  reducers: {
    changePolicies(state: ResourceAuthPageModelState, action: ChangePoliciesAction): ResourceAuthPageModelState {
      return {...state, policies: action.payload};
    },
    changeContractsAuthorized(state: ResourceAuthPageModelState, action: ChangeContractsAuthorizedAction): ResourceAuthPageModelState {
      return {...state, contractsAuthorized: action.payload};
    },
    changeContractsAuthorize(state: ResourceAuthPageModelState, action: ChangeContractsAuthorizeAction): ResourceAuthPageModelState {
      return {...state, contractsAuthorize: action.payload};
    },
  },
  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },
};

export default Model;
