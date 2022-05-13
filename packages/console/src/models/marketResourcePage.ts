import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import { router } from 'umi';
import FUtil1 from '@/utils';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
// import { handleDependencyGraphData } from '@/components/FAntvG6/FAntvG6DependencyGraph';
// import { handleAuthorizationGraphData } from '@/components/FAntvG6/FAntvG6AuthorizationGraph';
import fMessage from '@/components/fMessage';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import { resourceVersionInfo1 } from '@freelog/tools-lib/dist/service-API/resources';

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
    authProblem: boolean;
    policies: PolicyFullInfo_Type[],
  }[];
  signResources: {
    selected: boolean;
    id: string;
    name: string;
    type: string;
    status: 0 | 1;
    authProblem: boolean;
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
      fullInfo: PolicyFullInfo_Type;
      // id: string;
      // status: 0 | 1;
      // name: string;
      // text: string;
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
  // dependencyGraphNodes: {
  //   id: string;
  //   resourceId: string;
  //   resourceName: string;
  //   resourceType: string;
  //   version: string;
  // }[];
  // dependencyGraphEdges: {
  //   source: string;
  //   target: string;
  // }[];
  // authorizationGraphNodes: Array<{
  //   id: string;
  //   resourceId: string;
  //   resourceName: string;
  //   resourceType: string;
  //   version: string;
  // } | {
  //   id: string;
  //   contracts: {
  //     contractId: string;
  //     contractName: string;
  //     isAuth: boolean;
  //     updateDate: string;
  //   }[];
  // }>;
  // authorizationGraphEdges: {
  //   source: string;
  //   target: string;
  // }[];
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

export interface OnClick_SignBtn_Action extends AnyAction {
  type: 'marketResourcePage/onClick_SignBtn';
}

export interface OnClick_ConfirmSignContract_Action extends AnyAction {
  type: 'marketResourcePage/onClick_ConfirmSignContract';
}

export interface OnChangeAndVerifySignExhibitNameAction extends AnyAction {
  type: 'marketResourcePage/onChangeAndVerifySignExhibitName';
  payload: string;
}

export interface FetchVersionInfoAction extends AnyAction {
  type: 'fetchVersionInfo' | 'marketResourcePage/fetchVersionInfo';
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
    onClick_SignBtn: (action: OnClick_SignBtn_Action, effects: EffectsCommandMap) => void;
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
  // dependencyGraphNodes: [],
  // dependencyGraphEdges: [],
  // authorizationGraphNodes: [],
  // authorizationGraphEdges: [],

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
      // const params: Parameters<typeof FServiceAPI.Resource.info>[0] = {
      //   resourceIdOrName: marketResourcePage.resourceId,
      //   isLoadPolicyInfo: 1,
      // };
      // const { data } = yield call(FServiceAPI.Resource.info, params);
      const params: Parameters<typeof handleResourceBatchInfo>[0] = {
        resourceIDs: [marketResourcePage.resourceId],
      };

      // 本次要添加的一些列资源信息
      const [data]: HandleResourceBatchInfoReturn = yield call(handleResourceBatchInfo, params);
      // console.log(data, ' data2309');

      let rawSignResources: MarketResourcePageModelState['allRawResources'] = [data];

      // console.log(data.baseUpcastResources, 'data.baseUpcastResources908898888888');
      // 获取上抛资源信息
      if ((data.baseUpcastResources || []).length > 0) {
        // console.log(data.baseUpcastResources.map((r: any) => r.resourceId), '0928384u290u49023');

        const params: Parameters<typeof handleResourceBatchInfo>[0] = {
          resourceIDs: data.baseUpcastResources.map((r) => r.resourceId),
        };

        // 本次要添加的一些列资源信息
        const data1: HandleResourceBatchInfoReturn = yield call(handleResourceBatchInfo, params);

        // const params1: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
        //   resourceIds: data.baseUpcastResources.map((r: any) => r.resourceId).join(','),
        //   isLoadPolicyInfo: 1,
        // };
        // const { data: data1 } = yield call(FServiceAPI.Resource.batchInfo, params1);
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
                authProblem: rs.authProblem,
                contracts: [],
                policies: rs.policies
                  .filter((srp) => srp.status === 1)
                  .map((rsp) => ({
                    checked: false,
                    fullInfo: rsp,
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
                    status: c.status === 1 ? 'terminal' : (c.authStatus === 1 || c.authStatus === 3) ? 'active' : c.authStatus === 2 ? 'testActive' : 'inactive',
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
                  fullInfo: rsp,
                }));

              return {
                selected: index === 0,
                id: value.resourceId,
                name: value.resourceName,
                type: value.resourceType,
                status: value.status,
                authProblem: value.authProblem,
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

      const params: Parameters<typeof FServiceAPI.Resource.resourceVersionInfo1>[0] = {
        version: marketResourcePage.version,
        resourceId: marketResourcePage.resourceId,
      };
      const { data } = yield call(FServiceAPI.Resource.resourceVersionInfo1, params);
      // console.log(data, '98sdalkf');

      // const params2: Parameters<typeof FServiceAPI.Resource.dependencyTree>[0] = {
      //   resourceId: marketResourcePage.resourceId,
      //   version: marketResourcePage.version,
      //   // $version: '0.0.1',
      //   isContainRootNode: true,
      // };
      //
      // const { data: data2 } = yield call(FServiceAPI.Resource.dependencyTree, params2);
      // // console.log(data2, 'data2data2@#$RWEFASDFADSF90ukoj;ladskjfasdf');
      // const { nodes: dependencyGraphNodes, edges: dependencyGraphEdges } = handleDependencyGraphData(data2[0]);
      //
      // const params3: Parameters<typeof FServiceAPI.Resource.authTree>[0] = {
      //   resourceId: marketResourcePage.resourceId,
      //   version: marketResourcePage.version,
      // };
      //
      // const { data: data3 } = yield call(FServiceAPI.Resource.authTree, params3);
      //
      // // 授权树
      // const {
      //   nodes: authorizationGraphNodes,
      //   edges: authorizationGraphEdges,
      // } = yield call(handleAuthorizationGraphData, data3, {
      //   id: data.version,
      //   resourceId: data.resourceId,
      //   resourceName: data.resourceName,
      //   resourceType: data.resourceType,
      //   version: data.version,
      //   versionId: data.versionId,
      // });

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
          // dependencyGraphNodes: dependencyGraphNodes,
          // dependencyGraphEdges: dependencyGraphEdges,
          // authorizationGraphNodes: authorizationGraphNodes,
          // authorizationGraphEdges: authorizationGraphEdges,
        },
      });
    },
    * onClick_SignBtn({}: OnClick_SignBtn_Action, { select, call, put }: EffectsCommandMap) {
      const { marketResourcePage }: ConnectState = yield select(({ marketResourcePage }: ConnectState) => ({
        marketResourcePage,
      }));

      const needVerifyResource: {
        id: string;
        policyIDs: string[];
      }[] = marketResourcePage.signResources.map((sr) => {
        return {
          id: sr.id,
          policyIDs: sr.policies.filter((p) => {
            return p.checked;
          }).map((p) => {
            return p.fullInfo.policyId;
          }),
        };
      });

      const params1: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
        resourceIds: needVerifyResource.map((r) => r.id).join(','),
      };

      const { data: data1 } = yield call(FServiceAPI.Resource.batchInfo, params1);

      // console.log(data1, 'data1903lkjlksdf');

      const realTimeResourceOnlinePolicyIDs: {
        id: string;
        policyIDs: string[];
      }[] = data1.map((d: any) => {
        return {
          id: d.resourceId,
          policyIDs: d.policies.filter((p: any) => {
            return p.status === 1;
          }).map((p: any) => {
            return p.policyId;
          }),
        };
      });

      // console.log(needVerifyResource, realTimeResourceOnlinePolicyIDs, '###3902803498023840234808200');

      for (const r1 of needVerifyResource) {
        const res = realTimeResourceOnlinePolicyIDs.find((rt) => {
          return rt.id === r1.id;
        });

        if ((res?.policyIDs.length || 0) === 0) {
          fMessage(FUtil1.I18n.message('alarm_resource_not_available'), 'error');
          return;
        }

        // console.log(res, r1, '#######02948093u4o23uj4ojlk');
        for (const p1 of r1.policyIDs) {
          if (!res?.policyIDs.includes(p1)) {
            // fMessage(FUtil1.I18n.message('alarm_resource_not_available'));
            fMessage(FUtil1.I18n.message('alarm_plan_not_available'), 'error');
            return;
          }
        }

      }

      const params: Parameters<typeof getAvailableExhibitName>[0] = {
        nodeID: marketResourcePage.selectedNodeID,
        exhibitName: marketResourcePage.resourceInfo?.name.split('/')[1] || '',
      };

      const signExhibitName: string = yield call(getAvailableExhibitName, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          signExhibitName: signExhibitName,
          signExhibitNameErrorTip: '',
          isSignPage: true,
        },
      });
      // window.history.pushState({}, '确认签约');
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
                  policyId: srp.fullInfo.policyId,
                };
              }),
          ],
        })),
      };
      const { data, ret, errCode, msg } = yield call(FServiceAPI.Exhibit.createPresentable, params);
      if (ret + (errCode || 0) > 0) {
        fMessage(msg, 'error');
        return;
      }
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

