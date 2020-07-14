import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';

export interface ResourceCreatorPageModelState {
  name: string;
  resourceType: string;
  introduction: string;
  cover: string;
  labels: string[];
}

export interface OnChangeNameAction extends AnyAction {
  type: 'resourceCreatorPage/onChangeName';
  payload: string;
}

export interface OnChangeResourceTypeAction extends AnyAction {
  type: 'resourceCreatorPage/onChangeResourceType';
  payload: string;
}

export interface OnChangeIntroductionAction extends AnyAction {
  type: 'resourceCreatorPage/onChangeIntroduction';
  payload: string;
}

export interface OnChangeCoverAction extends AnyAction {
  type: 'resourceCreatorPage/onChangeCover';
  payload: string;
}

export interface OnChangeLabelsAction extends AnyAction {
  type: 'resourceCreatorPage/onChangeLabels';
  payload: string[];
}

export interface ResourceCreatorPageModelType {
  namespace: 'resourceCreatorPage';
  state: ResourceCreatorPageModelState;
  effects: {
    fetchDataSource: Effect;
  };
  reducers: {
    onChangeName: DvaReducer<ResourceCreatorPageModelState, OnChangeNameAction>;
    onChangeResourceType: DvaReducer<ResourceCreatorPageModelState, OnChangeResourceTypeAction>;
    onChangeIntroduction: DvaReducer<ResourceCreatorPageModelState, OnChangeIntroductionAction>;
    onChangeCover: DvaReducer<ResourceCreatorPageModelState, OnChangeCoverAction>;
    onChangeLabels: DvaReducer<ResourceCreatorPageModelState, OnChangeLabelsAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceCreatorPageModelType = {

  namespace: 'resourceCreatorPage',

  state: {
    name: '',
    resourceType: '',
    introduction: '',
    cover: '',
    labels: [],
  },

  effects: {
    * fetchDataSource(_: AnyAction, {call, put}: EffectsCommandMap) {
      yield put({type: 'save'});
    },
  },

  reducers: {
    onChangeName(state: ResourceCreatorPageModelState, action): ResourceCreatorPageModelState {
      return {...state, name: action.payload};
    },
    onChangeResourceType(state: ResourceCreatorPageModelState, action): ResourceCreatorPageModelState {
      return {...state, resourceType: action.payload};
    },
    onChangeIntroduction(state: ResourceCreatorPageModelState, action): ResourceCreatorPageModelState {
      return {...state, introduction: action.payload};
    },
    onChangeCover(state: ResourceCreatorPageModelState, action): ResourceCreatorPageModelState {
      return {...state, cover: action.payload};
    },
    onChangeLabels(state: ResourceCreatorPageModelState, action): ResourceCreatorPageModelState {
      return {...state, labels: action.payload};
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },

};

export default Model;
