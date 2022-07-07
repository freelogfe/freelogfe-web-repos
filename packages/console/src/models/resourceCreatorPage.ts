import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import { ConnectState } from '@/models/connect';
import { router } from 'umi';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';

export interface ResourceCreatorPageModelState {
  userName: string;

  name: string;
  nameVerify: 0 | 1 | 2;
  nameErrorText: string;

  // resourceType: string;
  // resourceTypeVerify: 0 | 2;
  // resourceTypeErrorText: string;
  // category: {
  //   first: any
  //   second: number | string;
  // };

  resource_Type: {
    value: string;
    valueError: string;
    // options: string[];
  }[];

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

export interface OnMount_Page_Action extends AnyAction {
  type: 'resourceCreatorPage/onMount_Page';
}

export interface OnUnmount_Page_Action extends AnyAction {
  type: 'resourceCreatorPage/onUnmount_Page';
}

// export interface OnCreateAction extends AnyAction {
//   type: 'resourceCreatorPage/create';
// }

export interface OnClick_CreateBtn_Action extends AnyAction {
  type: 'resourceCreatorPage/onClick_CreateBtn';
}

export interface OnChangeNameAction extends AnyAction {
  type: 'resourceCreatorPage/onChangeName';
  payload: string;
}

// export interface OnChangeResourceTypeAction extends AnyAction {
//   type: 'resourceCreatorPage/onChangeResourceType';
//   payload: string;
// }

export interface OnChange_Resource_Type_Action extends AnyAction {
  type: 'resourceCreatorPage/onChange_Resource_Type';
  // payload: {
  //   index: number;
  //   value: string;
  // };
  payload: {
    value: ResourceCreatorPageModelState['resource_Type'],
  };
}

export interface ClearDataAction extends AnyAction {
  type: 'resourceCreatorPage/clearData';
}

export interface ResourceCreatorPageModelType {
  namespace: 'resourceCreatorPage';
  state: ResourceCreatorPageModelState;
  effects: {
    onMount_Page: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmount_Page: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;
    clearData: (action: ClearDataAction, effects: EffectsCommandMap) => void;
    // create: (action: OnCreateAction, effects: EffectsCommandMap) => void;
    onClick_CreateBtn: (action: OnClick_CreateBtn_Action, effects: EffectsCommandMap) => void;

    onChangeName: (action: OnChangeNameAction, effects: EffectsCommandMap) => void;
    // onChangeResourceType: (action: OnChangeResourceTypeAction, effects: EffectsCommandMap) => void;
    onChange_Resource_Type: (action: OnChange_Resource_Type_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceCreatorPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

export const initStates: ResourceCreatorPageModelState = {
  userName: '',

  name: '',
  nameVerify: 0,
  nameErrorText: '',

  // resourceType: '',
  // resourceTypeVerify: 0,
  // resourceTypeErrorText: '',
  // category: {
  //   first: -1,
  //   second: '',
  // },
  resource_Type: [
    {
      value: '',
      valueError: '',
    },
  ],

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
    * onMount_Page({}: OnMount_Page_Action, { call, put }: EffectsCommandMap) {
      const { data } = yield call(FServiceAPI.User.currentUserInfo);
      // console.log(data, 'DDDDDDDD');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          userName: data.username,
        },
      });
    },
    * onUnmount_Page({}: OnUnmount_Page_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * clearData({}: ClearDataAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    // * create({}: OnCreateAction, { call, put, select }: EffectsCommandMap) {
    //   const { resourceCreatorPage } = yield select(({ resourceCreatorPage }: ConnectState) => ({
    //     resourceCreatorPage,
    //   }));
    //   if (resourceCreatorPage.nameErrorText || !!resourceCreatorPage.resource_Type[resourceCreatorPage.resource_Type.length - 1].valueError) {
    //     return;
    //   }
    //   const params: Parameters<typeof FServiceAPI.Resource.create>[0] = {
    //     name: resourceCreatorPage.name,
    //     resourceType: resourceCreatorPage.resourceType,
    //     policies: [],
    //     coverImages: resourceCreatorPage.cover ? [resourceCreatorPage.cover] : [],
    //     intro: resourceCreatorPage.introduction,
    //     tags: resourceCreatorPage.labels,
    //   };
    //   const { data } = yield call(FServiceAPI.Resource.create, params);
    //   // yield put<ChangeAction>({
    //   //   type: 'change',
    //   //   payload: initStates,
    //   //   // payload: {
    //   //   //   name: '',
    //   //   //   nameErrorText: '',
    //   //   //   // resourceType: '',
    //   //   //   // resourceTypeErrorText: '',
    //   //   //   introduction: '',
    //   //   //   cover: '',
    //   //   //   labels: [],
    //   //   // },
    //   // });
    //
    //   router.replace(FUtil.LinkTo.resourceCreateSuccess({
    //     resourceID: data.resourceId,
    //   }));
    // },
    * onClick_CreateBtn({}: OnClick_CreateBtn_Action, { select, call, put }: EffectsCommandMap) {
      const { resourceCreatorPage } = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));
      // if (resourceCreatorPage.nameErrorText || !!resourceCreatorPage.resource_Type[resourceCreatorPage.resource_Type.length - 1].valueError) {
      //   return;
      // }
      const params: Parameters<typeof FServiceAPI.Resource.create>[0] = {
        name: resourceCreatorPage.name,
        resourceType: resourceCreatorPage.resource_Type.map((rt: any) => {
          return rt.value;
        }),
        policies: [],
        coverImages: resourceCreatorPage.cover ? [resourceCreatorPage.cover] : [],
        intro: resourceCreatorPage.introduction,
        tags: resourceCreatorPage.labels,
      };
      const { data } = yield call(FServiceAPI.Resource.create, params);

      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });

      router.replace(FUtil.LinkTo.resourceCreateSuccess({
        resourceID: data.resourceId,
      }));
    },
    * onChangeName({ payload }: OnChangeNameAction, { put, call, select }: EffectsCommandMap) {
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
        const { user } = yield select(({ user }: ConnectState) => ({
          user,
        }));
        const params1: Parameters<typeof FServiceAPI.Resource.info>[0] = {
          resourceIdOrName: encodeURIComponent(`${user.info.username}/${payload}`),
        };
        const { data: data1 } = yield call(FServiceAPI.Resource.info, params1);
        if (data1) {
          nameErrorText = '资源名已存在';
        }
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // name: payload,
          nameErrorText,
          nameVerify: 2,
        },
      });
    },
    // * onChangeResourceType({ payload }: OnChangeResourceTypeAction, { put }: EffectsCommandMap) {
    //   let resourceTypeErrorText = '';
    //   if (!payload) {
    //     resourceTypeErrorText = '请输入资源类型';
    //   } else if (payload.length < 3) {
    //     resourceTypeErrorText = '不少于3个字符';
    //   } else if (payload.length > 20) {
    //     resourceTypeErrorText = '不多于20个字符';
    //   } else if (!FUtil.Regexp.RESOURCE_TYPE.test(payload)) {
    //     resourceTypeErrorText = `不符合正则 /^(?!_)[a-z0-9_]{3,20}(?<!_)$/`;
    //   }
    //
    //   yield put<ChangeAction>({
    //     type: 'change',
    //     payload: {
    //       // resourceType: payload,
    //       // resourceTypeVerify: 2,
    //       // resourceTypeErrorText,
    //     },
    //   });
    // },
    * onChange_Resource_Type({ payload }: OnChange_Resource_Type_Action, { select, put }: EffectsCommandMap) {
      // const { resourceCreatorPage } = yield select(({ resourceCreatorPage }: ConnectState) => ({
      //   resourceCreatorPage,
      // }));
      //
      // let valueError: string = '';
      // if (payload.value === '') {
      //   valueError = '请输入资源类型';
      // }
      //   // else if (payload.value.length < 3) {
      //   //   valueError = '不少于3个字符';
      // // }
      // else if (payload.value.length > 20) {
      //   valueError = '不多于20个字符';
      // }
      // // else if (!FUtil.Regexp.RESOURCE_TYPE.test(payload.value)) {
      // //   valueError = `不符合正则 /^(?!_)[a-z0-9_]{3,20}(?<!_)$/`;
      // // }
      //
      // let resource_Type: ResourceCreatorPageModelState['resource_Type'] = resourceCreatorPage.resource_Type.slice(0, payload.index + 1);
      // resource_Type = resource_Type.map((i, j) => {
      //   // [payload.index]['value'] = payload.value;
      //   if (j !== payload.index) {
      //     return i;
      //   }
      //   return {
      //     ...i,
      //     value: payload.value,
      //     valueError,
      //   };
      // });
      //
      // if (!!resourceCreatorPage.resource_TypeData[payload.index + 1]) {
      //   const next: ResourceCreatorPageModelState['resource_TypeData'][0] = resourceCreatorPage.resource_TypeData[payload.index + 1].filter((i: any) => {
      //     return i.parentValue === payload.value;
      //   });
      //   if (next.length > 0) {
      //     const resource_Type1: ResourceCreatorPageModelState['resource_Type'][0] = {
      //       value: '',
      //       valueError: '',
      //       options: next.map((n) => {
      //         return n.value;
      //       }),
      //     };
      //     resource_Type = [
      //       ...resource_Type,
      //       resource_Type1,
      //     ];
      //   }
      // }
      // console.log(resource_Type, 'resource_Type30w29iosdlf;kjsdlk');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resource_Type: payload.value,
        },
      });
    },
  },

  reducers: {
    change(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }: SubscriptionAPI) {
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