interface GetAvailableExhibitNameParamType {
  nodeID: number;
  exhibitName: string;
  suffixNum?: number;
}

async function getAvailableExhibitName({
                                         nodeID,
                                         exhibitName,
                                         suffixNum = 0,
                                       }: GetAvailableExhibitNameParamType): Promise<string> {
  const name: string = exhibitName + (suffixNum ? `_${suffixNum}` : '');
  const params: Parameters<typeof FServiceAPI.Exhibit.presentableDetails>[0] = {
    nodeId: nodeID,
    presentableName: name,
  };
  const { data } = await FServiceAPI.Exhibit.presentableDetails(params);
  if (data) {
    return await getAvailableExhibitName({
      nodeID,
      exhibitName,
      suffixNum: suffixNum + 1,
    });
  }

  return name;
}

interface HandleResourceBatchInfoParams {
  resourceIDs: string[];
}

type HandleResourceBatchInfoReturn = {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  latestVersion: string;
  coverImages: string[];
  status: 0 | 1;
  policies: PolicyFullInfo_Type[];
  resourceVersions: {
    createDate: string;
    version: string;
  }[];
  baseUpcastResources: {
    resourceId: string;
    resourceName: string;
  }[];
  tags: string[];
  intro: string;
  authProblem: boolean;
}[];

