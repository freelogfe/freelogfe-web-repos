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
  // pageSize: number;
  // totalNum: number;
  // dataSource: {
  //   id: string;
  //   cover: string;
  //   title: string;
  //   version: string;
  //   policy: string[],
  //   type: string[];
  //   status: 0 | 1;
  //   authProblem: boolean;
  // }[];

  resource_List: {
    id: string;
    cover: string;
    title: string;
    version: string;
    policy: string[],
    type: string[];
    status: 0 | 1;
    authProblem: boolean;
  }[];
  resource_ListState: 'loading' | 'noData' | 'noSearchResult' | 'loaded';
  resource_ListMore: 'loading' | 'andMore' | 'noMore';
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
  // totalNum: -1,

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
      } else {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            resource_ListState: 'loading',
            // resource_ListMore: 'loading',
          },
        });
      }

      const resourceTypes: Array<string | number> = resourceListPage.resourceTypeCodes.labels.filter((rt) => {
        return rt !== '全部';
      });

      const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
        // skip: dataSource.length,
        skip: resource_List.length,
        limit: FUtil.Predefined.pageSize,
        keywords: resourceListPage.inputText,
        resourceType: resourceTypes.length === 0 ? undefined : String(resourceTypes[resourceTypes.length - 1]),
        // status: Number(resourceListPage.resourceStatus) as 0 | 1 | 2,
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
            title: i.resourceName,
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
        has_FilterCriteria: resourceListPage.inputText !== '' || resourceTypes.length !== 0 || resourceListPage.resourceStatus !== '#',
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // dataSource: [
          //   ...dataSource,
          //   ...(data.dataList as any[]).map<ResourceListPageModelState['dataSource'][number]>((i: any) => {
          //     const res = auths.find((dd: any) => {
          //       return dd.resourceId === i.resourceId;
          //     });
          //     return {
          //       id: i.resourceId,
          //       cover: i.coverImages.length > 0 ? i.coverImages[0] : '',
          //       title: i.resourceName,
          //       version: i.latestVersion,
          //       policy: i.policies
          //         .filter((l: any) => {
          //           return l.status === 1;
          //         })
          //         .map((l: any) => l.policyName),
          //       type: i.resourceType,
          //       status: i.status,
          //       authProblem: !!res && !res.isAuth,
          //     };
          //   }),
          // ],
          // totalNum: data.totalItem,
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
