import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {create, CreateParamsType, info, InfoParamsType} from '@/services/resources';
import {ConnectState} from "@/models/connect";
import {router} from "umi";
import {RESOURCE_NAME, RESOURCE_TYPE} from "@/utils/regexp";

export interface ResourceCreatorPageModelState {
  name: string;
  nameErrorText: string;
  resourceType: string;
  resourceTypeErrorText: string;
  introduction: string;
  cover: string;
  labels: string[];
}

export interface OnCreateAction extends AnyAction {
  type: 'resourceCreatorPage/create';
}

// export interface OnVerifyAction extends AnyAction {
//   type: 'verify';
// }

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceCreatorPage/change',
  payload: Partial<ResourceCreatorPageModelState>;
}

export interface ResourceCreatorPageModelType {
  namespace: 'resourceCreatorPage';
  state: ResourceCreatorPageModelState;
  effects: {
    create: (action: OnCreateAction, effects: EffectsCommandMap) => void;
    // verify: (action: OnVerifyAction, effects: EffectsCommandMap) => void;
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
    nameErrorText: '',
    resourceType: '',
    resourceTypeErrorText: '',
    introduction: '',
    cover: '',
    labels: [],
  },

  effects: {
    * create({}: OnCreateAction, {call, put, select}: EffectsCommandMap) {
      // console.log('OnCreateAction2839u42o3');
      const {resourceCreatorPage, user} = yield select(({resourceCreatorPage, user}: ConnectState) => ({
        resourceCreatorPage,
        user,
      }));
      let {nameErrorText, resourceTypeErrorText} = verifyDate({
        name: resourceCreatorPage.name,
        resourceType: resourceCreatorPage.resourceType,
      });
      if (!nameErrorText) {
        const params1: InfoParamsType = {
          resourceIdOrName: encodeURIComponent(`${user.info.username}/${resourceCreatorPage.name}`),
        };
        const {data: data1} = yield call(info, params1);
        if (data1) {
          nameErrorText = '资源名已存在';
        }
      }
      if (nameErrorText || resourceTypeErrorText) {
        return yield put<ChangeAction>({
          type: 'change',
          payload: {
            nameErrorText,
            resourceTypeErrorText,
          },
        });
      }
      const params: CreateParamsType = {
        name: resourceCreatorPage.name,
        resourceType: resourceCreatorPage.resourceType,
        policies: [],
        coverImages: resourceCreatorPage.cover ? [resourceCreatorPage.cover] : [],
        intro: resourceCreatorPage.introduction,
        tags: resourceCreatorPage.labels,
      };
      const {data} = yield call(create, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          name: '',
          nameErrorText: '',
          resourceType: '',
          resourceTypeErrorText: '',
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

function verifyDate({name, resourceType}: any) {
  let nameErrorText = '';
  if (!name) {
    nameErrorText = '请输入资源名称';
  } else if (name.length > 60) {
    nameErrorText = '不多于60个字符';
  } else if (!RESOURCE_NAME.test(name)) {
    nameErrorText = `不符合正则 /^(?!.*(\\\\|\\/|:|\\*|\\?|"|<|>|\\||\\s|@|\\$|#)).{1,60}$/`;
  }

  let resourceTypeErrorText = '';
  if (!resourceType) {
    resourceTypeErrorText = '请输入资源类型';
  } else if (resourceType.length < 3) {
    resourceTypeErrorText = '不少于3个字符';
  } else if (!RESOURCE_TYPE.test(resourceType)) {
    resourceTypeErrorText = `不符合正则 /^(?!_)[a-z0-9_]{3,20}(?<!_)$/`;
  }
  return {nameErrorText, resourceTypeErrorText};
}
