import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {ConnectState, ResourceListPageModelState} from '@/models/connect';
import {collectionResources, CollectionResourcesParamsType} from '@/services/collections';

export interface ResourceCollectPageModelState {
  resourceType: string;
  resourceStatus: string;
  inputText: string;
  pageCurrent: number;
  pageSize: number;
  totalNum: number;
  dataSource: {
    id: string;
    cover: string;
    title: string;
    version: string;
    policy: string[];
    type: string;
  }[];
}

export interface FetchDataSourceAction extends AnyAction {
  type: 'resourceCollectPage/fetchDataSource' | 'fetchDataSource',
}

export interface ChangeStatesAction extends AnyAction {
  type: 'resourceCollectPage/changeStates',
  payload: {
    resourceType?: string;
    resourceStatus?: string;
    inputText?: string;
    pageCurrent?: number;
    pageSize?: number;
  };
}

export interface ChangeAction extends AnyAction {
  type: 'change',
  payload: Partial<ResourceListPageModelState>;
}

export interface ResourceCollectModelType {
  namespace: 'resourceCollectPage';
  state: ResourceCollectPageModelState;
  effects: {
    changeStates: (action: ChangeStatesAction, effects: EffectsCommandMap) => void;
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceCollectPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceCollectModelType = {

  namespace: 'resourceCollectPage',

  state: {
    resourceType: '-1',
    resourceStatus: '2',
    inputText: '',
    dataSource: [],
    pageCurrent: 1,
    pageSize: 20,
    totalNum: -1,
  },

  effects: {
    * changeStates({payload}: ChangeStatesAction, {put}: EffectsCommandMap) {
      if (payload.resourceType || payload.inputText || payload.pageSize || payload.resourceStatus) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            ...payload,
            pageCurrent: 1,
          },
        });
      } else {
        yield put<ChangeAction>({
          type: 'change',
          payload,
        });
      }
      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
      });
    },
    * fetchDataSource({}: FetchDataSourceAction, {call, put, select}: EffectsCommandMap) {
      const params: CollectionResourcesParamsType = yield select(({resourceCollectPage}: ConnectState) => ({
        page: resourceCollectPage.pageCurrent,
        pageSize: resourceCollectPage.pageSize,
        keywords: resourceCollectPage.inputText,
        resourceType: resourceCollectPage.resourceType === '-1' ? undefined : resourceCollectPage.resourceType,
        resourceStatus: resourceCollectPage.resourceStatus === '-1' ? 2 : resourceCollectPage.resourceStatus,
      }));
      const {data} = yield call(collectionResources, params);
      console.log(data, 'data3290joisdf');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataSource: data.dataList.map((d: any) => ({
            id: d.resourceId,
            cover: d.coverImages[0],
            title: d.resourceName,
            version: d.latestVersion,
            status: d.resourceStatus,
            policy: ['TODO策略无法展示'],
            type: d.resourceType,
          })),
          totalNum: data.totalItem,
        },
      });
    },
  },

  reducers: {
    change(state: ResourceCollectPageModelState, action: ChangeAction): ResourceCollectPageModelState {
      return {
        ...state,
        ...action.payload
      };
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
      history.listen((listener) => {
        if (listener.pathname === '/resource/collect') {
          dispatch<FetchDataSourceAction>({
            type: 'fetchDataSource',
          });
        }
      });
    },
  },

};

export default Model;
