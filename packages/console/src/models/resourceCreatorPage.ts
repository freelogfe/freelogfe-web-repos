import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {ConnectState} from "@/models/connect";
import {router} from "umi";
import {FApiServer} from "@/services";
import {FUtil} from '@freelog/tools-lib';

export interface ResourceCreatorPageModelState {
  name: string;
  nameVerify: 0 | 1 | 2;
  nameErrorText: string;

  resourceType: string;
  resourceTypeVerify: 0 | 2;
  resourceTypeErrorText: string;

  introduction: string;
  introductionErrorText: string;

  cover: string;
  labels: string[];

  promptLeavePath: string,
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceCreatorPage/change',
  payload: Partial<ResourceCreatorPageModelState>;
}

export interface OnCreateAction extends AnyAction {
  type: 'resourceCreatorPage/create';
}

export interface OnChangeNameAction extends AnyAction {
  type: 'resourceCreatorPage/onChangeName';
  payload: string;
}

export interface OnChangeResourceTypeAction extends AnyAction {
  type: 'resourceCreatorPage/onChangeResourceType';
  payload: string;
}

export interface ClearDataAction extends AnyAction {
  type: 'resourceCreatorPage/clearData';
}

export interface ResourceCreatorPageModelType {
  namespace: 'resourceCreatorPage';
  state: ResourceCreatorPageModelState;
  effects: {
    clearData: (action: ClearDataAction, effects: EffectsCommandMap) => void;
    create: (action: OnCreateAction, effects: EffectsCommandMap) => void;
    onChangeName: (action: OnChangeNameAction, effects: EffectsCommandMap) => void;
    onChangeResourceType: (action: OnChangeResourceTypeAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceCreatorPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const initStates: ResourceCreatorPageModelState = {
  name: '',
  nameVerify: 0,
  nameErrorText: '',

  resourceType: '',
  resourceTypeVerify: 0,
  resourceTypeErrorText: '',

  introduction: '',
  introductionErrorText: '',

  cover: '',

  labels: [],

  promptLeavePath: '',
};

const Model: ResourceCreatorPageModelType = {
  namespace: 'resourceCreatorPage',
  state: initStates,
  effects: {
    * clearData({}: ClearDataAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * create({}: OnCreateAction, {call, put, select}: EffectsCommandMap) {
      const {resourceCreatorPage, user} = yield select(({resourceCreatorPage, user}: ConnectState) => ({
        resourceCreatorPage,
        user,
      }));
      if (resourceCreatorPage.nameErrorText || resourceCreatorPage.resourceTypeErrorText) {
        return;
      }
      const params: Parameters<typeof FApiServer.Resource.create>[0] = {
        name: resourceCreatorPage.name,
        resourceType: resourceCreatorPage.resourceType,
        policies: [],
        coverImages: resourceCreatorPage.cover ? [resourceCreatorPage.cover] : [],
        intro: resourceCreatorPage.introduction,
        tags: resourceCreatorPage.labels,
      };
      const {data} = yield call(FApiServer.Resource.create, params);
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

      router.replace(FUtil.LinkTo.resourceCreateSuccess({
        resourceID: data.resourceId,
      }));
    },
    * onChangeName({payload}: OnChangeNameAction, {put, call, select}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nameVerify: 1,
        },
      });

      let nameErrorText: string = '';

      if (!payload) {
        nameErrorText = '请输入资源名称';
      } else if (payload.length > 60) {
        nameErrorText = '不多于60个字符';
      } else if (!FUtil.Regexp.RESOURCE_NAME.test(payload)) {
        nameErrorText = `不符合正则 /^(?!.*(\\\\|\\/|:|\\*|\\?|"|<|>|\\||\\s|@|\\$|#)).{1,60}$/`;
      } else {
        const {user} = yield select(({user}: ConnectState) => ({
          user,
        }));
        const params1: Parameters<typeof FApiServer.Resource.info>[0] = {
          resourceIdOrName: encodeURIComponent(`${user.info.username}/${payload}`),
        };
        const {data: data1} = yield call(FApiServer.Resource.info, params1);
        if (data1) {
          nameErrorText = '资源名已存在';
        }
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          name: payload,
          nameErrorText,
          nameVerify: 2,
        },
      });
    },
    * onChangeResourceType({payload}: OnChangeResourceTypeAction, {put}: EffectsCommandMap) {
      let resourceTypeErrorText = '';
      if (!payload) {
        resourceTypeErrorText = '请输入资源类型';
      } else if (payload.length < 3) {
        resourceTypeErrorText = '不少于3个字符';
      } else if (payload.length > 20) {
        resourceTypeErrorText = '不多于20个字符';
      } else if (!FUtil.Regexp.RESOURCE_TYPE.test(payload)) {
        resourceTypeErrorText = `不符合正则 /^(?!_)[a-z0-9_]{3,20}(?<!_)$/`;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceType: payload,
          resourceTypeVerify: 2,
          resourceTypeErrorText,
        },
      });
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

// function verifyDate({name, resourceType}: any) {
//   let nameErrorText = '';
//   if (!name) {
//     nameErrorText = '请输入资源名称';
//   } else if (name.length > 60) {
//     nameErrorText = '不多于60个字符';
//   } else if (!RESOURCE_NAME.test(name)) {
//     nameErrorText = `不符合正则 /^(?!.*(\\\\|\\/|:|\\*|\\?|"|<|>|\\||\\s|@|\\$|#)).{1,60}$/`;
//   }
//
//   let resourceTypeErrorText = '';
//   if (!resourceType) {
//     resourceTypeErrorText = '请输入资源类型';
//   } else if (resourceType.length < 3) {
//     resourceTypeErrorText = '不少于3个字符';
//   } else if (!RESOURCE_TYPE.test(resourceType)) {
//     resourceTypeErrorText = `不符合正则 /^(?!_)[a-z0-9_]{3,20}(?<!_)$/`;
//   }
//   return {nameErrorText, resourceTypeErrorText};
// }
