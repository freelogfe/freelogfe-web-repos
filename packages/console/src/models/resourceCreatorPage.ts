import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import { ConnectState } from '@/models/connect';
import { history } from 'umi';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';

export interface ResourceCreatorPageModelState {
  step: 1 | 2 | 3 | 4;

  step1_resourceType: {
    value: string;
    labels: string[];
    customInput?: string;
  } | null;
  step1_resourceName: string;


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

export interface ResourceCreatorPageModelType {
  namespace: 'resourceCreatorPage';
  state: ResourceCreatorPageModelState;
  effects: {
    onMount_Page: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmount_Page: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;
    onChange_step1_resourceType: (action: OnChange_step1_resourceType_Action, effects: EffectsCommandMap) => void;
    onChange_step1_resourceName: (action: OnChange_step1_resourceName_Action, effects: EffectsCommandMap) => void;
    onClick_step1_createBtn: (action: OnClick_step1_createBtn_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceCreatorPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

export const initStates: ResourceCreatorPageModelState = {
  step: 1,

  step1_resourceType: null,
  step1_resourceName: '',
};

const Model: ResourceCreatorPageModelType = {
  namespace: 'resourceCreatorPage',
  state: initStates,
  effects: {
    * onMount_Page({}: OnMount_Page_Action, { call, put }: EffectsCommandMap) {

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
    * onClick_step1_createBtn({}: OnClick_step1_createBtn_Action, {}: EffectsCommandMap) {

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
