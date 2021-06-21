import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from '@/models/connect';
import fMessage from "@/components/fMessage";
import {handleAuthorizationGraphData} from "@/components/FAntvG6/FAntvG6AuthorizationGraph";
import {FUtil, FServiceAPI} from "@freelog/tools-lib";
import {router} from "umi";
import {handleExhibitRelationGraphData} from "@/components/FAntvG6/FAntvG6RelationshipGraph";

export type ExhibitInfoPageModelState = WholeReadonly<{
  presentableId: string;

  nodeId: number;
  nodeName: string;
  nodeThemeId: string;
  pID: string;
  pName: string;
  isOnline: boolean;
  isAuth: boolean;
  authErrorText: string;

  policies: {
    id: string;
    name: string;
    text: string;
    status: 0 | 1;
  }[];
  addPolicyDrawerVisible: boolean;

  exhibitAllContractIDs: {
    exhibitID: string;
    resourceID: string;
    contractIDs: string[];
  }[];

  selectedAssociatedID: string;
  associated: {
    // selected: boolean;
    id: string;
    name: string;
    type: string;
    exhibits: {
      id: string;
      name: string;
      status: 0 | 1;
    }[];
    contracts: {
      name: string;
      status: 0 | 1 | 2;
      id: string;
      text: string;
      createTime: string;
      policyId: string;
      exhibitOpen: boolean;
    }[];
    policies: {
      id: string;
      name: string;
      text: string;
    }[];
  }[];

  graphFullScreen: boolean;
  viewportGraphShow: 'relationship' | 'authorization';

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
}> & {
  relationGraphNodes: Array<{
    id: string;
    resourceId: string;
    resourceName: string;
    resourceType: string;
    version: string;
    pending: boolean;
    exception: boolean;
  } | {
    id: string;
    nodeName: string;
    exhibitName: string;
  }>;
  relationGraphEdges: {
    source: string;
    target: string;
  }[];

  authorizationGraphNodes: Array<{
    id: string;
    resourceId: string;
    resourceName: string;
    resourceType: string;
    version: string;
  } | {
    id: string;
    nodeId: number;
    nodeName: string;
    exhibitId: string;
    exhibitName: string;
  } | {
    id: string;
    contracts: {
      contractId: string;
      contractName: string;
      isAuth: boolean;
      updateDate: string;
    }[];
  }>;
  authorizationGraphEdges: {
    source: string;
    target: string;
  }[];
};

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
}

export interface ChangeVersionAction extends AnyAction {
  type: 'exhibitInfoPage/changeVersion';
  payload: string;
}

export interface UpdateContractUsedAction {
  type: 'exhibitInfoPage/updateContractUsed';
  payload: {
    exhibitID: string;
    resourceID: string;
    policyID: string;
    isUsed: boolean;
  };
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
    changeVersion: (action: ChangeVersionAction, effects: EffectsCommandMap) => void;
    updateContractUsed: (action: UpdateContractUsedAction, effects: EffectsCommandMap) => void;
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

    nodeId: -1,
    nodeName: '',
    nodeThemeId: '',
    pID: '',
    pName: '',
    isOnline: false,
    isAuth: true,
    authErrorText: '',

    policies: [],
    addPolicyDrawerVisible: false,
    exhibitAllContractIDs: [],
    selectedAssociatedID: '',
    associated: [],

    graphFullScreen: false,
    viewportGraphShow: 'relationship',
    relationGraphNodes: [],
    relationGraphEdges: [],
    authorizationGraphNodes: [],
    authorizationGraphEdges: [],

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
      const {exhibitInfoPage, user}: ConnectState = yield select(({exhibitInfoPage, user}: ConnectState) => ({
        exhibitInfoPage,
        user,
      }));

      const params: Parameters<typeof FServiceAPI.Exhibit.presentableDetails>[0] = {
        presentableId: exhibitInfoPage.presentableId,
        isLoadCustomPropertyDescriptors: 1,
        isLoadPolicyInfo: 1,
      };
      const {data} = yield call(FServiceAPI.Exhibit.presentableDetails, params);

      // console.log(data, 'data@#Rasfdjou890ujewfra');

      // if (!data || data.userId !== user.cookiesUserID) {
      if (!data || data.userId !== FUtil.Tool.getUserIDByCookies()) {
        router.replace(FUtil.LinkTo.exception403({}));
        return;
      }

      const params3: Parameters<typeof FServiceAPI.Node.details>[0] = {
        nodeId: data.nodeId,
      };

      const {data: data3} = yield call(FServiceAPI.Node.details, params3);
      // console.log(data3, 'data90j23rlkfjasdfa');

