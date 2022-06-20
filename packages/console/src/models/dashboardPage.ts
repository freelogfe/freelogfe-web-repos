import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import {FUtil, FServiceAPI} from '@freelog/tools-lib';

export interface DashboardPageModelState {
  info: null | {};
}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<DashboardPageModelState>;
}

export interface OnMount_Page_Action extends AnyAction {
  type: 'dashboardPage/onMount_Page';
}

export interface OnUnmount_Page_Action extends AnyAction {
  type: 'dashboardPage/OnUnmount_Page';
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

interface DashboardPageModelType {
  namespace: 'dashboardPage';
  state: DashboardPageModelState;
  effects: {
    onMount_Page: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmount_Page: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<DashboardPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: DashboardPageModelState = {
  info: null,
};

const Model: DashboardPageModelType = {
  namespace: 'dashboardPage',
  state: initStates,
  effects: {
    * onMount_Page({}: OnMount_Page_Action, {}: EffectsCommandMap) {
      FServiceAPI.St
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
