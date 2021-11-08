import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import { ConnectState } from '@/models/connect';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';

export interface ResourceListPageModelState {
  resourceType: string;
  resourceStatus: string;
  inputText: string;
  // pageSize: number;
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

export interface ChangeAction extends AnyAction {
  type: 'change',
  payload: Partial<ResourceListPageModelState>;
}

export interface OnMountAction extends AnyAction {
  type: 'resourceListPage/onMount';
}

export interface OnUnmountAction extends AnyAction {
  type: 'resourceListPage/onUnmount';
}

export interface FetchDataSourceAction extends AnyAction {
  type: 'fetchDataSource';
  payload: {
    restart: boolean;
  };
}

// export interface ChangeStatesAction extends AnyAction {
//   type: 'resourceListPage/changeStates',
//   payload: Partial<Pick<ResourceListPageModelState, 'resourceType' | 'resourceStatus' | 'inputText'>>;
// }

export interface OnChangeResourceTypeAction extends AnyAction {
  type: 'resourceListPage/onChangeResourceType';
  payload: {
    value: string;
  };
}

export interface OnChangeStatusAction extends AnyAction {
  type: 'resourceListPage/onChangeStatus';
  payload: {
    value: string;
  };
}

export interface OnChangeKeywordsAction extends AnyAction {
  type: 'resourceListPage/onChangeKeywords';
  payload: {
    value: string;
  };
}

export interface OnClickLoadingMordAction extends AnyAction {
  type: 'resourceListPage/onClickLoadingMord';
}

// export interface ClearDataAction extends AnyAction {
//   type: 'resourceListPage/clearData';
// }

export interface ResourceListPageModelType {
  namespace: 'resourceListPage';
  state: ResourceListPageModelState;
  effects: {
    onMount: (action: OnMountAction, effects: EffectsCommandMap) => void;
    onUnmount: (action: OnUnmountAction, effects: EffectsCommandMap) => void;
    // changeStates: (action: ChangeStatesAction, effects: EffectsCommandMap) => void;
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;
    onChangeResourceType: (action: OnChangeResourceTypeAction, effects: EffectsCommandMap) => void;
    onChangeStatus: (action: OnChangeStatusAction, effects: EffectsCommandMap) => void;
    onChangeKeywords: (action: OnChangeKeywordsAction, effects: EffectsCommandMap) => void;
    onClickLoadingMord: (action: OnClickLoadingMordAction, effects: EffectsCommandMap) => void;
    // clearData: (action: ClearDataAction, effects: EffectsCommandMap) => void;
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
  // pageSize: 20,
  totalNum: -1,
};

const Model: ResourceListPageModelType = {

  namespace: 'resourceListPage',

  state: initStates,

  effects: {
    * onMount({}: OnMountAction, { put }: EffectsCommandMap) {
      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: {
          restart: true,
        },
      });
    },
    * onUnmount({}: OnUnmountAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * fetchDataSource({ payload }: FetchDataSourceAction, { call, put, select }: EffectsCommandMap) {
      // yield put({type: 'save'});
      const { resourceListPage }: ConnectState = yield select(({ resourceListPage }: ConnectState) => ({
        resourceListPage,
      }));

      let dataSource: ResourceListPageModelState['dataSource'] = [];

      if (!payload.restart) {
        dataSource = resourceListPage.dataSource;
      }

      // console.log(dataSource, 'dataSourcedataSource92834uoi');

      const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
        skip: dataSource.length,
        // limit: resourceListPage.pageSize,
        limit: FUtil.Predefined.pageSize,
        keywords: resourceListPage.inputText,
        resourceType: resourceListPage.resourceType === '-1' ? undefined : resourceListPage.resourceType,
        status: Number(resourceListPage.resourceStatus) as 0 | 1 | 2,
        isSelf: 1,
      };
      const { data } = yield call(FServiceAPI.Resource.list, params);
      // console.log(data, 'data')

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataSource: [
            ...dataSource,
            ...(data.dataList as any[]).map<ResourceListPageModelState['dataSource'][number]>((i: any) => {
              return {
                id: i.resourceId,
                cover: i.coverImages.length > 0 ? i.coverImages[0] : '',
                title: i.resourceName,
                version: i.latestVersion,
                policy: i.policies
                  .filter((l: any) => {
                    return l.status === 1;
                  })
                  .map((l: any) => l.policyName),
                type: i.resourceType,
                status: i.status,
              };
            }),
          ],
          totalNum: data.totalItem,
        },
      });
    },
    * onChangeResourceType({ payload }: OnChangeResourceTypeAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceType: payload.value,
        },
      });

      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: {
          restart: true,
        },
      });
    },
    * onChangeStatus({ payload }: OnChangeStatusAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceStatus: payload.value,
        },
      });

      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: {
          restart: true,
        },
      });
    },
    * onChangeKeywords({ payload }: OnChangeKeywordsAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          inputText: payload.value,
        },
      });

      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: {
          restart: true,
        },
      });
    },
    * onClickLoadingMord({}: OnClickLoadingMordAction, { put }: EffectsCommandMap) {
      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: {
          restart: false,
        },
      });
    },
    // * clearData({}: ClearDataAction, {put}: EffectsCommandMap) {
    //   yield put<ChangeAction>({
    //     type: 'change',
    //     payload: initStates,
    //   });
    // },
  },

  reducers: {
    change(state: ResourceListPageModelState, action: ChangeAction): ResourceListPageModelState {
      return {
        ...state,
        ...action.payload,
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }: SubscriptionAPI) {

    },
  },

};

export default Model;