      const params2: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: data.resourceInfo.resourceId,
      };

      const {data: data2} = yield call(FServiceAPI.Resource.info, params2);
      // console.log(data2, 'data2309jdsfa');

      // 组织授权信息数据
      const result: HandleRelationResult = yield call(handleRelation, data.resolveResources, data.nodeId);

      // 要禁用的键
      const disabledRewriteKeys = [
        ...data.resourceCustomPropertyDescriptors.map((i: any) => i.key),
      ];

      // console.log(data, 'data2341234');

      // 获取展品授权结果
      const params1: Parameters<typeof FServiceAPI.Exhibit.batchAuth>[0] = {
        nodeId: data.nodeId,
        authType: 3,
        presentableIds: data.presentableId,
      };
      const {data: data1} = yield call(FServiceAPI.Exhibit.batchAuth, params1);
      // console.log(data1, 'data1123434');

      // 关系树数据
      const params6: Parameters<typeof FServiceAPI.Exhibit.relationTree>[0] = {
        presentableId: data.presentableId,
      };

      const {data: data6} = yield call(FServiceAPI.Exhibit.relationTree, params6);
      // console.log(data, 'datadatadatadatadatadatadata');
      // console.log(data6, 'DDDDDD!!@#$@!#$!@#$@#$6666');

      const {nodes: relationGraphNodes, edges: relationGraphEdges} = yield call(handleExhibitRelationGraphData, data6, {
        nodeId: data.nodeId,
        nodeName: data3.nodeName,
        exhibitId: data.presentableId,
        exhibitName: data.presentableName,
      });

      // console.log(relationGraphNodes, relationGraphEdges, '@#$!@#$!@#$!2341234123421342134134');

      // 授权树数据
      const params4: Parameters<typeof FServiceAPI.Exhibit.authTree>[0] = {
        presentableId: exhibitInfoPage.presentableId,
      };

      const {data: data4} = yield call(FServiceAPI.Exhibit.authTree, params4);

      // console.log(data4, '@@@@@#4234234324234');
      const {nodes: authorizationGraphNodes, edges: authorizationGraphEdges} = yield call(handleAuthorizationGraphData, data4, {
        id: data.presentableId,
        nodeId: data.nodeId,
        nodeName: data3.nodeName,
        exhibitId: data.presentableId,
        exhibitName: data.presentableName,
      });

      // 根据资源 id 批量查询所有合同
      const params5: Parameters<typeof FServiceAPI.Exhibit.presentableList>[0] = {
        nodeId: data.nodeId,
        resolveResourceIds: result.map((rs) => {
          return rs.resourceId;
        }).join(','),
      };

      const {data: data5} = yield call(FServiceAPI.Exhibit.presentableList, params5);

      // console.log(data5, 'data5!@#$!@#$@#$!@#$!@#$!@#4123421341234');
      const exhibitAllContractIDs: {
        exhibitID: string;
        resourceID: string;
        contractIDs: string[];
      }[] = data5.map((d5: any) => {
        return d5.resolveResources?.map((resvr: any) => {
          return {
            exhibitID: d5.presentableId,
            resourceID: resvr.resourceId,
            contractIDs: resvr.contracts.map((cccc: any) => {
              return cccc.contractId;
            }),
          };
        });
      }).flat();

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeId: data.nodeId,
          nodeName: data3.nodeName,
          nodeThemeId: data3.nodeThemeId,
          pID: data.presentableId,
          pName: data.presentableName,
          isOnline: data.onlineStatus === 1,
          isAuth: data1[0].isAuth,
          authErrorText: data1[0].error,
          policies: data.policies.map((p: any) => ({
            id: p.policyId,
            name: p.policyName,
            text: p.policyText,
            status: p.status,
          })),
          exhibitAllContractIDs,
          selectedAssociatedID: result.some((rr) => {
            return rr.resourceId === exhibitInfoPage.selectedAssociatedID;
          }) ? exhibitInfoPage.selectedAssociatedID : result[0].resourceId,
          associated: result.map((r, index) => {
            const exhibits = data5.filter((d5: any) => {
              return d5.resolveResources.some((rr: any) => {
                return d5.presentableId !== data.presentableId && rr.resourceId === r.resourceId;
              });
            }).map((d5: any) => {
              return {
                id: d5.presentableId,
                name: d5.presentableName,
                // policyId: d5.
                status: d5.onlineStatus,
              };
            });
            return {
              id: r.resourceId,
              name: r.resourceName,
              type: r.resourceType,
              exhibits: exhibits,
              contracts: r.contracts.map((c) => ({
                name: c.contractName,
                status: c.status,
                id: c.contractId,
                text: c.policyText,
                createTime: FUtil.Format.formatDateTime(c.createDate),
                policyId: c.policyId,
                exhibitOpen: false,
              })),
              policies: r.policies
                .filter((p) => {
                  return p.status === 1;
                })
                .map((p) => ({
                  id: p.policyId,
                  name: p.policyName,
                  text: p.policyText,
                })),
            };
          }),
          pCover: data.coverImages[0] || '',
          pTitle: data.presentableTitle,
          pTags: data.tags,

          allVersions: data2.resourceVersions.map((d2: any) => d2.version),
          version: data.version,

          pBaseAttrs: [
            ...Object.entries(data.resourceSystemProperty).map((s: any) => ({
              key: s[0],
              value: s[0] === 'fileSize' ? FUtil.Format.humanizeSize(s[1]) : s[1],
            })),
            ...data.resourceCustomPropertyDescriptors
              .filter((rd: any) => rd.type === 'readonlyText')
              .map((rd: any) => ({
                key: rd.key,
                value: rd.defaultValue,
              })),
          ],
          pCustomAttrs: [
            ...(data.resourceCustomPropertyDescriptors as any[])
              .filter((rd: any) => rd.type !== 'readonlyText')
              .map<ExhibitInfoPageModelState['pCustomAttrs'][number]>((rd: any) => {
                const prp = data.presentableRewriteProperty.find((pr: any) => pr.key === rd.key);
                const value = prp ? prp.value : rd.defaultValue;
                return {
                  key: rd?.key,
                  option: rd.type === 'select' ? rd.candidateItems : [],
                  defaultValue: rd.defaultValue,
                  value: value,
                  remark: rd.remark,
                  newValue: value,
                  newValueError: '',
                  isEditing: false,
                };
              }),
            ...(data.presentableRewriteProperty as any[])
              .filter((pr: any) => !disabledRewriteKeys.includes(pr.key))
              .map<ExhibitInfoPageModelState['pCustomAttrs'][number]>((pr: any) => ({
                key: pr.key,
                value: pr.value,
                newValue: pr.value,
                newValueError: '',
                remark: pr.remark,
                isEditing: false,
              })),
          ],

          resourceId: data2.resourceId,
          resourceName: data2.resourceName,
          resourceType: data2.resourceType,
          resourceCover: data2.coverImages[0] || '',

          relationGraphNodes: relationGraphNodes,
          relationGraphEdges: relationGraphEdges,
          authorizationGraphNodes: authorizationGraphNodes,
          authorizationGraphEdges: authorizationGraphEdges,
        },
      });
    },
    * addAPolicy({payload}: AddAPolicyAction, {call, select, put}: EffectsCommandMap) {
      const {exhibitInfoPage}: ConnectState = yield select(({exhibitInfoPage}: ConnectState) => ({
        exhibitInfoPage,
      }));
      const params: Parameters<typeof FServiceAPI.Exhibit.updatePresentable>[0] = {
        presentableId: exhibitInfoPage.presentableId,
        addPolicies: [{
          policyName: payload.title,
          policyText: payload.text,
          status: 1,
        }],
      };
      yield call(FServiceAPI.Exhibit.updatePresentable, params);
      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });
    },
    * updateAPolicy({payload}: UpdateAPolicyAction, {call, select, put}: EffectsCommandMap) {
      const {exhibitInfoPage}: ConnectState = yield select(({exhibitInfoPage}: ConnectState) => ({
        exhibitInfoPage,
      }));
      const params: Parameters<typeof FServiceAPI.Exhibit.updatePresentable>[0] = {
        presentableId: exhibitInfoPage.presentableId,
        updatePolicies: [{
          policyId: payload.id,
          status: payload.status,
        }],
      };
      yield call(FServiceAPI.Exhibit.updatePresentable, params);
      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });
    },
    * updateBaseInfo({payload}: UpdateBaseInfoAction, {select, call, put}: EffectsCommandMap) {
      const {exhibitInfoPage}: ConnectState = yield select(({exhibitInfoPage}: ConnectState) => ({
        exhibitInfoPage,
      }));
      const params: Parameters<typeof FServiceAPI.Exhibit.updatePresentable>[0] = {
        presentableId: exhibitInfoPage.presentableId,
        presentableTitle: payload.pTitle,
        tags: payload.pTags,
        coverImages: payload.pCover ? [payload.pCover] : undefined,
      };
      yield call(FServiceAPI.Exhibit.updatePresentable, params);
      yield put<ChangeAction>({
        type: 'change',
        payload,
      });
    },
    * updateStatus({payload}: UpdateStatusAction, {call, select, put}: EffectsCommandMap) {
      const {exhibitInfoPage}: ConnectState = yield select(({exhibitInfoPage}: ConnectState) => ({
        exhibitInfoPage,
      }));
      const params: Parameters<typeof FServiceAPI.Exhibit.presentablesOnlineStatus>[0] = {
        presentableId: exhibitInfoPage.presentableId,
        onlineStatus: payload,
      };
      const {data} = yield call(FServiceAPI.Exhibit.presentablesOnlineStatus, params);
      if (!data) {
        fMessage(exhibitInfoPage.resourceType === 'theme' ? '激活失败' : '上线失败', 'error');
        return;
      }
      // yield put<ChangeAction>({
      //   type: 'change',
      //   payload: {
      //     isOnline: payload === 1,
      //   },
      // });
      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });
    },
    * updateRelation({payload}: UpdateRelationAction, {select, call, put}: EffectsCommandMap) {
      const {exhibitInfoPage}: ConnectState = yield select(({exhibitInfoPage}: ConnectState) => ({
        exhibitInfoPage,
      }));
      const resource = exhibitInfoPage.associated.find((a) => a.id === payload.resourceId);
      // console.log(resource, '$#@$#$@#');
      const params: Parameters<typeof FServiceAPI.Exhibit.updatePresentable>[0] = {
        presentableId: exhibitInfoPage.presentableId,
        resolveResources: yield call(handleFinalResolveResource, {
          exhibitID: exhibitInfoPage.pID,
          resourceID: payload.resourceId,
          policyID: payload.policyId,
          isUsed: true,
        })
      };
      yield call(FServiceAPI.Exhibit.updatePresentable, params);
      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });
    },
    * updateRewrite({}: UpdateRewriteAction, {select, call, put}: EffectsCommandMap) {
      const {exhibitInfoPage}: ConnectState = yield select(({exhibitInfoPage}: ConnectState) => ({
        exhibitInfoPage,
      }));

      const pCustomAttrs: ExhibitInfoPageModelState['pCustomAttrs'] = exhibitInfoPage.pCustomAttrs
        .map<ExhibitInfoPageModelState['pCustomAttrs'][number]>((pc) => {
          return {
            ...pc,
            value: pc.newValueError ? pc.value : pc.newValue,
          };
        });

      const params: Parameters<typeof FServiceAPI.Exhibit.updateRewriteProperty>[0] = {
        presentableId: exhibitInfoPage.presentableId,
        rewriteProperty: pCustomAttrs
          .filter((pc) => pc.value !== pc.defaultValue)
          .map((pc) => ({
            key: pc.key,
            value: pc.value,
            remark: pc.remark,
          })),
      };
      yield call(FServiceAPI.Exhibit.updateRewriteProperty, params);

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
      const params: Parameters<typeof FServiceAPI.Exhibit.presentablesVersion>[0] = {
        presentableId: exhibitInfoPage.presentableId,
        version: payload,
      };
      yield call(FServiceAPI.Exhibit.presentablesVersion, params);
      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });
    },
    * updateContractUsed({payload}: UpdateContractUsedAction, {select, call, put}: EffectsCommandMap) {
      const {exhibitInfoPage}: ConnectState = yield select(({exhibitInfoPage}: ConnectState) => ({
        exhibitInfoPage,
      }));

      // console.log(data, 'data123412398yuoihjkl');

      const params2: Parameters<typeof FServiceAPI.Exhibit.updatePresentable>[0] = {
        presentableId: payload.exhibitID,
        resolveResources: yield call(handleFinalResolveResource, payload),
      };
      // console.log(params2, 'params2!@!@#$@!#$!@#$');

      const {data: data2} = yield call(FServiceAPI.Exhibit.updatePresentable, params2);

      // 根据资源 id 批量查询所有合同
      const params5: Parameters<typeof FServiceAPI.Exhibit.presentableList>[0] = {
        nodeId: exhibitInfoPage.nodeId,
        resolveResourceIds: exhibitInfoPage.associated.map((rs) => {
          return rs.id;
        }).join(','),
      };

      const {data: data5} = yield call(FServiceAPI.Exhibit.presentableList, params5);

      const exhibitAllContractIDs: {
        exhibitID: string;
        resourceID: string;
        contractIDs: string[];
      }[] = data5.map((d5: any) => {
        return d5.resolveResources?.map((resvr: any) => {
          return {
            exhibitID: d5.presentableId,
            resourceID: resvr.resourceId,
            contractIDs: resvr.contracts.map((cccc: any) => {
              return cccc.contractId;
            }),
          };
        });
      }).flat();

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          exhibitAllContractIDs,
        },
      });
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

