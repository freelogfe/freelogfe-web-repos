import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import { router } from 'umi';
import FUtil1 from '@/utils';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { handleDependencyGraphData } from '@/components/FAntvG6/FAntvG6DependencyGraph';
import { handleAuthorizationGraphData } from '@/components/FAntvG6/FAntvG6AuthorizationGraph';

export interface MarketResourcePageModelState {
  resourceId: string;
  version: string;

  isSignPage: boolean;

  resourceInfo: null | {
    cover: string;
    name: string;
    type: string;
    tags: string[];
    about: string;
  };

  popularity: number;
  hasCollect: boolean;

  // 所有可签约的节点 ID
  signedNodeIDs: number[];
  selectedNodeID: number;

  allRawResources: {
    resourceId: string;
    resourceName: string;
    resourceType: string;
    status: 0 | 1;
    policies: {
      policyId: string;
      policyName: string;
      policyText: string;
      status: 0 | 1;
    }[],
  }[];
  signResources: {
    selected: boolean;
    id: string;
    name: string;
    type: string;
    status: 0 | 1;
    contracts: {
      checked: boolean;
      id: string;
      name: string;
      text: string;
      createTime: string;
      policyID: string;
      status: 'active' | 'testActive' | 'inactive' | 'terminal';
      exhibits: {
        exhibitID: string;
        exhibitName: string;
      }[];
    }[];
    policies: {
      checked: boolean;
      id: string;
      status: 0 | 1;
      name: string;
      text: string;
    }[];
  }[];
  signedResourceExhibitID: string;

  allVersions: string[];

  releaseTime: string;

  description: string;

  properties: {
    key: string;
    value: string;
    description?: string;
  }[];

  options: {
    key: string;
    value: string;
    description: string;
  }[];

  signExhibitName: string;
  signExhibitNameErrorTip: string;

