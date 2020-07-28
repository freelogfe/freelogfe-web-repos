import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
// import {ResourcePageModelState} from "@/models/resourceListPage";

export interface ResourceCollectPageModelState {
  resourceType: string;
  resourceStatus: string;
  inputText: string;
  dataSource: any[];
  pageCurrent: number;
  pageSize: number;
  totalNum: number;
}

export interface OnChangeResourceTypeAction extends AnyAction {
  type: 'resourceCollectPage/onChangeResourceType',
  payload: string;
}

export interface OnChangeResourceStatusAction extends AnyAction {
  type: 'resourceCollectPage/onChangeResourceStatus',
  payload: string;
}

export interface OnChangeInputTextAction extends AnyAction {
  type: 'resourceCollectPage/onChangeInputText',
  payload: string;
}

export interface ChangeDataSourceAction extends AnyAction {
  type: 'resourceCollectPage/changeDataSource',
  payload: any[];
  restart?: boolean;
}

export interface OnChangePageCurrentAction extends AnyAction {
  type: 'resourceCollectPage/onChangePageCurrent',
  payload: number;
}

export interface OnChangePageSizeAction extends AnyAction {
  type: 'resourceCollectPage/onChangePageSize',
  payload: number;
}

export interface OnChangeTotalNumAction extends AnyAction {
  type: 'resourceCollectPage/onChangeTotalNum',
  payload: number;
}

export interface ResourceCollectModelType {
  namespace: 'resourceCollectPage';
  state: ResourceCollectPageModelState;
  effects: {
    fetchDataSource: Effect;
  };
  reducers: {
    onChangeResourceType: DvaReducer<ResourceCollectPageModelState, OnChangeResourceTypeAction>;
    onChangeResourceStatus: DvaReducer<ResourceCollectPageModelState, OnChangeResourceStatusAction>;
    onChangeInputText: DvaReducer<ResourceCollectPageModelState, OnChangeInputTextAction>;
    changeDataSource: DvaReducer<ResourceCollectPageModelState, ChangeDataSourceAction>;
    onChangePageCurrent: DvaReducer<ResourceCollectPageModelState, OnChangePageCurrentAction>;
    onChangePageSize: DvaReducer<ResourceCollectPageModelState, OnChangePageSizeAction>;
    onChangeTotalNum: DvaReducer<ResourceCollectPageModelState, OnChangeTotalNumAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceCollectModelType = {

  namespace: 'resourceCollectPage',

  state: {
    resourceType: '-1',
    resourceStatus: '-1',
    inputText: '',
    dataSource: Array(11).fill(null).map((i, j) => ({
      id: j,
      cover: '',
      title: '这里是发行名称1',
      version: '1.0.10',
      policy: ['免费1', '免费2', '免费3'],
      type: 'image',
    })),
    pageCurrent: 1,
    pageSize: 20,
    totalNum: 11,
  },

  effects: {
    * fetchDataSource(_: AnyAction, {call, put}: EffectsCommandMap) {
      yield put({type: 'save'});
    },
  },

  reducers: {
    onChangeResourceType(state: ResourceCollectPageModelState, action: OnChangeResourceTypeAction): ResourceCollectPageModelState {
      return {...state, resourceType: action.payload};
    },
    onChangeResourceStatus(state: ResourceCollectPageModelState, action: OnChangeResourceStatusAction): ResourceCollectPageModelState {
      return {...state, resourceStatus: action.payload};
    },
    onChangeInputText(state: ResourceCollectPageModelState, action: OnChangeInputTextAction): ResourceCollectPageModelState {
      return {...state, inputText: action.payload};
    },
    changeDataSource(state: ResourceCollectPageModelState, {payload, restart = false}: ChangeDataSourceAction): ResourceCollectPageModelState {
      if (restart) {
        return {
          ...state,
          dataSource: payload
        };
      }
      return {
        ...state,
        dataSource: [
          ...state.dataSource,
          payload,
        ],
      };
    },
    onChangePageCurrent(state: ResourceCollectPageModelState, action: OnChangePageCurrentAction): ResourceCollectPageModelState {
      return {...state, pageCurrent: action.payload};
    },
    onChangePageSize(state: ResourceCollectPageModelState, action: OnChangePageSizeAction): ResourceCollectPageModelState {
      return {...state, pageSize: action.payload};
    },
    onChangeTotalNum(state: ResourceCollectPageModelState, action: OnChangeTotalNumAction): ResourceCollectPageModelState {
      return {...state, totalNum: action.payload};
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },

};

export default Model;