/**
 * 组织授权信息数据
 */
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
    status: 0 | 1 | 2;
    policyId: string;
  }[];
  policies: {
    policyId: string;
    policyName: string;
    policyText: string;
    status: 0 | 1;
  }[];
}[];

async function handleRelation(params: HandleRelationParams, nodeID: number): Promise<HandleRelationResult> {

  // console.log(nodeID, 'nodeID!@#$@#$@#$@#@#$');
  // console.log(params, 'params0923jafdsl');
  const resourceIds: string[] = params.map((r) => r.resourceId);

  const allContracts = await getAllContracts({
    nodeID,
    resourceIDs: resourceIds,
  });

  // const contractResourcePolicyIds: {
  //   resourceID: string;
  //   policyID: string;
  // }[] = allContracts.map((cs) => {
  //   return {
  //     resourceID: cs.
  //   }
  // });

  const params0: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
    resourceIds: resourceIds.join(','),
    isLoadPolicyInfo: 1,
  };

  const {data: data0}: any = await FServiceAPI.Resource.batchInfo(params0);
  // console.log(data0, data1, 'data0, data123rfsda');

  const result: HandleRelationResult = params.map((r) => {
    const resource = data0.find((dr: any) => dr.resourceId === r.resourceId);
    return {
      resourceId: resource.resourceId,
      resourceName: resource.resourceName,
      resourceType: resource.resourceType,
      status: resource.status,
      contracts: allContracts
        .filter((acts: any) => {
          return acts.licensorId === resource.resourceId;
        })
        .map((contract: any) => {
          // console.log(contract, 'contract0923');
          return {
            contractId: contract.contractId,
            contractName: contract.contractName,
            createDate: contract.createDate,
            policyText: contract.policyInfo.policyText,
            // status: contract.status,
            status: contract.status === 1 ? 2 : ((contract.authStatus & 1) === 1) ? 1 : 0,
            policyId: contract.policyId,
          };
        }),
      policies: resource.policies
        .filter((p: any) => {
          return !allContracts
            .some((act: any) => {
              // console.log(p, act, '!@#$!@#$!@#$!@#$!@#$!@#$!@#$');
              return act.licensorId === resource.resourceId && act.policyId === p.policyId;
            });
        })
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

interface GetAllContractsParamsType {
  nodeID: number;
  resourceIDs: string[];
}

type GetAllContractsReturnType = {
  contractId: string;
  contractName: string;
  createDate: string;
  updateDate: string;
  policyId: string;
  policyInfo: {
    policyId: string;
    policyText: string;
  };
}[];

async function getAllContracts({nodeID, resourceIDs}: GetAllContractsParamsType): Promise<GetAllContractsReturnType> {
  // console.log(resourceIDs, 'resourceIDs!!@#$!@#$!@$1230900000000');
  const allPromises = resourceIDs.map(async (id) => {
    const params: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
      licensorId: id,
      licenseeId: nodeID,
      licenseeIdentityType: 2,
      isLoadPolicyInfo: 1,
      subjectIds: id,
      subjectType: 1,
    };
    const {data} = await FServiceAPI.Contract.batchContracts(params);
    // console.log(data, 'data!!!1111100000000))))))');
    return data;
  });

  return (await Promise.all(allPromises)).flat();
}

interface HandleFinalResolveResourceParams {
  exhibitID: string;
  resourceID: string;
  policyID: string;
  isUsed: boolean;
}

async function handleFinalResolveResource({exhibitID, resourceID, policyID, isUsed}: HandleFinalResolveResourceParams) {
  const params: Parameters<typeof FServiceAPI.Exhibit.presentableDetails>[0] = {
    presentableId: exhibitID,
  };

  const {data} = await FServiceAPI.Exhibit.presentableDetails(params);

  return data.resolveResources?.map((rrs: any) => {
    if (resourceID !== rrs.resourceId) {
      return {
        resourceId: rrs.resourceId,
        contracts: rrs.contracts.map((cccttt: any) => {
          return {
            policyId: cccttt.policyId,
          };
        }),
      };
    }
    return {
      resourceId: rrs.resourceId,
      contracts: isUsed
        ? [
          ...rrs.contracts.map((cccttt: any) => {
            return {
              policyId: cccttt.policyId,
            };
          }),
          {policyId: policyID}
        ]
        : rrs.contracts
          .filter((ccc: any) => {
            return ccc.policyId !== policyID;
          })
          .map((cccttt: any) => {
            return {
              policyId: cccttt.policyId,
            };
          }),
    };
  });
}
