import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {
  batchAuth,
  BatchAuthParamsType,
  presentableDetails,
  PresentableDetailsParamsType1,
  PresentablesOnlineParamsType,
  presentablesOnlineStatus,
  presentablesVersion,
  PresentablesVersionParamsType,
  updatePresentable,
  UpdatePresentableParamsType,
  updateRewriteProperty,
  UpdateRewritePropertyParamsType
} from '@/services/presentables';
import {ConnectState} from '@/models/connect';
import {batchContracts, BatchContractsParamsType} from '@/services/contracts';
import {batchInfo, BatchInfoParamsType, info, InfoParamsType} from '@/services/resources';
import {formatDateTime} from "@/utils/format";
import fMessage from "@/components/fMessage";
import {testResourceDetails, TestResourceDetailsParamsType} from "@/services/informalNodes";

export type InformExhibitInfoPageModelState = WholeReadonly<{
  informExhibitID: string;

  nodeID: number;
  nodeName: string;
  informExhibitName: string;
  isOnline: boolean;
  isAuth: boolean;
  authErrorText: string;

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

  allVersions: string[];
  version: string;

  settingUnfold: boolean;

  pBaseAttrs: {
    key: string;
    value: string;
  }[];

  pCustomAttrs: {
    defaultValue?: string; // 如果该属性存在说明是继承过来的属性，如果不存在则为新添加属性
    option?: string[]; // 如果属性不存在或length为0表示输入框，否则为选择框

    value: string; // 最终向服务端提交的value数据

    key: string;
    newValue: string;  // 输入框显示的值
    newValueError: string; // 输入框校验的实时提醒错误信息
    remark: string;
    isEditing: boolean; // 是否弹窗来编辑此属性
  }[];

  pAddCustomModalVisible: boolean;
  pAddCustomKey: string;
  pAddCustomKeyError: string;
  pAddCustomValue: string;
  pAddCustomValueError: string;
  pAddCustomDescription: string;
  pAddCustomDescriptionError: string;

  resourceId: string;
  resourceName: string;
  resourceType: string;
  resourceCover: string;
}>;

export interface ChangeAction extends AnyAction {
  type: 'change' | 'informExhibitInfoPage/change';
  payload: Partial<InformExhibitInfoPageModelState>;
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo' | 'informExhibitInfoPage/fetchInfo';
}

export interface AddAPolicyAction extends AnyAction {
  type: 'informExhibitInfoPage/addAPolicy';
  payload: {
    title: string;
    text: string;
  };
}

export interface UpdateAPolicyAction extends AnyAction {
  type: 'informExhibitInfoPage/updateAPolicy';
  payload: {
    id: string;
    status: 0 | 1
  };
}

export interface UpdateBaseInfoAction extends AnyAction {
  type: 'informExhibitInfoPage/updateBaseInfo';
  payload: {
    pCover?: string;
    pTitle?: string;
    pTags?: string[];
  };
}

export interface UpdateStatusAction extends AnyAction {
  type: 'informExhibitInfoPage/updateStatus';
  payload: 0 | 1;
}

export interface UpdateRelationAction extends AnyAction {
  type: 'informExhibitInfoPage/updateRelation';
  payload: {
    resourceId: string;
    policyId: string;
  };
}

export interface UpdateRewriteAction extends AnyAction {
  type: 'informExhibitInfoPage/updateRewrite';
  // payload:
}

export interface ChangeVersionAction extends AnyAction {
  type: 'informExhibitInfoPage/changeVersion';
  payload: string;
}

