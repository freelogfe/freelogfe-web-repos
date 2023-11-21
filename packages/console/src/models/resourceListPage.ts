import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import { ConnectState } from '@/models/connect';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { listStateAndListMore } from '@/components/FListFooter';

export interface ResourceListPageModelState {
  resourceTypeCodes: {
    value: string;
    label: string;
    values: string[];
    labels: string[];
  };
  resourceStatus: 0 | 1 | 2 | 4 | '#';
  inputText: string;

  isBatchManagement: boolean;
  checkedResourceIDs: string[];

  resource_List: {
    id: string;
    cover: string;
    name: string;
    title: string;
    version: string;
    policy: string[],
    type: string[];
    status: 0 | 1 | 2 | 4;
    authProblem: boolean;
  }[];
  resource_ListState: 'loading' | 'noData' | 'noSearchResult' | 'loaded';
  resource_ListMore: 'loading' | 'andMore' | 'noMore';

}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceListPage/change',
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

export interface OnChangeResourceTypeAction extends AnyAction {
  type: 'resourceListPage/onChangeResourceType';
  payload: {
    value: ResourceListPageModelState['resourceTypeCodes'];
  };
}

export interface OnChangeStatusAction extends AnyAction {
  type: 'resourceListPage/onChangeStatus';
  payload: {
    value: 0 | 1 | 2 | 4 | '#';
  };
}

export interface OnChangeKeywordsAction extends AnyAction {
  type: 'resourceListPage/onChangeKeywords';
  payload: {
    value: string;
  };
}

export interface OnAwaited_KeywordsChange_Action extends AnyAction {
  type: 'resourceListPage/onAwaited_KeywordsChange';
}

export interface OnClickLoadingMordAction extends AnyAction {
  type: 'resourceListPage/onClickLoadingMord';
}

export interface OnBatchUpdateAction extends AnyAction {
  type: 'resourceListPage/onBatchUpdate';
  payload: {
    status: 0 | 4;
    addPolicies: {
      policyName: string;
      policyText: string;
      status: 0 | 1;
    }[];
  };
}


export interface ResourceListPageModelType {
  namespace: 'resourceListPage';
  state: ResourceListPageModelState;
  effects: {
    onMount: (action: OnMountAction, effects: EffectsCommandMap) => void;
    onUnmount: (action: OnUnmountAction, effects: EffectsCommandMap) => void;
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;
    onChangeResourceType: (action: OnChangeResourceTypeAction, effects: EffectsCommandMap) => void;
    onChangeStatus: (action: OnChangeStatusAction, effects: EffectsCommandMap) => void;
    onChangeKeywords: (action: OnChangeKeywordsAction, effects: EffectsCommandMap) => void;
    onAwaited_KeywordsChange: (action: OnAwaited_KeywordsChange_Action, effects: EffectsCommandMap) => void;
    onClickLoadingMord: (action: OnClickLoadingMordAction, effects: EffectsCommandMap) => void;
    onBatchUpdate: (action: OnBatchUpdateAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceListPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: ResourceListPageModelState = {
  resourceTypeCodes: {
    value: '#all',
    label: '全部',
    values: ['#all'],
    labels: ['全部'],
  },
  resourceStatus: '#',
  inputText: '',
  isBatchManagement: false,
  checkedResourceIDs: [],
  resource_List: [],
  resource_ListState: 'loading',
  resource_ListMore: 'loading',
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

      // let dataSource: ResourceListPageModelState['dataSource'] = [];
      let resource_List: ResourceListPageModelState['resource_List'] = [];

      if (!payload.restart) {
        // dataSource = resourceListPage.dataSource;
        resource_List = resourceListPage.resource_List;
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            // resource_ListState: 'loading',
            resource_ListMore: 'loading',
          },
        });
      }

      const resourceTypes: string[] = resourceListPage.resourceTypeCodes.value.split('#');
      let resourceTypeCode: string = resourceTypes[0];
      let resourceTypeCategory: 1 | 2 = 1;
      let resourceType: string = '';

      if (resourceTypes.length > 1 && resourceTypes[resourceTypes.length - 1] === 'other') {
        resourceTypeCode = resourceTypes[0];
        resourceTypeCategory = 2;
      }

      if (resourceTypes.length > 1 && resourceTypes[resourceTypes.length - 1] === 'all') {
        resourceType = resourceListPage.resourceTypeCodes.labels[resourceListPage.resourceTypeCodes.labels.length - 2];
      }

      const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
        // skip: dataSource.length,
        skip: resource_List.length,
        limit: FUtil.Predefined.pageSize,
        keywords: resourceListPage.inputText || undefined,
        resourceType: resourceType || undefined,
        resourceTypeCode: resourceType === '' ? (resourceTypeCode || undefined) : undefined,
        resourceTypeCategory: resourceType === '' ? resourceTypeCategory : undefined,
        status: resourceListPage.resourceStatus === '#' ? undefined : (resourceListPage.resourceStatus as 0),
        isSelf: 1,
      };

      const { ret, errCode, data: data_resourceList }: {
        ret: number;
        errCode: number;
        data: {
          limit: number;
          skip: number;
          totalItem: number;
          dataList: {
            resourceId: string;
            resourceName: string;
            resourceTitle: string;
            resourceType: string[];
            latestVersion: string;
            coverImages: string[];
            status: 0 | 1;
            policies: {
              policyId: string;
              policyName: string;
              status: 0 | 1;
            }[];
          }[];
        };
      } = yield call(FServiceAPI.Resource.list, params);
      // console.log(data, 'data')

      let auths: any[] = [];
      const resourceIds: string = data_resourceList.dataList
        .filter((r) => {
          return r.latestVersion !== '';
        })
        .map((r) => {
          return r.resourceId;
        }).join(',');
      if (resourceIds !== '') {
        const parmas1: Parameters<typeof FServiceAPI.Resource.batchAuth>[0] = {
          resourceIds: resourceIds,
        };
        const { data: data1 } = yield call(FServiceAPI.Resource.batchAuth, parmas1);
        auths = data1;
      }

      const finalList = [
        ...resource_List,
        ...data_resourceList.dataList.map<ResourceListPageModelState['resource_List'][number]>((i) => {
          const res = auths.find((dd: any) => {
            return dd.resourceId === i.resourceId;
          });
          return {
            id: i.resourceId,
            cover: i.coverImages.length > 0 ? i.coverImages[0] : '',
            name: i.resourceName,
            title: i.resourceTitle,
            version: i.latestVersion,
            policy: i.policies
              .filter((l) => {
                return l.status === 1;
              })
              .map((l: any) => l.policyName),
            type: i.resourceType,
            status: i.status,
            authProblem: !!res && !res.isAuth,
          };
        }),
      ];

      const { state, more } = listStateAndListMore({
        list_Length: finalList.length,
        total_Length: data_resourceList.totalItem,
        has_FilterCriteria: resourceListPage.inputText !== ''
          || resourceTypes.length !== 0
          || resourceListPage.resourceStatus !== '#',
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resource_List: finalList,
          resource_ListState: state,
          resource_ListMore: more,
        },
      });
    },
    * onChangeResourceType({ payload }: OnChangeResourceTypeAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceTypeCodes: payload.value,
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
    },
    * onAwaited_KeywordsChange({}: OnAwaited_KeywordsChange_Action, { put }: EffectsCommandMap) {
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
    * onBatchUpdate({ payload }: OnBatchUpdateAction, {}: EffectsCommandMap) {

    },
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
