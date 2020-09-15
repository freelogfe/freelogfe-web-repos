import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';

export interface StorageObjectEditorModelState {
  info: null | {};
}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<StorageObjectEditorModelState>;
}

interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

export interface StorageObjectEditorModelType {
  namespace: 'storageObjectEditor';
  state: StorageObjectEditorModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<StorageObjectEditorModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: StorageObjectEditorModelType = {
  namespace: 'storageObjectEditor',
  state: {
    info: null,
  },
  effects: {
    * fetchInfo({}, {}) {

    },
  },
  reducers: {
    change(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  subscriptions: {
    setup({}) {

    }
  }
};

export default Model;
