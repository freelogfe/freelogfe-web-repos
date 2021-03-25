import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from "@/models/connect";
import {formatDateTime} from "@/utils/format";
import {router} from "umi";
import {EXHIBIT_NAME} from "@/utils/regexp";
import FLinkTo from "@/utils/path-assembler";
import {FApiServer} from "@/services";
import {i18nMessage} from "@/utils/i18n";
import FUtil from "@/utils";
import {handleDependencyGraphData} from "@/components/FAntvG6/FAntvG6DependencyGraph";

export interface MarketResourcePageModelState {
  resourceId: string;

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
    }[];
    policies: {
      checked: boolean;
      id: string;
      status: 0 | 1;
      name: string;
      text: string;
    }[];
  }[];
  // signedResources: null | {
  //   selected: boolean;
  //   id: string;
  //   name: string;
  //   type: string;
  //
  //   policies: Policy[];
  // }[];
  signedResourceExhibitID: string;

  allVersions: string[];
  version: string;
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
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'marketResourcePage/change';
  payload: Partial<MarketResourcePageModelState>;
}

export interface InitDataAction extends AnyAction {
  type: 'marketResourcePage/initData';
  payload: string;
}

export interface ClearDataDataAction extends AnyAction {
  type: 'marketResourcePage/clearData';
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo' | 'marketResourcePage/fetchInfo';
}

export interface FetchCollectionInfoAction extends AnyAction {
  type: 'fetchCollectionInfo';
}

export interface OnClickCollectionAction extends AnyAction {
  type: 'marketResourcePage/onClickCollection';
}

export interface OnChangeNodeSelectorAction extends AnyAction {
  type: 'marketResourcePage/onChangeNodeSelector';
  payload: -1 | number;
}

export interface FetchVersionInfoAction extends AnyAction {
  type: 'fetchVersionInfo';
}

export interface OnChangeVersionAction extends AnyAction {
  type: 'marketResourcePage/onChangeVersion';
  payload: string;
}

export interface SignContractAction extends AnyAction {
  type: 'marketResourcePage/signContract';
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
    initData: (action: InitDataAction, effects: EffectsCommandMap) => void;
    clearData: (action: ClearDataDataAction, effects: EffectsCommandMap) => void;
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    fetchCollectionInfo: (action: FetchCollectionInfoAction, effects: EffectsCommandMap) => void;
    onClickCollection: (action: OnClickCollectionAction, effects: EffectsCommandMap) => void;
    onChangeNodeSelector: (action: OnChangeNodeSelectorAction, effects: EffectsCommandMap) => void;
    fetchVersionInfo: (action: FetchVersionInfoAction, effects: EffectsCommandMap) => void;
    onChangeVersion: (action: OnChangeVersionAction, effects: EffectsCommandMap) => void;
    signContract: (action: SignContractAction, effects: EffectsCommandMap) => void;
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

  viewportGraphShow: 'dependency',
  dependencyGraphNodes: [],
  dependencyGraphEdges: [],
};

