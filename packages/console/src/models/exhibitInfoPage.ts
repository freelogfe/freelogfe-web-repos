import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {
  presentableDetails,
  PresentableDetailsParamsType1, PresentablesOnlineParamsType, presentablesOnlineStatus,
  updatePresentable,
  UpdatePresentableParamsType, updateRewriteProperty, UpdateRewritePropertyParamsType
} from '@/services/presentables';
import {ConnectState} from '@/models/connect';
import {batchContracts, BatchContractsParamsType} from '@/services/contracts';
import {batchInfo, BatchInfoParamsType} from '@/services/resources';

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
  addPolicyDrawerVisible: boolean;

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
      policyId: string;
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
    defaultValue?: string;
    option?: string[];
    remark: string;
    isEditing?: boolean;
  }[];

  pAddCustomModalVisible: boolean;
  pAddCustomKey: string;
  pAddCustomKeyError: string;
  pAddCustomValue: string;
  pAddCustomValueError: string;
  pAddCustomDescription: string;
  pAddCustomDescriptionError: string;

}>;

export interface ChangeAction extends AnyAction {
  type: 'change' | 'exhibitInfoPage/change';
  payload: Partial<ExhibitInfoPageModelState>;
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo' | 'exhibitInfoPage/fetchInfo';
}

export interface AddAPolicyAction extends AnyAction {
  type: 'exhibitInfoPage/addAPolicy';
  payload: {
    title: string;
    text: string;
  };
}

export interface UpdateAPolicyAction extends AnyAction {
  type: 'exhibitInfoPage/updateAPolicy';
  payload: {
    id: string;
    status: 0 | 1
  };
}

export interface UpdateBaseInfoAction extends AnyAction {
  type: 'exhibitInfoPage/updateBaseInfo';
  payload: {
    pCover?: string;
    pTitle?: string;
    pTags?: string[];
  };
}

export interface UpdateStatusAction extends AnyAction {
  type: 'exhibitInfoPage/updateStatus';
  payload: 0 | 1;
}

export interface UpdateRelationAction extends AnyAction {
  type: 'exhibitInfoPage/updateRelation';
  payload: {
    resourceId: string;
    policyId: string;
  };
}

export interface UpdateRewriteAction extends AnyAction {
  type: 'exhibitInfoPage/updateRewrite';
  // payload:
}

