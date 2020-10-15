import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {
  batchInfo,
  BatchInfoParamsType,
  info,
  InfoParamsType,
  resourceVersionInfo,
  ResourceVersionInfoParamsType1
} from "@/services/resources";
import {ConnectState} from "@/models/connect";
import {
  collectedCount,
  CollectedCountParamsType,
  collectResource,
  CollectResourceParamsType, deleteCollectResource, DeleteCollectResourceParamsType,
  isCollected
} from "@/services/collections";
import {formatDateTime} from "@/utils/format";
import {
  createPresentable,
  CreatePresentableParamsType,
  presentableList,
  PresentableListParamsType
} from "@/services/presentables";

export interface MarketResourcePageState {
  resourceId: string;

  resourceInfo: null | {
    cover: string;
    name: string;
    type: string;
    tags: string[];
    about: string;
  };

  popularity: number;
  hasCollect: boolean;

  signedNodeIDs: number[];
  // selectedNodeDomain
  selectedNodeID: number;

  signResources: {
    selected: boolean;
    id: string;
    name: string;
    type: string;
    policies: {
      checked: boolean;
      id: string;
      name: string;
      text: string;
    }[];
  }[];
  signedResources: null | {
    selected: boolean;
    id: string;
    name: string;
    type: string;
    contracts: {
      id: string;
      name: string;
      text: string;
      createTime: string;
    }[],
  }[];

  readonly allVersions: string[];
  version: string;
  releaseTime: string;

  description: string;
  showAllDescription: boolean;

  properties: {
    key: string;
    value: string;
  }[];

  options: {
    key: string;
    value: string;
  }[];

  signExhibitName: string;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'marketResourcePage/change';
  payload: Partial<MarketResourcePageState>;
}

export interface InitDataAction extends AnyAction {
  type: 'marketResourcePage/initData';
  payload: string;
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

export interface FetchSignedResourcesAction extends AnyAction {
  type: 'fetchSignResources';
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
  // payload: string;
}

export interface MarketResourcePageModelType {
  namespace: 'marketResourcePage';
  state: MarketResourcePageState;
  effects: {
    initData: (action: InitDataAction, effects: EffectsCommandMap) => void;
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    fetchCollectionInfo: (action: FetchCollectionInfoAction, effects: EffectsCommandMap) => void;
    onClickCollection: (action: OnClickCollectionAction, effects: EffectsCommandMap) => void;
    fetchSignedResources: (action: FetchSignedResourcesAction, effects: EffectsCommandMap) => void;
    fetchVersionInfo: (action: FetchVersionInfoAction, effects: EffectsCommandMap) => void;
    onChangeVersion: (action: OnChangeVersionAction, effects: EffectsCommandMap) => void;
    signContract: (action: SignContractAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<MarketResourcePageState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: MarketResourcePageModelType = {
  namespace: 'marketResourcePage',
  state: {
    resourceId: '',

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

    signResources: [],
    signedResources: null && [
      {
        selected: true,
        id: '234dsfds2',
        name: 'stefan/Smells like teen spirit',
        type: 'audio',
        contracts: [{
          id: '23sdfasd',
          name: '合约1',
          createTime: '2020/05/19',
          text: 'initial:\n' +
            '    active\n' +
            '    recontractable\n' +
            '    exhibit\n' +
            '    terminate',
        }, {
          id: '23sdfasd21',
          name: '合约2',
          createTime: '2020/05/19',
          text: 'initial:\n' +
            '    active\n' +
            '    recontractable\n' +
            '    exhibit\n' +
            '    terminate',
        }]
      }
    ],

    allVersions: [],
    version: '',
    releaseTime: '',
    description: '',
    showAllDescription: true,

    properties: [],

    options: [],

    signExhibitName: '',
  },
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
    * fetchInfo({}: FetchInfoAction, {call, put, select}: EffectsCommandMap) {
      const {marketResourcePage, user}: ConnectState = yield select(({marketResourcePage, user}: ConnectState) => ({
        marketResourcePage,
        user,
      }));
      // 获取资源信息详情
      const params: InfoParamsType = {
        resourceIdOrName: marketResourcePage.resourceId,
        isLoadPolicyInfo: 1,
      };
      const {data} = yield call(info, params);
      // console.log(data, ' data2309');

      let rawSignResources = [data];

      // 获取上抛资源信息
      if (data.baseUpcastResources.length > 0) {
        // console.log(data.baseUpcastResources.map((r: any) => r.resourceId), '0928384u290u49023');
        const params1: BatchInfoParamsType = {
          resourceIds: data.baseUpcastResources.map((r: any) => r.resourceId).join(','),
          isLoadPolicyInfo: 1,
        };
        const {data: data1} = yield call(batchInfo, params1);
        // console.log(data1, 'data12390jsdfo');
        rawSignResources = [
          ...rawSignResources,
          ...data1,
        ]
      }

      // console.log(rawSignResources, 'rawSignResources2309ef');

      // 获取当前用户与当前资源签过约的所有节点
      const params3: PresentableListParamsType = {
        userId: user.info?.userId,
        resourceIds: marketResourcePage.resourceId,
        // projection: 'nodeId',
      };

      const {data: data3} = yield call(presentableList, params3);

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
          signResources: rawSignResources.map((rs: any, i: number) => ({
            selected: i === 0,
            id: rs.resourceId,
            name: rs.resourceName,
            type: rs.resourceType,
            policies: rs.policies.map((rsp: any) => ({
              checked: true,
              id: rsp.policyId,
              name: rsp.policyName,
              text: rsp.policyText,
            }))
          }))
        },
      });

      yield put<FetchVersionInfoAction>({
        type: 'fetchVersionInfo',
      });
    },
    * fetchCollectionInfo({}: FetchCollectionInfoAction, {call, select, put}: EffectsCommandMap) {
      const {marketResourcePage}: ConnectState = yield select(({marketResourcePage}: ConnectState) => ({
        marketResourcePage,
      }));

      const params1 = {
        resourceIds: marketResourcePage.resourceId,
      };

      const {data: data1} = yield call(isCollected, params1);

      const params2: CollectedCountParamsType = {
        resourceId: marketResourcePage.resourceId,
      };

      const {data: data2} = yield call(collectedCount, params2);

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
        const params: CollectResourceParamsType = {
          resourceId: marketResourcePage.resourceId,
        };
        yield call(collectResource, params)
      } else {
        const params: DeleteCollectResourceParamsType = {
          resourceId: marketResourcePage.resourceId,
        };
        yield call(deleteCollectResource, params);
      }