const Model: MarketResourcePageModelType = {
  namespace: 'marketResourcePage',
  state: initStates,
  effects: {
    * initData({payload}: InitDataAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceId: payload,
        }
      });

      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });

      yield put<FetchCollectionInfoAction>({
        type: 'fetchCollectionInfo',
      });

    },
    * clearData({}: ClearDataDataAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * fetchInfo({}: FetchInfoAction, {call, put, select}: EffectsCommandMap) {
      const {marketResourcePage, user}: ConnectState = yield select(({marketResourcePage, user}: ConnectState) => ({
        marketResourcePage,
        user,
      }));
      // 获取资源信息详情
      const params: Parameters<typeof FApiServer.Resource.info>[0] = {
        resourceIdOrName: marketResourcePage.resourceId,
        isLoadPolicyInfo: 1,
      };
      const {data} = yield call(FApiServer.Resource.info, params);
      // console.log(data, ' data2309');

      let rawSignResources = [data];

      // 获取上抛资源信息
      if (data.baseUpcastResources.length > 0) {
        // console.log(data.baseUpcastResources.map((r: any) => r.resourceId), '0928384u290u49023');
        const params1: Parameters<typeof FApiServer.Resource.batchInfo>[0] = {
          resourceIds: data.baseUpcastResources.map((r: any) => r.resourceId).join(','),
          isLoadPolicyInfo: 1,
        };
        const {data: data1} = yield call(FApiServer.Resource.batchInfo, params1);
        // console.log(data1, 'data12390jsdfo');
        rawSignResources = [
          ...rawSignResources,
          ...data1,
        ];
      }

      // console.log(rawSignResources, 'rawSignResources2309ef');

      // 获取当前用户与当前资源签过约的所有节点
      const params3: Parameters<typeof FApiServer.Exhibit.presentableList>[0] = {
        userId: user.info?.userId,
        resourceIds: marketResourcePage.resourceId,
        // projection: 'nodeId',
      };

      const {data: data3} = yield call(FApiServer.Exhibit.presentableList, params3);

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
          version: data.latestVersion,
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
                policies: rs.policies.map((rsp: any) => ({
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

      if (!data.latestVersion) {
        return;
      }

      yield put<FetchVersionInfoAction>({
        type: 'fetchVersionInfo',
      });

    },
    * fetchCollectionInfo({}: FetchCollectionInfoAction, {call, select, put}: EffectsCommandMap) {
      const {marketResourcePage}: ConnectState = yield select(({marketResourcePage}: ConnectState) => ({
        marketResourcePage,
      }));

      const params1: Parameters<typeof FApiServer.Collection.isCollected>[0] = {
        resourceIds: marketResourcePage.resourceId,
      };

      const {data: data1} = yield call(FApiServer.Collection.isCollected, params1);

      const params2: Parameters<typeof FApiServer.Collection.collectedCount>[0] = {
        resourceId: marketResourcePage.resourceId,
      };

      const {data: data2} = yield call(FApiServer.Collection.collectedCount, params2);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          hasCollect: data1[0].isCollected,
          popularity: data2,
        },
      });
    },
    * onClickCollection({}: OnClickCollectionAction, {select, call, put}: EffectsCommandMap) {
      const {marketResourcePage}: ConnectState = yield select(({marketResourcePage}: ConnectState) => ({
        marketResourcePage,
      }));

      if (!marketResourcePage.hasCollect) {
        const params: Parameters<typeof FApiServer.Collection.collectResource>[0] = {
          resourceId: marketResourcePage.resourceId,
        };
        yield call(FApiServer.Collection.collectResource, params)
      } else {
        const params: Parameters<typeof FApiServer.Collection.deleteCollectResource>[0] = {
          resourceId: marketResourcePage.resourceId,
        };
        yield call(FApiServer.Collection.deleteCollectResource, params);
      }

      yield put<FetchCollectionInfoAction>({
        type: 'fetchCollectionInfo',
      });
    },
    // * fetchSignedResources({}: FetchSignedResourcesAction, {}: EffectsCommandMap) {
    //
    // },
    * onChangeNodeSelector({payload}: OnChangeNodeSelectorAction, {put, select, call}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          selectedNodeID: payload,
        },
      });

      const {marketResourcePage}: ConnectState = yield select(({marketResourcePage}: ConnectState) => ({
        marketResourcePage
      }));

      const params: GetAllContractsParamsType = {
        nodeID: payload,
        resourceIDs: marketResourcePage.allRawResources.map((r) => r.resourceId),
      };

      const result: GetAllContractsReturnType = yield call(getAllContracts, params);
      // console.log(result, 'result2390jdafslkaadfs');

      const params1: Parameters<typeof FApiServer.Exhibit.presentableDetails>[0] = {
        nodeId: payload,
        resourceId: marketResourcePage.resourceId,
      };
      const {data: data1} = yield call(FApiServer.Exhibit.presentableDetails, params1);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          signedResourceExhibitID: data1?.presentableId || '',
          signResources: marketResourcePage.allRawResources
            .map<MarketResourcePageModelState['signResources'][number]>((value, index: number) => {

              const contracts: MarketResourcePageModelState['signResources'][number]['contracts'] = result[index].map((c) => {
                return {
                  checked: true,
                  id: c.contractId,
                  name: c.contractName,
                  text: c.policyInfo.policyText,
                  createTime: FUtil.Format.formatDateTime(c.createDate),
                  policyID: c.policyInfo.policyId,
                };
              });

              const allContractUsedPolicyIDs: string[] = contracts.map<string>((cp) => cp.policyID);
              const policies: MarketResourcePageModelState['signResources'][number]['policies'] = value.policies
                .filter((rsp) => !allContractUsedPolicyIDs.includes(rsp.policyId))
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
    * fetchVersionInfo({}: FetchVersionInfoAction, {call, select, put}: EffectsCommandMap) {
      const {marketResourcePage}: ConnectState = yield select(({marketResourcePage}: ConnectState) => ({
        marketResourcePage
      }));
      const params: Parameters<typeof FApiServer.Resource.resourceVersionInfo>[0] = {
        version: marketResourcePage.version,
        resourceId: marketResourcePage.resourceId,
      };
      const {data} = yield call(FApiServer.Resource.resourceVersionInfo, params);
      // console.log(data, '98sdalkf');

      const params2: Parameters<typeof FApiServer.Resource.dependencyTree>[0] = {
        resourceId: marketResourcePage.resourceId,
        version: marketResourcePage.version,
        // version: '0.0.1',
        isContainRootNode: true,
      };

      const {data: data2} = yield call(FApiServer.Resource.dependencyTree, params2);
      // console.log(data2, 'data2data2@#$RWEFASDFADSF90ukoj;ladskjfasdf');
      const {nodes, edges} = handleDependencyGraphData(data2[0]);

      const params3: Parameters<typeof FApiServer.Resource.authTree>[0] = {
        resourceId: marketResourcePage.resourceId,
        version: marketResourcePage.version,
      };

      const {data: data3} = yield call(FApiServer.Resource.authTree, params3);

      // console.log(data3, '@!#awef98adjs;klfjalskdfjlkjalsdkfja');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          releaseTime: formatDateTime(data.createDate),
          description: data.description,
          properties: [
            ...Object.entries(data.systemProperty as object)
              .map((s) => ({
                key: s[0],
                value: s[1],
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
          dependencyGraphNodes: nodes,
          dependencyGraphEdges: edges,
        },
      });
    },
    * onChangeVersion({payload}: OnChangeVersionAction, {put}: EffectsCommandMap) {
      // console.log(payload, 'payload234sd09');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          version: payload,
        },
      });

      yield  put<FetchVersionInfoAction>({
        type: 'fetchVersionInfo',
      });
    },
    * signContract({}: SignContractAction, {call, select, put}: EffectsCommandMap) {
      const {marketResourcePage, nodes}: ConnectState = yield select(({marketResourcePage, nodes}: ConnectState) => ({
        marketResourcePage,
        nodes,
      }));

      const params: Parameters<typeof FApiServer.Exhibit.createPresentable>[0] = {
        nodeId: marketResourcePage.selectedNodeID,
        resourceId: marketResourcePage.resourceId,
        version: marketResourcePage.version,
        presentableName: marketResourcePage.signExhibitName,
        resolveResources: marketResourcePage.signResources.map((sr) => ({
          resourceId: sr.id,
          contracts: [
            ...sr.contracts.filter((srp) => srp.checked)
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
          ]
        })),
      };
      const {data} = yield call(FApiServer.Exhibit.createPresentable, params);
      router.push(FLinkTo.exhibitManagement({exhibitID: data.presentableId}));
    },
    * onChangeAndVerifySignExhibitName({payload}: OnChangeAndVerifySignExhibitNameAction, {put, select, call}: EffectsCommandMap) {
      if (!EXHIBIT_NAME.test(payload)) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            signExhibitName: payload,
            signExhibitNameErrorTip: i18nMessage('naming_convention_exhibits_name'),
          },
        });
        return;
      }
      const {marketResourcePage}: ConnectState = yield select(({marketResourcePage, nodes}: ConnectState) => ({
        marketResourcePage,
        nodes,
      }));

      const params: Parameters<typeof FApiServer.Exhibit.presentableDetails>[0] = {
        nodeId: marketResourcePage.selectedNodeID,
        presentableName: payload,
      };
      const {data} = yield call(FApiServer.Exhibit.presentableDetails, params);
      if (data) {
        yield put<ChangeAction>({
          type: 'marketResourcePage/change',
          payload: {
            signExhibitName: payload,
            signExhibitNameErrorTip: i18nMessage('exhibits_name_exist'),
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
    * fetchDependencyGraphData({}: FetchDependencyGraphData, {select, call}: EffectsCommandMap) {

    },
  },
  reducers: {
    change(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },

  }
  ,
  subscriptions: {
    setup({}) {

    }
  }
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
}[][];

async function getAllContracts({nodeID, resourceIDs}: GetAllContractsParamsType): Promise<GetAllContractsReturnType> {
  const allPromises = resourceIDs.map(async (id) => {
    const params: Parameters<typeof FApiServer.Contract.batchContracts>[0] = {
      subjectIds: id,
      subjectType: 1,
      licenseeIdentityType: 2,
      licensorId: id,
      licenseeId: nodeID,
      isLoadPolicyInfo: 1,
    };
    const {data} = await FApiServer.Contract.batchContracts(params);
    return data;
  });

  return await Promise.all(allPromises);
}

// interface DependencyTree {
//   resourceId: string;
//   resourceName: string;
//   resourceType: string;
//   version: string;
//   dependencies: DependencyTree[];
// }
//
// interface DependencyGraphData {
//   nodes: {
//     id: string;
//     resourceId: string;
//     resourceName: string;
//     resourceType: string;
//     version: string;
//   }[];
//   edges: {
//     source: string;
//     target: string;
//   }[];
// }
//
// function handleDependencyGraphData(data: DependencyTree): DependencyGraphData {
//
//   const nodes: DependencyGraphData['nodes'] = [];
//   const edges: DependencyGraphData['edges'] = [];
//   traversal(data);
//
//   return {
//     nodes, edges
//   };
//
//   function traversal(data: DependencyTree, parentID: string = ''): any {
//     const {dependencies, ...resource} = data;
//     const id: string = parentID ? `${parentID}-${data.resourceId}` : data.resourceId;
//     nodes.push({
//       id,
//       ...resource,
//     });
//     if (parentID) {
//       edges.push({
//         source: parentID,
//         target: id,
//       });
//     }
//
//     for (const dep of dependencies) {
//       traversal(dep, id);
//     }
//   }
// }
