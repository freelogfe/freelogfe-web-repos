import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';

export interface ResourceEditorModelState {

  resourceID: string;

  sider_ResourceInfo: null | {
    cover: string;
    name: string;
    type: string;
    state: 'online' | 'offline' | 'unreleased';
  };
  sider_Versions: string[];
  sider_ShowPage: 'info' | 'auth' | 'versionCreator' | 'string';
  sider_AuthProblem: boolean;
}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<ResourceEditorModelState>;
}

export interface InitModelStatesAction extends AnyAction {
  type: 'initModelStates';
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

interface ResourceEditorModelType {
  namespace: 'resourceEditor';
  state: ResourceEditorModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceEditorModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: ResourceEditorModelState = {
  resourceID: '',

  sider_ResourceInfo: null,
  sider_ShowPage: 'info',
  sider_AuthProblem: false,
  sider_Versions: [],
};

const Model: ResourceEditorModelType = {
  namespace: 'resourceEditor',
  state: initStates,
  effects: {
    * fetchInfo({}: FetchInfoAction, {}: EffectsCommandMap) {

    },
    * initModelStates({}: InitModelStatesAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
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
    setup({}) {

    },
  },
};

export default Model;
