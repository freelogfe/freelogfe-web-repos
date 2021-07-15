import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {ConnectState, ResourceListPageModelState} from '@/models/connect';
import {FServiceAPI} from '@freelog/tools-lib';

export interface ResourceCollectPageModelState {
  resourceType: string;
  resourceStatus: '0' | '1' | '2';
  inputText: string;
  // pageCurrent: number;
  pageSize: number;
  totalNum: number;
  dataSource: {
    id: string;
    cover: string;
    title: string;
    version: string;
    policy: string[];
    type: string;
    status: 0 | 1;
  }[];
}

export interface ChangeAction extends AnyAction {
  type: 'change',
  payload: Partial<ResourceCollectPageModelState>;
}

export interface InitModelStatesAction extends AnyAction {
  type: 'resourceCollectPage/initModelStates';
}

export interface FetchDataSourceAction extends AnyAction {
  type: 'resourceCollectPage/fetchDataSource' | 'fetchDataSource';
  payload?: boolean; // 是否 restart
}

export interface ChangeStatesAction extends AnyAction {
  type: 'resourceCollectPage/changeStates',
  payload: Partial<Pick<ResourceCollectPageModelState, 'resourceType' | 'resourceStatus' | 'inputText'>>;
}

export interface BoomJuiceAction {
  type: 'resourceCollectPage/boomJuice';
  payload: string;
}

export interface ResourceCollectModelType {
  namespace: 'resourceCollectPage';
  state: ResourceCollectPageModelState;
  effects: {
    initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
    changeStates: (action: ChangeStatesAction, effects: EffectsCommandMap) => void;
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;
    boomJuice: (action: BoomJuiceAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceCollectPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const initStates: ResourceCollectPageModelState = {
  resourceType: '-1',
  resourceStatus: '2',
  inputText: '',
  dataSource: [],
  pageSize: 20,
  totalNum: -1,
};

const Model: ResourceCollectModelType = {

  namespace: 'resourceCollectPage',

  state: initStates,

  effects: {
    * initModelStates({}: InitModelStatesAction, {put}: EffectsCommandMap) {
      // console.log('InitModelStatesAction#@#@#@#@##@#');
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * changeStates({payload}: ChangeStatesAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload,
      });
      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
      });
    },
    * fetchDataSource({payload}: FetchDataSourceAction, {call, put, select}: EffectsCommandMap) {
      // console.log('FetchDataSourceAction23423434');
      const {resourceCollectPage}: ConnectState = yield select(({resourceCollectPage}: ConnectState) => ({
        resourceCollectPage,
      }));

      let dataSource: ResourceListPageModelState['dataSource'] = [];
      if (!payload) {
        dataSource = resourceCollectPage.dataSource;
      }

      const params: Parameters<typeof FServiceAPI.Collection.collectionResources>[0] = {
        skip: dataSource.length,
        limit: resourceCollectPage.pageSize,
        keywords: resourceCollectPage.inputText,
        resourceType: resourceCollectPage.resourceType === '-1' ? undefined : resourceCollectPage.resourceType,
        resourceStatus: Number(resourceCollectPage.resourceStatus) as 0 | 1 | 2,
      };

      const {data} = yield call(FServiceAPI.Collection.collectionResources, params);
      // console.log(data, 'data3290joisdf');

      let data1: any[] = [];

      if (data.dataList.length > 0) {

        const params1: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
          resourceIds: data.dataList.map((d: any) => d.resourceId).join(','),
        };

        const {data: data2} = yield call(FServiceAPI.Resource.batchInfo, params1);

        data1 = data2;
      }

      // console.log(data1, 'data1w09ejflk23');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataSource: [
            ...dataSource,
            ...(data1 as any[]).map<ResourceListPageModelState['dataSource'][number]>((i: any) => ({
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
    * boomJuice({payload}: BoomJuiceAction, {call, put, select}: EffectsCommandMap) {
      const params: Parameters<typeof FServiceAPI.Collection.deleteCollectResource>[0] = {
        resourceId: payload,
      };
      yield call(FServiceAPI.Collection.deleteCollectResource, params);
      const {resourceCollectPage}: ConnectState = yield select(({resourceCollectPage}: ConnectState) => ({
        resourceCollectPage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataSource: resourceCollectPage.dataSource.filter((ds) => ds.id !== payload),
          totalNum: resourceCollectPage.totalNum - 1,
        },
      });
    }
  },

  reducers: {
    change(state: ResourceCollectPageModelState, {payload}: ChangeAction): ResourceCollectPageModelState {
      return {
        ...state,
        ...payload
      };
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
      // history.listen((listener) => {
      //   if (listener.pathname === '/resource/collect') {
      //     dispatch<FetchDataSourceAction>({
      //       type: 'fetchDataSource',
      //     });
      //   }
      // });
    },
  },

};

export default Model;