async function handleResourceBatchInfo({ resourceIDs }: HandleResourceBatchInfoParams): Promise<HandleResourceBatchInfoReturn> {

  if (resourceIDs.length === 0) {
    return [];
  }

  const params: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
    resourceIds: resourceIDs.join(','),
    isLoadPolicyInfo: 1,
    isTranslate: 1,
    isLoadLatestVersionInfo: 1,
    projection: 'resourceId,resourceName,resourceType,latestVersion,status,policies,resourceVersions,baseUpcastResources,coverImages,tags,intro',
  };

  // 本次要添加的一些列资源信息
  // const { data: data_batchResourceInfo }: { data: Omit<HandleResourceBatchInfoReturn, 'authProblem'> } = await FServiceAPI.Resource.batchInfo(params);
  const { data: data_batchResourceInfo }: { data: any[] } = await FServiceAPI.Resource.batchInfo(params);

  // console.log(data_batchResourceInfo, 'data_batchResourceInfo 238998sdhfkjshdfksdf');

  const needGetAuthProblemResourceIDs: string[] = data_batchResourceInfo.filter((dbri) => {
    return dbri.latestVersion !== '';
  }).map((dbri) => {
    return dbri.resourceId;
  });
  let resourceAuthProblems: {
    isAuth: boolean;
    resourceId: string;
  }[] = [];
  if (needGetAuthProblemResourceIDs.length > 0) {
    const params1: Parameters<typeof FServiceAPI.Resource.batchAuth>[0] = {
      resourceIds: needGetAuthProblemResourceIDs.join(','),
    };
    const { data } = await FServiceAPI.Resource.batchAuth(params1);
    // console.log(data_BatchAuth, 'data_BatchAuth @@@34234wfgsrd');
    resourceAuthProblems = data;
  }

  return data_batchResourceInfo.map((dbri) => {
    const authP = resourceAuthProblems.find((rap) => {
      return rap.resourceId === dbri.resourceId;
    });
    return {
      ...dbri,
      authProblem: authP ? !authP.isAuth : false,
    };
  });
}
