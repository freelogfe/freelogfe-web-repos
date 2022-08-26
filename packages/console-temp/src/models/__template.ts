import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';

export type TempModelState = WholeReadonly<{
  info: null | {};
}>;

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<TempModelState>;
}

export interface OnMount_Page_Action extends AnyAction {
  type: 'temp/onMount_Page';
}

export interface OnUnmount_Page_Action extends AnyAction {
  type: 'temp/onUnmount_Page';
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

interface TempModelType {
  namespace: 'temp';
  state: TempModelState;
  effects: {
    onMount_Page: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmount_Page: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<TempModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: TempModelState = {
  info: null,
};

const Model: TempModelType = {
  namespace: 'temp',
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
