import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';

export type ResourceCreatorBatchPageState = WholeReadonly<{
  info: null | {};

  showPage: 'resourceType' | 'uploadFile' | 'resourceList';
}>;

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<ResourceCreatorBatchPageState>;
}

export interface OnMount_Page_Action extends AnyAction {
  type: 'resourceCreatorBatchPage/onMount_Page';
}

export interface OnUnmount_Page_Action extends AnyAction {
  type: 'resourceCreatorBatchPage/onUnmount_Page';
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

interface ResourceCreatorBatchPageModelType {
  namespace: 'resourceCreatorBatchPage';
  state: ResourceCreatorBatchPageState;
  effects: {
    onMount_Page: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmount_Page: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceCreatorBatchPageState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: ResourceCreatorBatchPageState = {
  info: null,

  showPage: 'resourceList',
};

const Model: ResourceCreatorBatchPageModelType = {
  namespace: 'resourceCreatorBatchPage',
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
