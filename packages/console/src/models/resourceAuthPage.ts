import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {FAuthPanelProps} from "@/pages/resource/components/FAuthPanel";
import {update, UpdateParamsType} from "@/services/resources";
import {FetchDataSourceAction} from "@/models/resourceInfo";
import {policiesList, PoliciesListParamsType} from "@/services/policies";
import {contracts, ContractsParamsType} from "@/services/contracts";

export interface ResourceAuthPageModelState {
  policies: {
    id: string;
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

export interface UpdatePoliciesAction {
  type: 'resourceAuthPage/updatePolicies';
  payload: Partial<Exclude<ResourceAuthPageModelState['policies'], null>[number]>;
  id: string;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceAuthPage/change',
  payload: Partial<ResourceAuthPageModelState>;
}

export interface FetchPoliciesAction extends AnyAction {
  type: 'resourceAuthPage/fetchPolicies',
  payload: { policyId: string, policyName: string, status: 0 | 1 }[];
}

export interface FetchAuthorizedAction extends AnyAction {
  type: 'resourceAuthPage/fetchAuthorized',
  payload: string;
}

export interface FetchAuthorizeAction extends AnyAction {
  type: 'resourceAuthPage/fetchAuthorize',
  payload: string;
}

export interface ResourceAuthPageModelType {
  namespace: 'resourceAuthPage';
  state: ResourceAuthPageModelState;
  effects: {
    fetchPolicies: (action: FetchPoliciesAction, effects: EffectsCommandMap) => void;
    updatePolicies: (action: UpdatePoliciesAction, effects: EffectsCommandMap) => void;
    fetchAuthorized: (action: FetchAuthorizedAction, effects: EffectsCommandMap) => void;
    fetchAuthorize: (action: FetchAuthorizeAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceAuthPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

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
    * fetchPolicies({payload}: FetchPoliciesAction, {call, put}: EffectsCommandMap) {
      if (payload.length === 0) {
        return;
      }
      const params: PoliciesListParamsType = {
        policyIds: payload.map((i) => i.policyId).join(','),
      };
      const {data} = yield call(policiesList, params);
      // console.log(data, '#EDDDDDSDF');
      const policies: ResourceAuthPageModelState['policies'] = payload.map((i) => ({
        id: i.policyId,
        title: i.policyName,
        status: i.status === 1 ? 'executing' : 'stopped',
        code: (data.find((j: any) => j.policyId === i.policyId) || {policyText: ''}).policyText,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          policies: policies,
        }
      });
    },
    * updatePolicies(action: UpdatePoliciesAction, {call, put}: EffectsCommandMap) {
      const params = {
        resourceId: action.id,
        // [action.payload.id ? 'updatePolicies' : 'addPolicies']: [
        [action.payload.status ? 'updatePolicies' : 'addPolicies']: [
          {
            policyId: action.payload.id,
            status: action.payload.status === 'stopped' ? 0 : 1,
          }
        ],
      };
      yield call(update, params);
      yield put<FetchDataSourceAction>({
        type: 'resourceInfo/fetchDataSource',
        payload: action.id,
      });
    },
    * fetchAuthorized({payload}: FetchAuthorizedAction, {call}: EffectsCommandMap) {
      const params: ContractsParamsType = {
        identityType: 2,
        licenseeId: payload,
      };
      yield call(contracts, params);
    },
    * fetchAuthorize({payload}: FetchAuthorizeAction, {call}: EffectsCommandMap) {
      const params: ContractsParamsType = {
        identityType: 1,
        licensorId: payload,
      };
      yield call(contracts, params);
    },
  },
  reducers: {
    change(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    // changePolicies(state: ResourceAuthPageModelState, action: ChangePoliciesAction): ResourceAuthPageModelState {
    //   return {...state, policies: action.payload};
    // },
    // changeContractsAuthorized(state: ResourceAuthPageModelState, action: ChangeContractsAuthorizedAction): ResourceAuthPageModelState {
    //   return {...state, contractsAuthorized: action.payload};
    // },
    // changeContractsAuthorize(state: ResourceAuthPageModelState, action: ChangeContractsAuthorizeAction): ResourceAuthPageModelState {
    //   return {...state, contractsAuthorize: action.payload};
    // },
  },
  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },
};

export default Model;
