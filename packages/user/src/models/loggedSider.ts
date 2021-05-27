import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';

export type LoggedSiderModelState = WholeReadonly<{
  info: null | {};
}>;

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<LoggedSiderModelState>;
}

export interface InitModelStatesAction extends AnyAction {
  type: 'initModelStates';
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

interface LoggedSiderModelType {
  namespace: 'loggedSider';
  state: LoggedSiderModelState;
  effects: {
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    initModelStates: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<LoggedSiderModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: LoggedSiderModelState = {
  info: null,
};

const Model: LoggedSiderModelType = {
  namespace: 'loggedSider',
  state: initStates,
  effects: {
    * fetchInfo({}: FetchInfoAction, {}: EffectsCommandMap) {

    },
    * initModelStates({}: InitModelStatesAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
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
