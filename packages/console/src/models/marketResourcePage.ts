import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {info, InfoParamsType, resourceVersionInfo, ResourceVersionInfoParamsType1} from "@/services/resources";
import {ConnectState} from "@/models/connect";
import {
  collectedCount,
  CollectedCountParamsType,
  collectResource,
  CollectResourceParamsType, deleteCollectResource, DeleteCollectResourceParamsType,
  isCollected
} from "@/services/collections";
import {formatDateTime} from "@/utils/format";
import {presentableList, PresentableListParamsType} from "@/services/presentables";

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

  signedNodeIDs: string[];
  selectedNodeDomain: string;

  signResources: {
    checked: boolean;
    id: string;
    name: string;
    type: string;
    policies?: {
      checked: boolean;
      id: string;
      name: string;
      text: string;
    }[];
    contracts?: {
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

export interface FetchVersionInfoAction extends AnyAction {
  type: 'fetchVersionInfo';
}

export interface OnChangeVersionAction extends AnyAction {
  type: 'marketResourcePage/onChangeVersion';
  payload: string;
}

export interface MarketResourcePageModelType {
  namespace: 'marketResourcePage';
  state: MarketResourcePageState;
  effects: {
    initData: (action: InitDataAction, effects: EffectsCommandMap) => void;
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    fetchCollectionInfo: (action: FetchCollectionInfoAction, effects: EffectsCommandMap) => void;
    onClickCollection: (action: OnClickCollectionAction, effects: EffectsCommandMap) => void;
    fetchVersionInfo: (action: FetchVersionInfoAction, effects: EffectsCommandMap) => void;
    onChangeVersion: (action: OnChangeVersionAction, effects: EffectsCommandMap) => void;
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
      selectedNodeDomain: '',

      signResources: [
        // {
        //   checked: true,
        //   id: '234dsfds',
        //   name: 'stefan/Smells like teen spirit',
        //   type: 'audio',
        //   policies: [
        //     {
        //       checked: true,
        //       id: '23sdfasd',
        //       name: '策略1',
        //       text: 'initial:\n' +
        //         '    active\n' +
        //         '    recontractable\n' +
        //         '    exhibit\n' +
        //         '    terminate',
        //     }, {
        //       checked: true,
        //       id: '23sdfasd',
        //       name: '策略1',
        //       text: 'initial:\n' +
        //         '    active\n' +
        //         '    recontractable\n' +
        //         '    exhibit\n' +
        //         '    terminate',
        //     }
        //   ],
        // },
        {
          checked: true,
          id: '234dsfds2',
          name: 'stefan/Smells like teen spirit',
          type: 'audio',
          contracts: [{
            id: '23sdfasd',
            name: '策略1',
            createTime: '2020/05/19',
            text: 'initial:\n' +
              '    active\n' +
              '    recontractable\n' +
              '    exhibit\n' +
              '    terminate',
          }, {
            id: '23sdfasd2',
            name: '策略1',
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
        const params: InfoParamsType = {
          resourceIdOrName: marketResourcePage.resourceId,
        };
        const {data} = yield call(info, params);

        const param3: PresentableListParamsType = {
          userId: user.info?.userId,
          resourceIds: marketResourcePage.resourceId,
          // projection: 'nodeId',
        };

        const {data: data3} = yield call(presentableList, param3);

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
  }
;

export default Model;
