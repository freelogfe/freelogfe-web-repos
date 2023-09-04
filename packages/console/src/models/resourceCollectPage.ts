import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import { ConnectState } from '@/models/connect';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { listStateAndListMore } from '@/components/FListFooter';

export interface ResourceCollectPageModelState {
  resourceTypeCodes: {
    value: string;
    label: string;
    values: string[];
    labels: string[];
  };
  resourceStatus: 0 | 1 | 2 | 4 | '#';
  inputText: string;
  totalNum: number;

  resource_List: {
    id: string;
    cover: string;
    name: string;
    title: string;
    version: string;
    policy: string[];
    type: string[];
    status: 0 | 1;
  }[];
  resource_ListState: 'loading' | 'noData' | 'noSearchResult' | 'loaded';
  resource_ListMore: 'loading' | 'andMore' | 'noMore';
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
    value: ResourceCollectPageModelState['resourceTypeCodes'];
  };
}

export interface OnChangeStatusAction extends AnyAction {
  type: 'resourceCollectPage/onChangeStatus';
  payload: {
    value: 0 | 1 | 2 | 4 | '#';
  };
}

export interface OnChangeKeywordsAction extends AnyAction {
  type: 'resourceCollectPage/onChangeKeywords';
  payload: {
    value: string;
  };
}

export interface OnAwaited_KeywordsChange_Action extends AnyAction {
  type: 'resourceCollectPage/onAwaited_KeywordsChange';
}

export interface OnClickLoadingMordAction extends AnyAction {
  type: 'resourceCollectPage/onClickLoadingMord';
}

