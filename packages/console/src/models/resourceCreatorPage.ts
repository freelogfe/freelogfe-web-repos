import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import { ConnectState, UserModelState } from '@/models/connect';
// import { history } from 'umi';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';
import userPermission from '@/permissions/UserPermission';

export interface ResourceCreatorPageModelState {
  userInfo: {
    userID: number;
    userName: string;
  } | null;

  step: 1 | 2 | 3 | 4;

  step1_resourceType: {
    value: string;
    labels: string[];
    customInput?: string;
  } | null;
  step1_resourceName: string;


  step2_resourceInfo: {
    resourceID: string;
    resourceName: string;
    resourceTypeCode: string;
    resourceType: string[];
  } | null;
  step2_fileInfo: {
    name: string;
    sha1: string;
    from: string;
  } | null;
  step2_rawProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];
  step2_rawPropertiesState: 'parsing' | 'success' | 'fail';
  step2_additionalProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];
  step2_customProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];
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

export interface OnChange_step1_resourceType_Action extends AnyAction {
  type: 'resourceCreatorPage/onChange_step1_resourceType';
  payload: {
    value: ResourceCreatorPageModelState['step1_resourceType'];
  };
}

export interface OnChange_step1_resourceName_Action extends AnyAction {
  type: 'resourceCreatorPage/onChange_step1_resourceName';
  payload: {
    value: ResourceCreatorPageModelState['step1_resourceName'];
  };
}

export interface OnClick_step1_createBtn_Action extends AnyAction {
  type: 'resourceCreatorPage/onClick_step1_createBtn';
}

export interface OnSucceed_step2_localUpload_Action extends AnyAction {
  type: 'resourceCreatorPage/onSucceed_step2_localUpload';
  payload: {
    value: NonNullable<ResourceCreatorPageModelState['step2_fileInfo']>;
  };
}

export interface ResourceCreatorPageModelType {
  namespace: 'resourceCreatorPage';
  state: ResourceCreatorPageModelState;
  effects: {
    onMount_Page: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmount_Page: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;
    onChange_step1_resourceType: (action: OnChange_step1_resourceType_Action, effects: EffectsCommandMap) => void;
    onChange_step1_resourceName: (action: OnChange_step1_resourceName_Action, effects: EffectsCommandMap) => void;
    onClick_step1_createBtn: (action: OnClick_step1_createBtn_Action, effects: EffectsCommandMap) => void;
    onSucceed_step2_localUpload: (action: OnSucceed_step2_localUpload_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceCreatorPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

export const initStates: ResourceCreatorPageModelState = {
  userInfo: null,

  step: 1,

  step1_resourceType: null,
  step1_resourceName: 'newResource',

  step2_resourceInfo: null,
  step2_fileInfo: null,
  step2_rawProperties: [],
  step2_rawPropertiesState: 'parsing',
  step2_additionalProperties: [],
  step2_customProperties: [],
};

const Model: ResourceCreatorPageModelType = {
  namespace: 'resourceCreatorPage',
  state: initStates,
  effects: {
    * onMount_Page({}: OnMount_Page_Action, { call, put }: EffectsCommandMap) {
      const data: UserModelState['info'] = yield call(userPermission.getUserInfo);
      // console.log(data, 'dataisdjflksdjflkdsjlkj');
      if (!data) {
        return;
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          userInfo: {
            userID: data.userId,
            userName: data.username,
          },
        },
      });
    },
    * onUnmount_Page({}: OnUnmount_Page_Action, { put }: EffectsCommandMap) {

    },
    * onChange_step1_resourceType({ payload }: OnChange_step1_resourceType_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step1_resourceType: payload.value,
        },
      });
    },
    * onChange_step1_resourceName({ payload }: OnChange_step1_resourceName_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step1_resourceName: payload.value,
        },
      });
    },
    * onClick_step1_createBtn({}: OnClick_step1_createBtn_Action, { select, call, put }: EffectsCommandMap) {
      const { resourceCreatorPage } = yield select(({ resourceCreatorPage }: ConnectState) => ({
        resourceCreatorPage,
      }));
      if (resourceCreatorPage.resourceTypeCodes === null) {
        return;
      }
      const params: Parameters<typeof FServiceAPI.Resource.create>[0] = {
        name: resourceCreatorPage.step1_resourceName,
        resourceTypeCode: resourceCreatorPage.step1_resourceType.value,
        resourceTypeName: resourceCreatorPage.step1_resourceType.customInput || undefined,
      };
      const { ret, errCode, msg, data }: {
        ret: number;
        errCode: number;
        msg: string;
        data: {
          resourceId: string;
          resourceName: string;
          resourceType: string[]
          resourceTypeCode: string;
        };
      } = yield call(FServiceAPI.Resource.create, params);
      // console.log(data, 'dataiosdjflkjsdlkfjlksdjlk');
      if (ret !== 0 || errCode !== 0 || !data) {
        self._czc?.push(['_trackEvent', '资源创建页', '创建资源', '', 0]);
        // fMessage('资源创建失败', 'error');
        fMessage(msg, 'error');
        return;
      }
      self._czc?.push(['_trackEvent', '资源创建页', '创建资源', '', 1]);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step: 2,
          step2_resourceInfo: {
            resourceID: data.resourceId,
            resourceName: data.resourceName,
            resourceType: data.resourceType,
            resourceTypeCode: data.resourceTypeCode,
          },
        },
      });
    },
    * onSucceed_step2_localUpload({ payload }: OnSucceed_step2_localUpload_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          step2_fileInfo: payload.value,
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