  graphFullScreen: boolean;
  viewportGraphShow: 'dependency' | 'authorization';
  dependencyGraphNodes: {
    id: string;
    resourceId: string;
    resourceName: string;
    resourceType: string;
    version: string;
  }[];
  dependencyGraphEdges: {
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
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'marketResourcePage/change';
  payload: Partial<MarketResourcePageModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'marketResourcePage/onMountPage';
  payload: {
    resourceID: string;
  },
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'marketResourcePage/onUnmountPage';
}

export interface OnChangeVersionAction extends AnyAction {
  type: 'marketResourcePage/onChangeVersion';
  payload: {
    version: string;
  },
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo' | 'marketResourcePage/fetchInfo';
}

export interface FetchCollectionInfoAction extends AnyAction {
  type: 'fetchCollectionInfo' | 'marketResourcePage/fetchCollectionInfo';
}

export interface OnClickCollectionAction extends AnyAction {
  type: 'marketResourcePage/onClickCollection';
}

export interface OnChangeNodeSelectorAction extends AnyAction {
  type: 'marketResourcePage/onChangeNodeSelector';
  payload: -1 | number;
}

export interface FetchVersionInfoAction extends AnyAction {
  type: 'fetchVersionInfo' | 'marketResourcePage/fetchVersionInfo';
}

export interface OnClick_ConfirmSignContract_Action extends AnyAction {
  type: 'marketResourcePage/onClick_ConfirmSignContract';
}

export interface OnChangeAndVerifySignExhibitNameAction extends AnyAction {
  type: 'marketResourcePage/onChangeAndVerifySignExhibitName';
  payload: string;
}

export interface FetchDependencyGraphData extends AnyAction {
  type: 'marketResourcePage/fetchDependencyGraphData' | 'fetchDependencyGraphData';
}

interface MarketResourcePageModelType {
  namespace: 'marketResourcePage';
  state: MarketResourcePageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
    onChangeVersion: (action: OnChangeVersionAction, effects: EffectsCommandMap) => void;
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    fetchCollectionInfo: (action: FetchCollectionInfoAction, effects: EffectsCommandMap) => void;
    onClickCollection: (action: OnClickCollectionAction, effects: EffectsCommandMap) => void;
    onChangeNodeSelector: (action: OnChangeNodeSelectorAction, effects: EffectsCommandMap) => void;
    fetchVersionInfo: (action: FetchVersionInfoAction, effects: EffectsCommandMap) => void;
    onClick_ConfirmSignContract: (action: OnClick_ConfirmSignContract_Action, effects: EffectsCommandMap) => void;
    onChangeAndVerifySignExhibitName: (action: OnChangeAndVerifySignExhibitNameAction, effects: EffectsCommandMap) => void;
    fetchDependencyGraphData: (action: FetchDependencyGraphData, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<MarketResourcePageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: MarketResourcePageModelState = {
  resourceId: '',
  isSignPage: false,
  resourceInfo: {
    cover: '',
    name: '',
    type: '',
    tags: [],
    about: '',
  },

  popularity: 0,
  hasCollect: false,

  signedNodeIDs: [],
  selectedNodeID: -1,

  allRawResources: [],
  signResources: [],
  // signedResources: null,
  signedResourceExhibitID: '',

  allVersions: [],
  version: '',
  releaseTime: '',
  description: '',

  properties: [],

  options: [],

  signExhibitName: '',
  signExhibitNameErrorTip: '',

  graphFullScreen: false,
  viewportGraphShow: 'dependency',
  dependencyGraphNodes: [],
  dependencyGraphEdges: [],
  authorizationGraphNodes: [],
  authorizationGraphEdges: [],

};

const Model: MarketResourcePageModelType = {
  namespace: 'marketResourcePage',
  state: initStates,
  effects: {
    * onMountPage({ payload }: OnMountPageAction, { put }: EffectsCommandMap) {
      yield put({
        type: 'change',
        payload: {
          resourceId: payload.resourceID,
        },
      });

      yield put<FetchCollectionInfoAction>({
        type: 'fetchCollectionInfo',
      });

      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });
    },
    * onUnmountPage({}: OnUnmountPageAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * onChangeVersion({ payload }: OnChangeVersionAction, { put }: EffectsCommandMap) {
      yield put({
        type: 'change',
        payload: {
          version: payload.version,
        },
      });

      yield put<FetchVersionInfoAction>({
        type: 'fetchVersionInfo',
      });
    },
    * fetchInfo({}: FetchInfoAction, { call, put, select }: EffectsCommandMap) {
      const { marketResourcePage, user }: ConnectState = yield select(({ marketResourcePage, user }: ConnectState) => ({
        marketResourcePage,
        user,
      }));

      // 获取资源信息详情
      const params: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: marketResourcePage.resourceId,
        isLoadPolicyInfo: 1,
      };
      const { data } = yield call(FServiceAPI.Resource.info, params);
      // console.log(data, ' data2309');

      let rawSignResources: MarketResourcePageModelState['allRawResources'] = [data];

      // console.log(data.baseUpcastResources, 'data.baseUpcastResources908898888888');
      // 获取上抛资源信息
      if ((data.baseUpcastResources || []).length > 0) {
        // console.log(data.baseUpcastResources.map((r: any) => r.resourceId), '0928384u290u49023');
        const params1: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
          resourceIds: data.baseUpcastResources.map((r: any) => r.resourceId).join(','),
          isLoadPolicyInfo: 1,
        };
        const { data: data1 } = yield call(FServiceAPI.Resource.batchInfo, params1);
        // console.log(data1, 'data12390jsdfo');
        rawSignResources = [
          ...rawSignResources,
          ...data1,
        ];
      }

      // console.log(rawSignResources, 'rawSignResources2309ef');

      // 获取当前用户与当前资源签过约的所有节点
      const params3: Parameters<typeof FServiceAPI.Exhibit.presentableList>[0] = {
        userId: user.info?.userId,
        resourceIds: marketResourcePage.resourceId,
        // projection: 'nodeId',
      };

      const { data: data3 } = yield call(FServiceAPI.Exhibit.presentableList, params3);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceInfo: {
            cover: data.coverImages.length > 0 ? data.coverImages[0] : '',
            name: data.resourceName,
            type: data.resourceType,
            tags: data.tags,
            about: data.intro,
          },
          allVersions: data.resourceVersions.map((v: any) => v.version),
          version: marketResourcePage.version || data.latestVersion,
          //
          signedNodeIDs: data3.map((p: any) => p.nodeId),
          allRawResources: rawSignResources,

          signResources: rawSignResources
            .map<MarketResourcePageModelState['signResources'][number]>((rs, i: number) => {
              return {
                selected: i === 0,
                id: rs.resourceId,
                name: rs.resourceName,
                type: rs.resourceType,
                status: rs.status,
                contracts: [],
                policies: rs.policies
                  .filter((srp) => srp.status === 1)
                  .map((rsp) => ({
                    checked: false,
                    id: rsp.policyId,
                    name: rsp.policyName,
                    text: rsp.policyText,
                    status: rsp.status,
                  })),
              };
            }),
        },
      });
      // console.log(marketResourcePage.version, data.latestVersion, 'marketResourcePage.version || data.latestVersio');

      if (!data.latestVersion || !!marketResourcePage.version) {
        return;
      }

      yield put<FetchVersionInfoAction>({
        type: 'fetchVersionInfo',
      });

    },
    * fetchCollectionInfo({}: FetchCollectionInfoAction, { call, select, put }: EffectsCommandMap) {
      // console.log('进入获取收藏', 'FGHSDGf09uj4k2t;ldfs');
      const { marketResourcePage }: ConnectState = yield select(({ marketResourcePage }: ConnectState) => ({
        marketResourcePage,
      }));

      const params1: Parameters<typeof FServiceAPI.Collection.isCollected>[0] = {
        resourceIds: marketResourcePage.resourceId,
      };

      const { data: data1 } = yield call(FServiceAPI.Collection.isCollected, params1);

      const params2: Parameters<typeof FServiceAPI.Collection.collectedCount>[0] = {
        resourceId: marketResourcePage.resourceId,
      };

      const { data: data2 } = yield call(FServiceAPI.Collection.collectedCount, params2);
      // console.log('获取收藏', 'FGHSDGf09uj4k2t;ldfs');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          hasCollect: data1[0].isCollected,
          popularity: data2,
        },
      });
    },
    * onClickCollection({}: OnClickCollectionAction, { select, call, put }: EffectsCommandMap) {
      const { marketResourcePage }: ConnectState = yield select(({ marketResourcePage }: ConnectState) => ({
        marketResourcePage,
      }));

      if (!marketResourcePage.hasCollect) {
        const params: Parameters<typeof FServiceAPI.Collection.collectResource>[0] = {
          resourceId: marketResourcePage.resourceId,
        };
        yield call(FServiceAPI.Collection.collectResource, params);
      } else {
        const params: Parameters<typeof FServiceAPI.Collection.deleteCollectResource>[0] = {
          resourceId: marketResourcePage.resourceId,
        };
        yield call(FServiceAPI.Collection.deleteCollectResource, params);
      }

      yield put<FetchCollectionInfoAction>({
        type: 'fetchCollectionInfo',
      });
    },
    * onChangeNodeSelector({ payload }: OnChangeNodeSelectorAction, { put, select, call }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          selectedNodeID: payload,
        },
      });

      const { marketResourcePage }: ConnectState = yield select(({ marketResourcePage }: ConnectState) => ({
        marketResourcePage,
      }));

      const allRawResourceIDs = marketResourcePage.allRawResources.map((r) => r.resourceId);

      const params: GetAllContractsParamsType = {
        nodeID: payload,
        resourceIDs: allRawResourceIDs,
      };

      const result: GetAllContractsReturnType = yield call(getAllContracts, params);
      // console.log(result, 'result1234234234234');

      const params1: Parameters<typeof FServiceAPI.Exhibit.presentableDetails>[0] = {
        nodeId: payload,
        resourceId: marketResourcePage.resourceId,
      };
      const { data: data1 } = yield call(FServiceAPI.Exhibit.presentableDetails, params1);


      let data2: any[] = [];
      const contractIds = result.flat().map((cr) => cr.contractId).join(',');
      if (contractIds) {
        const params2: Parameters<typeof FServiceAPI.Exhibit.contractAppliedPresentable>[0] = {
          nodeId: payload,
          contractIds: result.flat().map((cr) => cr.contractId).join(','),
        };

        const { data } = yield call(FServiceAPI.Exhibit.contractAppliedPresentable, params2);
        data2 = data;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          signedResourceExhibitID: data1?.presentableId || '',
          signResources: marketResourcePage.allRawResources
            .map<MarketResourcePageModelState['signResources'][number]>((value, index: number) => {
              const contracts: MarketResourcePageModelState['signResources'][number]['contracts'] = result[index]
                .filter((c) => {
                  return c.status === 0;
                })
                .map((c) => {
                  const exhibits = data2.find((d2: any) => d2.contractId === c.contractId)
                    ?.presentables.map((pb: any) => {
                      return {
                        exhibitID: pb.presentableId,
                        exhibitName: pb.presentableName,
                      };
                    });
                  return {
                    checked: true,
                    id: c.contractId,
                    name: c.contractName,
                    text: c.policyInfo.policyText,
                    createTime: FUtil.Format.formatDateTime(c.createDate),
                    policyID: c.policyInfo.policyId,
                    status: c.status === 1 ? 'terminal' : c.authStatus === 1 ? 'active' : c.authStatus === 2 ? 'testActive' : 'inactive',
                    exhibits: exhibits || [],
                  };
                });

              const allContractUsedPolicyIDs: string[] = contracts
                .filter((cp) => cp.status !== 'terminal')
                .map<string>((cp) => cp.policyID);
              const policies: MarketResourcePageModelState['signResources'][number]['policies'] = value.policies
                .filter((rsp) => rsp.status === 1 && !allContractUsedPolicyIDs.includes(rsp.policyId))
                .map((rsp) => ({
                  checked: false,
                  id: rsp.policyId,
                  name: rsp.policyName,
                  text: rsp.policyText,
                  status: rsp.status,
                }));

              return {
                selected: index === 0,
                id: value.resourceId,
                name: value.resourceName,
                type: value.resourceType,
                status: value.status,
                contracts: contracts,
                policies: policies,
              };
            }),
        },
      });
    },
    * fetchVersionInfo({}: FetchVersionInfoAction, { call, select, put }: EffectsCommandMap) {
      const { marketResourcePage }: ConnectState = yield select(({ marketResourcePage }: ConnectState) => ({
        marketResourcePage,
      }));

      // console.log('######89987239847982347982349823748723');

      const params: Parameters<typeof FServiceAPI.Resource.resourceVersionInfo>[0] = {
        version: marketResourcePage.version,
        resourceId: marketResourcePage.resourceId,
      };
      const { data } = yield call(FServiceAPI.Resource.resourceVersionInfo, params);
      // console.log(data, '98sdalkf');

      const params2: Parameters<typeof FServiceAPI.Resource.dependencyTree>[0] = {
        resourceId: marketResourcePage.resourceId,
        version: marketResourcePage.version,
        // $version: '0.0.1',
        isContainRootNode: true,
      };

      const { data: data2 } = yield call(FServiceAPI.Resource.dependencyTree, params2);
      // console.log(data2, 'data2data2@#$RWEFASDFADSF90ukoj;ladskjfasdf');
      const { nodes: dependencyGraphNodes, edges: dependencyGraphEdges } = handleDependencyGraphData(data2[0]);

      const params3: Parameters<typeof FServiceAPI.Resource.authTree>[0] = {
        resourceId: marketResourcePage.resourceId,
        version: marketResourcePage.version,
      };

      const { data: data3 } = yield call(FServiceAPI.Resource.authTree, params3);

      // 授权树
      const {
        nodes: authorizationGraphNodes,
        edges: authorizationGraphEdges,
      } = yield call(handleAuthorizationGraphData, data3, {
        id: data.version,
        resourceId: data.resourceId,
        resourceName: data.resourceName,
        resourceType: data.resourceType,
        version: data.version,
        versionId: data.versionId,
      });

      // console.log('授权树', 'marketResourcePage112342342');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          releaseTime: FUtil.Format.formatDateTime(data.createDate),
          description: data.description,
          properties: [
            ...Object.entries(data.systemProperty as object)
              .map((s) => ({
                key: s[0],
                value: s[0] === 'fileSize' ? FUtil.Format.humanizeSize(s[1]) : s[1],
              })),
            ...data.customPropertyDescriptors.filter((p: any) => p.type === 'readonlyText')
              .map((p: any) => {
                // console.log(p, 'PPPPP()*UOI');
                return {
                  key: p.key,
                  value: p.defaultValue,
                  description: p.remark,
                };
              }),
          ],
          options: data.customPropertyDescriptors.filter((p: any) => p.type !== 'readonlyText')
            .map((p: any) => {
              // console.log(p, '@@@@@@#$#@$@#$@#');
              return {
                key: p.key,
                value: p.defaultValue,
                description: p.remark,
              };
            }),
          dependencyGraphNodes: dependencyGraphNodes,
          dependencyGraphEdges: dependencyGraphEdges,
          authorizationGraphNodes: authorizationGraphNodes,
          authorizationGraphEdges: authorizationGraphEdges,
        },
      });
    },
    * onClick_ConfirmSignContract({}: OnClick_ConfirmSignContract_Action, { call, select, put }: EffectsCommandMap) {
      const { marketResourcePage }: ConnectState = yield select(({ marketResourcePage }: ConnectState) => ({
        marketResourcePage,
      }));

      const params: Parameters<typeof FServiceAPI.Exhibit.createPresentable>[0] = {
        nodeId: marketResourcePage.selectedNodeID,
        resourceId: marketResourcePage.resourceId,
        version: marketResourcePage.version,
        presentableName: marketResourcePage.signExhibitName,
        resolveResources: marketResourcePage.signResources.map((sr) => ({
          resourceId: sr.id,
          contracts: [
            ...sr.contracts.filter((srp) => srp.checked && srp.status !== 'terminal')
              .map((srp) => {
                return {
                  policyId: srp.policyID,
                };
              }),
            ...sr.policies.filter((srp) => srp.checked)
              .map((srp) => {
                return {
                  policyId: srp.id,
                };
              }),
          ],
        })),
      };
      const { data } = yield call(FServiceAPI.Exhibit.createPresentable, params);
      router.push(FUtil.LinkTo.exhibitManagement({ exhibitID: data.presentableId }));
    },
    * onChangeAndVerifySignExhibitName({ payload }: OnChangeAndVerifySignExhibitNameAction, {
      put,
      select,
      call,
    }: EffectsCommandMap) {
      if (!FUtil.Regexp.EXHIBIT_NAME.test(payload)) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            signExhibitName: payload,
            signExhibitNameErrorTip: FUtil1.I18n.message('naming_convention_exhibits_name'),
          },
        });
        return;
      }
      const { marketResourcePage }: ConnectState = yield select(({ marketResourcePage, nodes }: ConnectState) => ({
        marketResourcePage,
        nodes,
      }));

      const params: Parameters<typeof FServiceAPI.Exhibit.presentableDetails>[0] = {
        nodeId: marketResourcePage.selectedNodeID,
        presentableName: payload,
      };
      const { data } = yield call(FServiceAPI.Exhibit.presentableDetails, params);
      if (data) {
        yield put<ChangeAction>({
          type: 'marketResourcePage/change',
          payload: {
            signExhibitName: payload,
            signExhibitNameErrorTip: FUtil1.I18n.message('exhibits_name_exist'),
          },
        });
        return;
      }

      yield put<ChangeAction>({
        type: 'marketResourcePage/change',
        payload: {
          signExhibitName: payload,
          signExhibitNameErrorTip: '',
        },
      });
    },
    * fetchDependencyGraphData({}: FetchDependencyGraphData, { select, call }: EffectsCommandMap) {

    },
  },
  reducers: {
    change(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({}) {

    },
  },
};

export default Model;

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
  status: number;
  authStatus: number;
}[][];

async function getAllContracts({ nodeID, resourceIDs }: GetAllContractsParamsType): Promise<GetAllContractsReturnType> {
  const allPromises = resourceIDs.map(async (id) => {
    const params: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
      subjectIds: id,
      subjectType: 1,
      licenseeIdentityType: 2,
      licensorId: id,
      licenseeId: nodeID,
      isLoadPolicyInfo: 1,
    };
    const { data } = await FServiceAPI.Contract.batchContracts(params);
    return data;
  });

  return await Promise.all(allPromises);
}

interface GetAllContractExhibitsParamsType {
  resourceIDs: string[];
  nodeID: number;
}

async function getAllContractExhibits({ resourceIDs, nodeID }: GetAllContractExhibitsParamsType) {
  const allPromises = resourceIDs.map(async (rid) => {
    const params: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
      licenseeIdentityType: 2,
      licensorId: rid,
      licenseeId: nodeID,
    };
    const { data } = await FServiceAPI.Contract.batchContracts(params);
    return data;
  });
  return await Promise.all(allPromises);
}
