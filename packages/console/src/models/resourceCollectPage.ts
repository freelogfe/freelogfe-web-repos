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

export interface OnMountAction extends AnyAction {
  type: 'resourceCollectPage/onMount';
}

export interface OnUnmountAction extends AnyAction {
  type: 'resourceCollectPage/onUnmount';
}

export interface InitModelStatesAction extends AnyAction {
  type: 'resourceCollectPage/initModelStates';
}

export interface FetchDataSourceAction extends AnyAction {
  type: 'resourceCollectPage/fetchDataSource' | 'fetchDataSource';
  payload: {
    restart: boolean;
  };
}

export interface OnChangeResourceTypeAction extends AnyAction {
  type: 'resourceCollectPage/onChangeResourceType';
  payload: {
    value: string;
  };
}

export interface OnChangeStatusAction extends AnyAction {
  type: 'resourceCollectPage/onChangeStatus';
  payload: {
    value: string;
  };
}

export interface OnChangeKeywordsAction extends AnyAction {
  type: 'resourceCollectPage/onChangeKeywords';
  payload: {
    value: string;
  };
}

export interface OnClickLoadingMordAction extends AnyAction {
  type: 'resourceCollectPage/onClickLoadingMord';
}

// export interface ChangeStatesAction extends AnyAction {
//   type: 'resourceCollectPage/changeStates',
//   payload: Partial<Pick<ResourceCollectPageModelState, 'resourceType' | 'resourceStatus' | 'inputText'>>;
// }

export interface OnBoomJuiceAction extends AnyAction{
  type: 'resourceCollectPage/onBoomJuice';
  payload: string;
}

export interface ResourceCollectModelType {
  namespace: 'resourceCollectPage';
  state: ResourceCollectPageModelState;
  effects: {
    onMount: (action: OnMountAction, effects: EffectsCommandMap) => void;
    onUnmount: (action: OnUnmountAction, effects: EffectsCommandMap) => void;
    initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
    // changeStates: (action: ChangeStatesAction, effects: EffectsCommandMap) => void;
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;
    onChangeResourceType: (action: OnChangeResourceTypeAction, effects: EffectsCommandMap) => void;
    onChangeStatus: (action: OnChangeStatusAction, effects: EffectsCommandMap) => void;
    onChangeKeywords: (action: OnChangeKeywordsAction, effects: EffectsCommandMap) => void;
    onClickLoadingMord: (action: OnClickLoadingMordAction, effects: EffectsCommandMap) => void;
    onBoomJuice: (action: OnBoomJuiceAction, effects: EffectsCommandMap) => void;
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
    * onMount({}: OnMountAction, {put}: EffectsCommandMap) {
      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: {
          restart: true,
        },
      });
    },
    * onUnmount({}: OnUnmountAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * initModelStates({}: InitModelStatesAction, {put}: EffectsCommandMap) {
      // console.log('InitModelStatesAction#@#@#@#@##@#');
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    // * changeStates({payload}: ChangeStatesAction, {put}: EffectsCommandMap) {
    //   yield put<ChangeAction>({
    //     type: 'change',
    //     payload,
    //   });
    //   yield put<FetchDataSourceAction>({
    //     type: 'fetchDataSource',
    //   });
    // },
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
    * onChangeResourceType({payload}: OnChangeResourceTypeAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceType: payload.value
        },
      });

      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: {
          restart: true,
        },
      });
    },
    * onChangeStatus({payload}: OnChangeStatusAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceStatus: payload.value as '1',
        },
      });

      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: {
          restart: true,
        },
      });
    },
    * onChangeKeywords({payload}: OnChangeKeywordsAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          inputText: payload.value
        },
      });

      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: {
          restart: true,
        },
      });
    },
    * onClickLoadingMord({}: OnClickLoadingMordAction, {put}: EffectsCommandMap) {
      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: {
          restart: false,
        },
      });
    },
    * onBoomJuice({payload}: OnBoomJuiceAction, {call, put, select}: EffectsCommandMap) {
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
