import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {presentableDetails, PresentableDetailsParamsType1} from "@/services/presentables";
import {ConnectState} from "@/models/connect";
import {batchContracts, BatchContractsParamsType} from "@/services/contracts";
import {batchInfo, BatchInfoParamsType} from "@/services/resources";

export type ExhibitInfoPageModelState = WholeReadonly<{
  presentableId: string;
  // info: null | {};

  nodeName: string;
  resourceName: string;
  resourceType: string;
  isOnline: boolean;

  policies: {
    id: string;
    name: string;
    text: string;
    status: 0 | 1;
  }[];

  associated: {
    selected: boolean;
    id: string;
    name: string;
    type: string;
    contracts: {
      name: string;
      status: 0 | 1;
      id: string;
      text: string;
      createTime: string;
    }[];
    policies: {
      id: string;
      name: string;
      text: string;
    }[];
  }[];

  pCover: string;
  pTitle: string;
  pInputTitle: string | null;
  pTags: string[];
  pTagInput: string;

  pBaseAttrs: {
    key: string;
    value: string;
  }[];

  pCustomAttrs: {
    key: string;
    value: string;
    option: string[];
  }[];

  pAddCustomModalVisible: boolean;
  pAddCustomKey: string;
  pAddCustomValue: string;
  pAddCustomDescription: string;

}>;

export interface ChangeAction extends AnyAction {
  type: 'change' | 'exhibitInfoPage/change';
  payload: Partial<ExhibitInfoPageModelState>;
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo' | 'exhibitInfoPage/fetchInfo';
}

export interface ExhibitInfoPageModelType {
  namespace: 'exhibitInfoPage';
  state: ExhibitInfoPageModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ExhibitInfoPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: ExhibitInfoPageModelType = {
  namespace: 'exhibitInfoPage',
  state: {
    presentableId: '',

    nodeName: '',
    resourceName: '',
    resourceType: '',
    isOnline: false,

    policies: [],
    associated: [],

    pCover: '',
    pTitle: '',
    pInputTitle: null,
    pTags: [],
    pTagInput: '',

    pBaseAttrs: [],
    pCustomAttrs: [],

    pAddCustomModalVisible: false,
    pAddCustomKey: '',
    pAddCustomValue: '',
    pAddCustomDescription: '',
  },
  effects: {
    * fetchInfo({}: FetchInfoAction, {call, select, put}: EffectsCommandMap) {
      const {exhibitInfoPage, nodes}: ConnectState = yield select(({exhibitInfoPage, nodes}: ConnectState) => ({
        exhibitInfoPage,
        nodes,
      }));

      const params: PresentableDetailsParamsType1 = {
        presentableId: exhibitInfoPage.presentableId,
        isLoadCustomPropertyDescriptors: 1,
      };
      const {data} = yield call(presentableDetails, params);
      // console.log(data, 'data2309jdsfa');
      const result: HandleRelationResult = yield call(handleRelation, data.resolveResources);

      const nodeName: string = nodes.list.find((n) => n.nodeId === data.nodeId)?.nodeName || '';

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeName: nodeName,
          resourceName: data.presentableName,
          resourceType: data.resourceInfo.resourceType,
          isOnline: data.onlineStatus === 1,
          policies: [],
          associated: result.map((r, index) => ({
            selected: index === 0,
            id: r.resourceId,
            name: r.resourceName,
            type: r.resourceType,
            contracts: r.contracts.map((c) => ({
              name: c.contractName,
              status: c.status,
              id: c.contractId,
              text: c.policyText,
              createTime: c.createDate,
            })),
            policies: r.policies.map((p) => ({
              id: p.policyId,
              name: p.policyName,
              text: p.policyText,
            }))
          })),
          pCover: data.coverImages[0] || '',
          pTitle: data.presentableTitle,
          pTags: data.tags,
        },
      })
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

type HandleRelationParams = {
  contracts: {
    contractId: string;
    policyId: string;
  }[];
  resourceId: string;
  resourceName: string;
}[];

type HandleRelationResult = {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  status: 0 | 1;
  contracts: {
    contractId: string;
    contractName: string;
    createDate: string
    policyText: string
    status: 0 | 1;
  }[];
  policies: {
    policyId: string;
    policyName: string;
    policyText: string;
    status: 0 | 1;
  }[];
}[];

async function handleRelation(params: HandleRelationParams): Promise<HandleRelationResult> {
  // console.log(params, 'params0923jafdsl');
  const resourceIds: string[] = params.map((r) => r.resourceId);
  const contractIds: string[] = params.map((c) => c.contracts.map((cs) => cs.contractId)).flat();
  const contractPolicyIds: string[] = params.map((c) => c.contracts.map((cs) => cs.policyId)).flat();

  const params0: BatchInfoParamsType = {
    resourceIds: resourceIds.join(','),
    isLoadPolicyInfo: 1,
  };

  const params1: BatchContractsParamsType = {
    contractIds: contractIds.join(','),
    isLoadPolicyInfo: 1,
  };

  const [{data: data0}, {data: data1}]: any = await Promise.all([batchInfo(params0), batchContracts(params1)]);
  // console.log(data0, data1, 'data0, data123rfsda');

  const result = params.map((r) => {
    const resource = data0.find((dr: any) => dr.resourceId === r.resourceId);
    return {
      resourceId: resource.resourceId,
      resourceName: resource.resourceName,
      resourceType: resource.resourceType,
      status: resource.status,
      contracts: r.contracts.map((c) => {
        const contract = data1.find((dc: any) => dc.contractId === c.contractId);
        return {
          contractId: contract.contractId,
          contractName: contract.contractName,
          createDate: contract.createDate,
          policyText: contract.policyInfo.policyText,
          status: contract.status,
        };
      }),
      policies: resource.policies
        .filter((p: any) => !contractPolicyIds.includes(p.policyId))
        .map((p: any) => {
          return {
            policyId: p.policyId,
            policyName: p.policyName,
            policyText: p.policyText,
            status: p.status,
          };
        }),
    };
  });
  // console.log(result, 'result2309jd');
  return result;
}
