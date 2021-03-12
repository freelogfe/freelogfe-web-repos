import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {list, ListParamsType} from "@/services/resources";
import {debounce} from 'redux-saga/effects'
import {ConnectState} from "@/models/connect";
import {FApiServer} from "@/services";

export interface ResourceListPageModelState {
  resourceType: string;
  resourceStatus: string;
  inputText: string;
  pageSize: number;
  totalNum: number;
  dataSource: {
    id: string;
    cover: string;
    title: string;
    version: string;
    policy: string[],
    type: string;
    status: 0 | 1;
  }[];
}

export interface FetchDataSourceAction extends AnyAction {
  type: 'fetchDataSource' | 'resourceListPage/fetchDataSource';
  payload?: boolean; // 是否 restart
}

export interface ChangeStatesAction extends AnyAction {
  type: 'resourceListPage/changeStates',
  payload: Partial<Pick<ResourceListPageModelState, 'resourceType' | 'resourceStatus' | 'inputText'>>;
}

export interface ChangeAction extends AnyAction {
  type: 'change',
  payload: Partial<ResourceListPageModelState>;
}

export interface ClearDataAction extends AnyAction {
  type: 'resourceListPage/clearData';
}

export interface ResourceListPageModelType {
  namespace: 'resourceListPage';
  state: ResourceListPageModelState;
  effects: {
    changeStates: (action: ChangeStatesAction, effects: EffectsCommandMap) => void;
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;
    clearData: (action: ClearDataAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceListPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: ResourceListPageModelState = {
  resourceType: '-1',
  resourceStatus: '2',
  inputText: '',
  dataSource: [],
  pageSize: 20,
  totalNum: -1,
};

const Model: ResourceListPageModelType = {

  namespace: 'resourceListPage',

  state: initStates,

  effects: {
    * changeStates({payload}: ChangeStatesAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload,
      });

      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: true,
      });
    },
    * fetchDataSource({payload}: FetchDataSourceAction, {call, put, select}: EffectsCommandMap) {
      // yield put({type: 'save'});
      const {resourceListPage}: ConnectState = yield select(({resourceListPage}: ConnectState) => ({
        resourceListPage,
      }));

      let dataSource: ResourceListPageModelState['dataSource'] = [];
      if (!payload) {
        dataSource = resourceListPage.dataSource;
      }

      const params: Parameters<typeof FApiServer.Resource.list>[0] = {
        skip: dataSource.length,
        limit: resourceListPage.pageSize,
        keywords: resourceListPage.inputText,
        resourceType: resourceListPage.resourceType === '-1' ? undefined : resourceListPage.resourceType,
        status: Number(resourceListPage.resourceStatus) as 0 | 1 | 2,
        isSelf: 1,
      };
      const {data} = yield call(FApiServer.Resource.list, params);
      // console.log(data, 'data')

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataSource: [
            ...dataSource,
            ...(data.dataList as any[]).map<ResourceListPageModelState['dataSource'][number]>((i: any) => ({
              id: i.resourceId,
              cover: i.coverImages.length > 0 ? i.coverImages[0] : '',
              title: i.resourceName,
              version: i.latestVersion,
              policy: i.policies.map((l: any) => l.policyName),
              type: i.resourceType,
              status: i.status,
            })),
          ],
          totalNum: data.totalItem,
        },
      });
    },
    * clearData({}: ClearDataAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
  },

  reducers: {
    change(state: ResourceListPageModelState, action: ChangeAction): ResourceListPageModelState {
      return {
        ...state,
        ...action.payload
      };
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
      // history.listen((listener) => {
      //   if (listener.pathname === '/resource/list') {
      //     dispatch<FetchDataSourceAction>({
      //       type: 'fetchDataSource',
      //     });
      //   }
      // });
    },

  },

};

export default Model;