export interface ExhibitInfoPageModelType {
  namespace: 'exhibitInfoPage';
  state: ExhibitInfoPageModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    addAPolicy: (action: AddAPolicyAction, effects: EffectsCommandMap) => void;
    updateAPolicy: (action: UpdateAPolicyAction, effects: EffectsCommandMap) => void;
    updateBaseInfo: (action: UpdateBaseInfoAction, effects: EffectsCommandMap) => void;
    updateStatus: (action: UpdateStatusAction, effects: EffectsCommandMap) => void;
    updateRelation: (action: UpdateRelationAction, effects: EffectsCommandMap) => void;
    updateRewrite: (action: UpdateRewriteAction, effects: EffectsCommandMap) => void;
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
    addPolicyDrawerVisible: false,

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
    pAddCustomKeyError: '',
    pAddCustomValue: '',
    pAddCustomValueError: '',
    pAddCustomDescription: '',
    pAddCustomDescriptionError: '',
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
        isLoadPolicyInfo: 1,
      };
      const {data} = yield call(presentableDetails, params);
      // console.log(data, 'data2309jdsfa');
      const result: HandleRelationResult = yield call(handleRelation, data.resolveResources);

      const nodeName: string = nodes.list.find((n) => n.nodeId === data.nodeId)?.nodeName || '';

      const disabledRewriteKeys = [
        // ...Object.keys(data.resourceSystemProperty),
        ...data.resourceCustomPropertyDescriptors.map((i: any) => i.key),
        // ...data.presentableRewriteProperty.map((i: any) => i.key),
      ];
      // console.log(disabledRewriteKeys, 'disabledRewriteKeys3092hj2');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeName: nodeName,
          resourceName: data.presentableName,
          resourceType: data.resourceInfo.resourceType,
          isOnline: data.onlineStatus === 1,
          policies: data.policies.map((p: any) => ({
            id: p.policyId,
            name: p.policyName,
            text: p.policyText,
            status: p.status,
          })),
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
              policyId: c.policyId,
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

          pBaseAttrs: [
            ...Object.entries(data.resourceSystemProperty).map((s: any) => ({
              key: s[0],
              value: s[1],
            })),
            ...data.resourceCustomPropertyDescriptors.filter((rd: any) => rd.type === 'readonlyText')
              .map((rd: any) => ({
                key: rd.key,
                value: rd.defaultValue,
              })),
          ],
          pCustomAttrs: [
            ...data.resourceCustomPropertyDescriptors
              .filter((rd: any) => rd.type !== 'readonlyText')
              .map((rd: any) => {
                const prp = data.presentableRewriteProperty.find((pr: any) => pr.key === rd.key);
                return {
                  key: rd.key,
                  value: prp ? prp.value : rd.defaultValue,
                  defaultValue: rd.defaultValue,
                  option: rd.type === 'select' ? rd.candidateItems : [],
                  remark: rd.remark,
                  isEditing: false,
                };
              }),
            ...data.presentableRewriteProperty
              .filter((pr: any) => !disabledRewriteKeys.includes(pr.key))
              .map((pr: any) => ({
                key: pr.key,
                value: pr.value,
                remark: pr.remark,
              })),
          ],
        },
      })
    },
    * addAPolicy({payload}: AddAPolicyAction, {call, select, put}: EffectsCommandMap) {
      const {exhibitInfoPage}: ConnectState = yield select(({exhibitInfoPage}: ConnectState) => ({
        exhibitInfoPage,
      }));
      const params: UpdatePresentableParamsType = {
        presentableId: exhibitInfoPage.presentableId,
        addPolicies: [{
          policyName: payload.title,
          policyText: payload.text,
          status: 1,
        }],
      };
      yield call(updatePresentable, params);
      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });
    },
    * updateAPolicy({payload}: UpdateAPolicyAction, {call, select, put}: EffectsCommandMap) {
      const {exhibitInfoPage}: ConnectState = yield select(({exhibitInfoPage}: ConnectState) => ({
        exhibitInfoPage,
      }));
      const params: UpdatePresentableParamsType = {
        presentableId: exhibitInfoPage.presentableId,
        updatePolicies: [{
          policyId: payload.id,
          status: payload.status,
        }],
      };
      yield call(updatePresentable, params);
      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });
    },
    * updateBaseInfo({payload}: UpdateBaseInfoAction, {select, call, put}: EffectsCommandMap) {
      const {exhibitInfoPage}: ConnectState = yield select(({exhibitInfoPage}: ConnectState) => ({
        exhibitInfoPage,
      }));
      const params: UpdatePresentableParamsType = {
        presentableId: exhibitInfoPage.presentableId,
        presentableTitle: payload.pTitle,
        tags: payload.pTags,
        coverImages: payload.pCover ? [payload.pCover] : undefined,
      };
      yield call(updatePresentable, params);
      yield put<ChangeAction>({
        type: 'change',
        payload,
      });
    },
    * updateStatus({payload}: UpdateStatusAction, {call, select, put}: EffectsCommandMap) {
      const {exhibitInfoPage}: ConnectState = yield select(({exhibitInfoPage}: ConnectState) => ({
        exhibitInfoPage,
      }));
      const params: PresentablesOnlineParamsType = {
        presentableId: exhibitInfoPage.presentableId,
        onlineStatus: payload,
      };
      yield call(presentablesOnlineStatus, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          isOnline: payload === 1,
        },
      })
    },
    * updateRelation({payload}: UpdateRelationAction, {select, call, put}: EffectsCommandMap) {
      const {exhibitInfoPage}: ConnectState = yield select(({exhibitInfoPage}: ConnectState) => ({
        exhibitInfoPage,
      }));
      const resource = exhibitInfoPage.associated.find((a) => a.id === payload.resourceId);
      console.log(resource, '$#@$#$@#');
      const params: UpdatePresentableParamsType = {
        presentableId: exhibitInfoPage.presentableId,
        resolveResources: [
          {
            resourceId: resource?.id || '',
            contracts: [
              ...(resource?.contracts || []).map((c) => ({policyId: c.policyId})),
              {policyId: payload.policyId},
            ]
          }
        ]
      };
      yield call(updatePresentable, params);
      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });
    },
    * updateRewrite({}: UpdateRewriteAction, {select, call}: EffectsCommandMap) {
      const {exhibitInfoPage}: ConnectState = yield select(({exhibitInfoPage}: ConnectState) => ({
        exhibitInfoPage,
      }));
      // console.log(exhibitInfoPage, 'exhibitInfoPage90jdf');
      const params: UpdateRewritePropertyParamsType = {
        presentableId: exhibitInfoPage.presentableId,
        rewriteProperty: exhibitInfoPage.pCustomAttrs
          .filter((pc) => pc.value !== pc.defaultValue)
          .map((pc) => ({
            key: pc.key,
            value: pc.value,
            remark: pc.remark,
          })),
      };
      yield call(updateRewriteProperty, params);
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
    policyId: string;
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
        // console.log(contract, 'contract0923');
        return {
          contractId: contract.contractId,
          contractName: contract.contractName,
          createDate: contract.createDate,
          policyText: contract.policyInfo.policyText,
          status: contract.status,
          policyId: contract.policyId,
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