export interface OnBoomJuiceAction extends AnyAction {
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
    onAwaited_KeywordsChange: (action: OnAwaited_KeywordsChange_Action, effects: EffectsCommandMap) => void;
    onClickLoadingMord: (action: OnClickLoadingMordAction, effects: EffectsCommandMap) => void;
    onBoomJuice: (action: OnBoomJuiceAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceCollectPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const initStates: ResourceCollectPageModelState = {
  resourceTypeCodes: {
    value: '#all',
    label: '全部',
    values: ['#all'],
    labels: ['全部'],
  },
  resourceStatus: '#',
  inputText: '',
  // dataSource: [],
  // pageSize: 20,
  totalNum: -1,
  resource_List: [],
  resource_ListState: 'loading',
  resource_ListMore: 'loading',
};

const Model: ResourceCollectModelType = {

  namespace: 'resourceCollectPage',

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
    * initModelStates({}: InitModelStatesAction, { put }: EffectsCommandMap) {
      // console.log('InitModelStatesAction#@#@#@#@##@#');
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * fetchDataSource({ payload }: FetchDataSourceAction, { call, put, select }: EffectsCommandMap) {
      // console.log('FetchDataSourceAction23423434');
      const { resourceCollectPage }: ConnectState = yield select(({ resourceCollectPage }: ConnectState) => ({
        resourceCollectPage,
      }));

      let resource_List: ResourceCollectPageModelState['resource_List'] = [];
      if (!payload) {
        resource_List = resourceCollectPage.resource_List;
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            // resource_ListState: 'loading',
            resource_ListMore: 'loading',
          },
        });
      }

      // const resourceTypes: Array<string | number> = resourceCollectPage.resourceTypeCodes.labels.filter((rt) => {
      //   return rt !== '全部';
      // });

      // const resourceTypes: string[] = resourceCollectPage.resourceTypeCodes.value.split('#');
      // let resourceTypeCode: string = resourceTypes[0];
      // let resourceTypeCategory: 1 | 2 = 1;
      //
      // if (resourceTypes.length > 1 && resourceTypes[resourceTypes.length - 1] === 'other') {
      //   resourceTypeCode = resourceTypes[0];
      //   resourceTypeCategory = 2;
      // }

      const resourceTypes: string[] = resourceCollectPage.resourceTypeCodes.value.split('#');
      let resourceTypeCode: string = resourceTypes[0];
      let resourceTypeCategory: 1 | 2 = 1;
      let resourceType: string = '';

      if (resourceTypes.length > 1 && resourceTypes[resourceTypes.length - 1] === 'other') {
        resourceTypeCode = resourceTypes[0];
        resourceTypeCategory = 2;
      }

      if (resourceTypes.length > 1 && resourceTypes[resourceTypes.length - 1] === 'all') {
        resourceType = resourceCollectPage.resourceTypeCodes.labels[resourceCollectPage.resourceTypeCodes.labels.length - 2];
      }

      const params: Parameters<typeof FServiceAPI.Collection.collectionResources>[0] = {
        // skip: dataSource.length,
        skip: resource_List.length,
        limit: FUtil.Predefined.pageSize,
        keywords: resourceCollectPage.inputText || undefined,
        // resourceType: resourceTypes.length === 0 ? undefined : String(resourceTypes[resourceTypes.length - 1]),
        // resourceTypeCode: resourceTypeCode || undefined,
        // resourceTypeCategory: resourceTypeCategory,
        resourceType: resourceType || undefined,
        resourceTypeCode: resourceType === '' ? (resourceTypeCode || undefined) : undefined,
        resourceTypeCategory: resourceType === '' ? resourceTypeCategory : undefined,
        resourceStatus: resourceCollectPage.resourceStatus === '#' ? undefined : resourceCollectPage.resourceStatus as 0,
      };

      const { ret, errCode, data: data_collection }: {
        ret: number;
        errCode: number;
        data: {
          limit: number;
          skip: number;
          totalItem: number;
          dataList: {
            resourceId: string;
          }[];
        };
      } = yield call(FServiceAPI.Collection.collectionResources, params);
      // console.log(data_collection, ' data_collection data3290joisdf');

      // let data1: any[] = [];

      if (data_collection.dataList.length === 0) {
        const { state, more } = listStateAndListMore({
          list_Length: 0,
          total_Length: data_collection.totalItem,
          has_FilterCriteria: resourceCollectPage.inputText !== ''
            || resourceTypes.length !== 0
            || resourceCollectPage.resourceStatus !== '#',
        });
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            resource_List: [],
            resource_ListState: state,
            resource_ListMore: more,
            totalNum: data_collection.totalItem,
          },
        });
        return;
        // data1 = data2;
      }
      const params1: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
        resourceIds: data_collection.dataList.map((d) => d.resourceId).join(','),
      };

      const { data: data_batchInfo }: {
        ret: number;
        errCode: number;
        data: {
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
      } = yield call(FServiceAPI.Resource.batchInfo, params1);
      // console.log(data_batchInfo, 'data_resourceList data1w09ejflk23');

      const finalList = [
        ...resource_List,
        ...data_batchInfo.map<ResourceCollectPageModelState['resource_List'][number]>((i) => {
          return {
            id: i.resourceId,
            cover: i.coverImages.length > 0 ? i.coverImages[0] : '',
            name: i.resourceName,
            title: i.resourceTitle,
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
      ];

      const { state, more } = listStateAndListMore({
        list_Length: finalList.length,
        total_Length: data_collection.totalItem,
        has_FilterCriteria: resourceCollectPage.inputText !== ''
          || resourceTypes.length !== 0
          || resourceCollectPage.resourceStatus !== '#',
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resource_List: finalList,
          resource_ListState: state,
          resource_ListMore: more,
          totalNum: data_collection.totalItem,
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

      // yield put<FetchDataSourceAction>({
      //   type: 'fetchDataSource',
      //   payload: {
      //     restart: true,
      //   },
      // });
    },
    * onAwaited_KeywordsChange({}: OnAwaited_KeywordsChange_Action, { put }: EffectsCommandMap) {
      // console.log('dddddDDDDDDDfsdf sdfsdf ******');
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
    * onBoomJuice({ payload }: OnBoomJuiceAction, { call, put, select }: EffectsCommandMap) {
      const params: Parameters<typeof FServiceAPI.Collection.deleteCollectResource>[0] = {
        resourceId: payload,
      };
      yield call(FServiceAPI.Collection.deleteCollectResource, params);
      const { resourceCollectPage }: ConnectState = yield select(({ resourceCollectPage }: ConnectState) => ({
        resourceCollectPage,
      }));
      const resourceTypes: Array<string | number> = resourceCollectPage.resourceTypeCodes.labels.filter((rt) => {
        return rt !== '全部';
      });

      const finalList = resourceCollectPage.resource_List.filter((ds) => ds.id !== payload);
      const finalTotalNum = resourceCollectPage.totalNum - 1;

      const { state, more } = listStateAndListMore({
        list_Length: finalList.length,
        total_Length: finalTotalNum,
        has_FilterCriteria: resourceCollectPage.inputText !== ''
          || resourceTypes.length !== 0
          || resourceCollectPage.resourceStatus !== '#',
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // resource_List: resourceCollectPage.resource_List.filter((ds) => ds.id !== payload),
          // totalNum: resourceCollectPage.totalNum - 1,
          resource_List: finalList,
          resource_ListState: state,
          resource_ListMore: more,
          totalNum: finalTotalNum,
        },
      });
    },
  },

  reducers: {
    change(state: ResourceCollectPageModelState, { payload }: ChangeAction): ResourceCollectPageModelState {
      return {
        ...state,
        ...payload,
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }: SubscriptionAPI) {
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
