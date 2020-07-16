import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {ResourcePageModelState} from "@/models/resourcePage";

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
    onChangeResourceType: DvaReducer<ResourcePageModelState, OnChangeResourceTypeAction>;
    onChangeResourceStatus: DvaReducer<ResourcePageModelState, OnChangeResourceStatusAction>;
    onChangeInputText: DvaReducer<ResourcePageModelState, OnChangeInputTextAction>;
    changeDataSource: DvaReducer<ResourcePageModelState, ChangeDataSourceAction>;
    onChangePageCurrent: DvaReducer<ResourcePageModelState, OnChangePageCurrentAction>;
    onChangePageSize: DvaReducer<ResourcePageModelState, OnChangePageSizeAction>;
    onChangeTotalNum: DvaReducer<ResourcePageModelState, OnChangeTotalNumAction>;
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
    onChangeResourceType(state: ResourcePageModelState, action: OnChangeResourceTypeAction): ResourcePageModelState {
      return {...state, resourceType: action.payload};
    },
    onChangeResourceStatus(state: ResourcePageModelState, action: OnChangeResourceStatusAction): ResourcePageModelState {
      return {...state, resourceStatus: action.payload};
    },
    onChangeInputText(state: ResourcePageModelState, action: OnChangeInputTextAction): ResourcePageModelState {
      return {...state, inputText: action.payload};
    },
    changeDataSource(state: ResourcePageModelState, {payload, restart = false}: ChangeDataSourceAction): ResourcePageModelState {
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
    onChangePageCurrent(state: ResourcePageModelState, action: OnChangePageCurrentAction): ResourcePageModelState {
      return {...state, pageCurrent: action.payload};
    },
    onChangePageSize(state: ResourcePageModelState, action: OnChangePageSizeAction): ResourcePageModelState {
      return {...state, pageSize: action.payload};
    },
    onChangeTotalNum(state: ResourcePageModelState, action: OnChangeTotalNumAction): ResourcePageModelState {
      return {...state, totalNum: action.payload};
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },

};

export default Model;
