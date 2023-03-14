import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { IResourceCreateVersionDraft } from '@/type/resourceTypes';
import { PolicyFullInfo_Type } from '@/type/contractTypes';

export type ResourceSiderModelState = {
  state: 'loading' | 'loaded';
  resourceID: string;
  resourceName: string;
  resourceState: '' | 'unreleased' | 'offline' | 'online';
  resourceCover: string;
  resourceType: string[];

  showPage: '' | 'info' | 'auth' | 'versionCreator' | 'versionInfo';
  showVersionPage: string;

  isAuthProblem: boolean;
  policies: PolicyFullInfo_Type[];
  draft: null | IResourceCreateVersionDraft;
};

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<ResourceSiderModelState>;
}

export interface OnMount_Page_Action extends AnyAction {
  type: 'resourceSider/onMount_Page';
}

export interface OnUnmount_Page_Action extends AnyAction {
  type: 'resourceSider/onUnmount_Page';
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

interface ResourceSiderModelType {
  namespace: 'resourceSider';
  state: ResourceSiderModelState;
  effects: {
    onMount_Page: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmount_Page: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceSiderModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: ResourceSiderModelState = {
  state: 'loading',
  resourceID: '',
  resourceName: '',
  resourceState: '',
  resourceCover: '',
  resourceType: [],

  showPage: '',
  showVersionPage: '',

  isAuthProblem: false,
  policies: [],
  draft: null,
};

const Model: ResourceSiderModelType = {
  namespace: 'resourceSider',
  state: initStates,
  effects: {
    * onMount_Page({}: OnMount_Page_Action, {}: EffectsCommandMap) {

    },
    * onUnmount_Page({}: OnUnmount_Page_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * fetchInfo({}: FetchInfoAction, {}: EffectsCommandMap) {

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
    setup({}) {

    },
  },
};

export default Model;