export interface ExhibitInfoPageModelType {
  namespace: 'informExhibitInfoPage';
  state: InformExhibitInfoPageModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    updateBaseInfo: (action: UpdateBaseInfoAction, effects: EffectsCommandMap) => void;
    updateStatus: (action: UpdateStatusAction, effects: EffectsCommandMap) => void;
    updateRelation: (action: UpdateRelationAction, effects: EffectsCommandMap) => void;
    updateRewrite: (action: UpdateRewriteAction, effects: EffectsCommandMap) => void;
    changeVersion: (action: ChangeVersionAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<InformExhibitInfoPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: ExhibitInfoPageModelType = {
  namespace: 'informExhibitInfoPage',
  state: {
    informExhibitID: '',

    nodeID: -1,
    nodeName: '',
    informExhibitName: '',
    isOnline: false,
    isAuth: true,
    authErrorText: '',

    associated: [
      {
        selected: true,
        id: '1',
        name: 'resource/name1',
        type: 'image',
        contracts: [{
          name: '策略1',
          status: 1,
          id: '3451324kl34iojlksfd',
          text: '1234:\n  execute\n  result',
          createTime: '2020-12-31',
          policyId: '908jksdff',
        }],
        policies: [{
          id: '238942u3j4io',
          name: 'name23223',
          text: '234',
        }],
      },
    ],

    pCover: '',
    pTitle: '',
    pInputTitle: null,
    pTags: [],

    allVersions: [],
    version: '',

    settingUnfold: false,

    pBaseAttrs: [],
    pCustomAttrs: [],

    pAddCustomModalVisible: false,
    pAddCustomKey: '',
    pAddCustomKeyError: '',
    pAddCustomValue: '',
    pAddCustomValueError: '',
    pAddCustomDescription: '',
    pAddCustomDescriptionError: '',

    resourceId: '',
    resourceName: '',
    resourceType: '',
    resourceCover: '',
  },
  effects: {
    * fetchInfo({}: FetchInfoAction, {call, select, put}: EffectsCommandMap) {
      const {informExhibitInfoPage, nodes}: ConnectState = yield select(({informExhibitInfoPage, nodes}: ConnectState) => ({
        informExhibitInfoPage,
        nodes,
      }));

      const params: TestResourceDetailsParamsType = {
        testResourceId: informExhibitInfoPage.informExhibitID,
      };
      const {data} = yield call(testResourceDetails, params);

      const currentNode = nodes.list.find((n) => n.nodeId === data.nodeId);

      console.log(data, '#######');

      const params1: InfoParamsType = {
        resourceIdOrName: data.originInfo.id,
      };

      const {data: data1} = yield call(info, params1);
      // console.log(data1, '##@#$@#$@#');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeID: data.nodeId,
          nodeName: currentNode?.nodeName,
          informExhibitName: data.testResourceName,
          pCover: data.stateInfo.coverInfo.coverImages[0] || '',
          pTitle: data.stateInfo.titleInfo.title || '',
          pTags: data.stateInfo.tagInfo.tags || [],
          allVersions: data.originInfo.versions || [],
          version: data.originInfo.version || '',
          resourceId: data.originInfo.id,
          resourceName: data1.resourceName,
          resourceType: data1.resourceType,
          resourceCover: data1.coverImages[0] || '',
        },
      });

      // yield put<ChangeAction>({
      //   type: 'change',
      //   payload: {

      //     pName: data.presentableName,
      //     isOnline: data.onlineStatus === 1,
      //     isAuth: data1[0].isAuth,
      //     authErrorText: data1[0].error,
      //     policies: data.policies.map((p: any) => ({
      //       id: p.policyId,
      //       name: p.policyName,
      //       text: p.policyText,
      //       status: p.status,
      //     })),
      //     associated: result.map((r, index) => ({
      //       selected: index === 0,
      //       id: r.resourceId,
      //       name: r.resourceName,
      //       type: r.resourceType,
      //       contracts: r.contracts.map((c) => ({
      //         name: c.contractName,
      //         status: c.status,
      //         id: c.contractId,
      //         text: c.policyText,
      //         createTime: formatDateTime(c.createDate),
      //         policyId: c.policyId,
      //       })),
      //       policies: r.policies.map((p) => ({
      //         id: p.policyId,
      //         name: p.policyName,
      //         text: p.policyText,
      //       }))
      //     })),
      //     pCover: data.coverImages[0] || '',
      //     pTitle: data.presentableTitle,
      //     pTags: data.tags,
      //
      //     allVersions: data2.resourceVersions.map((d2: any) => d2.version),
      //     version: data.version,
      //
      //     pBaseAttrs: [
      //       ...Object.entries(data.resourceSystemProperty).map((s: any) => ({
      //         key: s[0],
      //         value: s[1],
      //       })),
      //       ...data.resourceCustomPropertyDescriptors
      //         .filter((rd: any) => rd.type === 'readonlyText')
      //         .map((rd: any) => ({
      //           key: rd.key,
      //           value: rd.defaultValue,
      //         })),
      //     ],
      //     pCustomAttrs: [
      //       ...(data.resourceCustomPropertyDescriptors as any[])
      //         .filter((rd: any) => rd.type !== 'readonlyText')
      //         .map<InformExhibitInfoPageModelState['pCustomAttrs'][number]>((rd: any) => {
      //           const prp = data.presentableRewriteProperty.find((pr: any) => pr.key === rd.key);
      //           const value = prp ? prp.value : rd.defaultValue;
      //           return {
      //             key: rd?.key,
      //             option: rd.type === 'select' ? rd.candidateItems : [],
      //             defaultValue: rd.defaultValue,
      //             value: value,
      //             remark: rd.remark,
      //             newValue: value,
      //             newValueError: '',
      //             isEditing: false,
      //           };
      //         }),
      //       ...(data.presentableRewriteProperty as any[])
      //         .filter((pr: any) => !disabledRewriteKeys.includes(pr.key))
      //         .map<InformExhibitInfoPageModelState['pCustomAttrs'][number]>((pr: any) => ({
      //           key: pr.key,
      //           value: pr.value,
      //           newValue: pr.value,
      //           newValueError: '',
      //           remark: pr.remark,
      //           isEditing: false,
      //         })),
      //     ],
      //
      //     resourceId: data2.resourceId,
      //     resourceName: data2.resourceName,
      //     resourceType: data2.resourceType,
      //     resourceCover: data2.coverImages[0] || '',
      //   },
      // })
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
      const {data} = yield call(presentablesOnlineStatus, params);
      if (!data) {
        fMessage(exhibitInfoPage.resourceType === 'theme' ? '激活失败' : '上线失败', 'error');
        return;
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          isOnline: payload === 1,
        },
      });
    },
    * updateRelation({payload}: UpdateRelationAction, {select, call, put}: EffectsCommandMap) {
      const {exhibitInfoPage}: ConnectState = yield select(({exhibitInfoPage}: ConnectState) => ({
        exhibitInfoPage,
      }));
      const resource = exhibitInfoPage.associated.find((a) => a.id === payload.resourceId);
      // console.log(resource, '$#@$#$@#');
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
    * updateRewrite({}: UpdateRewriteAction, {select, call, put}: EffectsCommandMap) {
      const {exhibitInfoPage}: ConnectState = yield select(({exhibitInfoPage}: ConnectState) => ({
        exhibitInfoPage,
      }));

      const pCustomAttrs: InformExhibitInfoPageModelState['pCustomAttrs'] = exhibitInfoPage.pCustomAttrs
        .map<InformExhibitInfoPageModelState['pCustomAttrs'][number]>((pc) => {
          return {
            ...pc,
            value: pc.newValueError ? pc.value : pc.newValue,
          };
        });

      const params: UpdateRewritePropertyParamsType = {
        presentableId: exhibitInfoPage.presentableId,
        rewriteProperty: pCustomAttrs
          .filter((pc) => pc.value !== pc.defaultValue)
          .map((pc) => ({
            key: pc.key,
            value: pc.value,
            remark: pc.remark,
          })),
      };
      yield call(updateRewriteProperty, params);

      // 同步数据
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          pCustomAttrs,
        }
      })
    },
    * changeVersion({payload}: ChangeVersionAction, {call, put, select}: EffectsCommandMap) {
      const {exhibitInfoPage}: ConnectState = yield select(({exhibitInfoPage}: ConnectState) => ({
        exhibitInfoPage,
      }));
      const params: PresentablesVersionParamsType = {
        presentableId: exhibitInfoPage.presentableId,
        version: payload,
      };
      yield call(presentablesVersion, params);
      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });
    }
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
