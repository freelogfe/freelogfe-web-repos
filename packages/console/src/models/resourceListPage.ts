import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {list} from "@/services/resources";
import {router} from 'dva';

export interface ResourceListPageModelState {
  resourceType: string;
  resourceStatus: string;
  inputText: string;
  dataSource: {
    id: string;
    cover: string;
    title: string;
    version: string;
    // policy: i.policies,
    policy: string[],
    type: string;
    status: 0 | 1;
  }[];
  pageCurrent: number;
  pageSize: number;
  totalNum: number;
}

export interface OnChangeResourceTypeAction extends AnyAction {
  type: 'resourceListPage/onChangeResourceType',
  payload: string;
}

export interface OnChangeResourceStatusAction extends AnyAction {
  type: 'resourceListPage/onChangeResourceStatus',
  payload: string;
}

export interface OnChangeInputTextAction extends AnyAction {
  type: 'resourceListPage/onChangeInputText',
  payload: string;
}

export interface ChangeDataSourceAction extends AnyAction {
  type: 'resourceListPage/changeDataSource' | 'changeDataSource',
  payload: ResourceListPageModelState['dataSource'];
  // restart?: boolean;
}

export interface OnChangePageCurrentAction extends AnyAction {
  type: 'resourceListPage/onChangePageCurrent',
  payload: number;
}

export interface OnChangePageSizeAction extends AnyAction {
  type: 'resourceListPage/onChangePageSize',
  payload: number;
}

export interface OnChangeTotalNumAction extends AnyAction {
  type: 'resourceListPage/onChangeTotalNum',
  payload: number;
}

export interface FetchDataSourceAction extends AnyAction {
  type: 'resourceListPage/fetchDataSource',
}

export interface ResourceListPageModelType {
  namespace: 'resourceListPage';
  state: ResourceListPageModelState;
  effects: {
    fetchDataSource: Effect;
  };
  reducers: {
    onChangeResourceType: DvaReducer<ResourceListPageModelState, OnChangeResourceTypeAction>;
    onChangeResourceStatus: DvaReducer<ResourceListPageModelState, OnChangeResourceStatusAction>;
    onChangeInputText: DvaReducer<ResourceListPageModelState, OnChangeInputTextAction>;
    changeDataSource: DvaReducer<ResourceListPageModelState, ChangeDataSourceAction>;
    onChangePageCurrent: DvaReducer<ResourceListPageModelState, OnChangePageCurrentAction>;
    onChangePageSize: DvaReducer<ResourceListPageModelState, OnChangePageSizeAction>;
    onChangeTotalNum: DvaReducer<ResourceListPageModelState, OnChangeTotalNumAction>;
  };
  subscriptions: {
    __init__: Subscription;
    setup: Subscription;
  };
}

const Model: ResourceListPageModelType = {

  namespace: 'resourceListPage',

  state: {
    resourceType: '-1',
    resourceStatus: '-1',
    inputText: '',
    dataSource: [],
    pageCurrent: 1,
    pageSize: 20,
    totalNum: 20,
  },

  effects: {
    * fetchDataSource(_: FetchDataSourceAction, {call, put}: EffectsCommandMap) {
      // yield put({type: 'save'});
      const params = {};
      const {data} = yield call(list, params);
      // console.log(data, 'data');

      const resource: ResourceListPageModelState['dataSource'] = data.dataList.map((i: any) => ({
        id: i.resourceId,
        cover: i.coverImages.length > 0 ? i.coverImages[0] : '',
        title: i.resourceName,
        version: i.latestVersion,
        // policy: i.policies,
        policy: [],
        type: i.resourceType,
        status: i.status,
      }));
      yield put<ChangeDataSourceAction>({
        type: 'changeDataSource',
        payload: resource
      });
    },
  },

  reducers: {
    onChangeResourceType(state: ResourceListPageModelState, action: OnChangeResourceTypeAction): ResourceListPageModelState {
      return {...state, resourceType: action.payload};
    },
    onChangeResourceStatus(state: ResourceListPageModelState, action: OnChangeResourceStatusAction): ResourceListPageModelState {
      return {...state, resourceStatus: action.payload};
    },
    onChangeInputText(state: ResourceListPageModelState, action: OnChangeInputTextAction): ResourceListPageModelState {
      return {...state, inputText: action.payload};
    },
    changeDataSource(state: ResourceListPageModelState, {payload}: ChangeDataSourceAction): ResourceListPageModelState {
      // if (restart) {
      return {
        ...state,
        dataSource: payload
      };
      // }
      // return {
      //   ...state,
      //   dataSource: [
      //     ...state.dataSource,
      //     ...payload,
      //   ],
      // };
    },
    onChangePageCurrent(state: ResourceListPageModelState, action: OnChangePageCurrentAction): ResourceListPageModelState {
      return {...state, pageCurrent: action.payload};
    },
    onChangePageSize(state: ResourceListPageModelState, action: OnChangePageSizeAction): ResourceListPageModelState {
      return {...state, pageSize: action.payload};
    },
    onChangeTotalNum(state: ResourceListPageModelState, action: OnChangeTotalNumAction): ResourceListPageModelState {
      return {...state, totalNum: action.payload};
    },
  },

  subscriptions: {
    __init__({dispatch, history}: SubscriptionAPI) {
      // console.log(history, 'HHHHHHH');
      // history.listen((listener) => {
        // console.log(listener, 'LLLLLLL');
        // console.log(router, 'routerrouter');
      // });

      // if (history) {
      //
      // }
    },
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },

};

export default Model;