      yield put<FetchCollectionInfoAction>({
        type: 'fetchCollectionInfo',
      });
    },
    * fetchSignedResources({}: FetchSignedResourcesAction, {}: EffectsCommandMap) {

    },
    * fetchVersionInfo({}: FetchVersionInfoAction, {call, select, put}: EffectsCommandMap) {
      const {marketResourcePage}: ConnectState = yield select(({marketResourcePage}: ConnectState) => ({
        marketResourcePage
      }));
      const params: ResourceVersionInfoParamsType1 = {
        version: marketResourcePage.version,
        resourceId: marketResourcePage.resourceId,
      };
      const {data} = yield call(resourceVersionInfo, params);
      // console.log(data, '98sdalkf');
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
              .map((p: any) => ({
                key: p.key,
                value: p.defaultValue,
              })),
          ],
          options: data.customPropertyDescriptors.filter((p: any) => p.type !== 'readonlyText')
            .map((p: any) => ({
              key: p.key,
              value: p.defaultValue,
            })),
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
    * signContract({}: SignContractAction, {call, select}: EffectsCommandMap) {
      const {marketResourcePage, nodes}: ConnectState = yield select(({marketResourcePage, nodes}: ConnectState) => ({
        marketResourcePage,
        nodes,
      }));
      const params: CreatePresentableParamsType = {
        nodeId: marketResourcePage.selectedNodeID,
        resourceId: marketResourcePage.resourceId,
        version: marketResourcePage.version,
        presentableName: marketResourcePage.signExhibitName,
        resolveResources: marketResourcePage.signResources.map((sr) => ({
          resourceId: sr.id,
          contracts: sr.policies.filter((srp) => srp.checked)
            .map((srp) => ({
              policyId: srp.id,
            }))
        })),
      };
      const {data} = yield call(createPresentable, params);
      console.log(data, 'data0923ure2p3oi');
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
