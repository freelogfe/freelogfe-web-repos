import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {create} from '@/services/resources';
import {ConnectState} from "@/models/connect";
import {router} from "umi";

export interface ResourceCreatorPageModelState {
  name: string;
  resourceType: string;
  introduction: string;
  cover: string;
  labels: string[];
}

export interface OnCreateAction extends AnyAction {
  type: 'resourceCreatorPage/create';
  // payload: string[];
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceCreatorPage/change',
  payload: Partial<ResourceCreatorPageModelState>;
}

export interface ResourceCreatorPageModelType {
  namespace: 'resourceCreatorPage';
  state: ResourceCreatorPageModelState;
  effects: {
    create: (action: OnCreateAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceCreatorPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceCreatorPageModelType = {

  namespace: 'resourceCreatorPage',

  state: {
    name: '',
    // /^(?!_)[a-z0-9_]{3,20}(?<!_)$/
    resourceType: '',
    introduction: '',
    cover: '',
    labels: [],
  },

  effects: {
    * create(_: OnCreateAction, {call, put, select}: EffectsCommandMap) {
      const params = yield select(({resourceCreatorPage}: ConnectState) => ({
        name: resourceCreatorPage.name,
        resourceType: resourceCreatorPage.resourceType,
        policies: [],
        coverImages: resourceCreatorPage.cover ? [resourceCreatorPage.cover] : [],
        intro: resourceCreatorPage.introduction,
        tags: resourceCreatorPage.labels,
      }));
      const {data} = yield call(create, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          name: '',
          resourceType: '',
          introduction: '',
          cover: '',
          labels: [],
        },
      });
      router.replace(`/resource/${data.resourceId}/success`);
    },
  },

  reducers: {
    change(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },

};

export default Model;
